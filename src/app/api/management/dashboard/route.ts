import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import User from '@/models/User';
import CheckIn from '@/models/CheckIn';
import { requireManagementAuth } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();
    await requireManagementAuth();

    const { searchParams } = new URL(request.url);
    const timeframe = searchParams.get('timeframe') || '7'; // days

    const daysAgo = parseInt(timeframe);
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - daysAgo);

    // Get all active employees
    const employees = await User.find({ 
      role: 'employee', 
      isActive: true 
    }).select('name email employeeId vessel department');

    // Get recent check-ins for all employees
    const recentCheckIns = await CheckIn.find({
      date: { $gte: startDate }
    }).populate('userId', 'name email employeeId');

    // Get today's check-ins
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIns = await CheckIn.find({
      date: { $gte: today, $lt: tomorrow }
    }).populate('userId', 'name email employeeId');

    // Create employee wellness summary
    const employeeData = await Promise.all(
      employees.map(async (employee) => {
        // Get employee's recent check-ins
        const employeeCheckIns = recentCheckIns.filter(
          checkIn => checkIn.userId._id.toString() === employee._id.toString()
        );

        // Get today's check-in
        const todayCheckIn = todayCheckIns.find(
          checkIn => checkIn.userId._id.toString() === employee._id.toString()
        );

        // Calculate metrics
        const avgWellnessScore = employeeCheckIns.length > 0
          ? Math.round(employeeCheckIns.reduce((sum, ci) => sum + ci.wellnessScore, 0) / employeeCheckIns.length)
          : null;

        const latestCheckIn = employeeCheckIns
          .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())[0];

        // Risk assessment
        let riskLevel = 'unknown';
        let riskScore = 0;

        if (latestCheckIn) {
          if (latestCheckIn.moodCategory === 'high_risk') {
            riskLevel = 'high';
            riskScore = 4;
          } else if (latestCheckIn.moodCategory === 'stressed') {
            riskLevel = 'medium';
            riskScore = 3;
          } else if (latestCheckIn.moodCategory === 'neutral') {
            riskLevel = 'low';
            riskScore = 2;
          } else if (latestCheckIn.moodCategory === 'positive') {
            riskLevel = 'very_low';
            riskScore = 1;
          }
        }

        // Check for concerning patterns
        const highRiskCheckIns = employeeCheckIns.filter(ci => ci.moodCategory === 'high_risk').length;
        const stressedCheckIns = employeeCheckIns.filter(ci => ci.moodCategory === 'stressed').length;
        
        const concerningPattern = (highRiskCheckIns > 0) || 
                                 (stressedCheckIns >= Math.ceil(employeeCheckIns.length * 0.4));

        return {
          id: employee._id,
          name: employee.name,
          email: employee.email,
          employeeId: employee.employeeId,
          vessel: employee.vessel,
          department: employee.department,
          avgWellnessScore,
          latestWellnessScore: latestCheckIn?.wellnessScore || null,
          latestCheckIn: latestCheckIn?.date || null,
          riskLevel,
          riskScore,
          hasCheckedInToday: !!todayCheckIn,
          checkInStreak: employeeCheckIns.length,
          concerningPattern,
          totalCheckIns: employeeCheckIns.length,
          moodCategories: {
            positive: employeeCheckIns.filter(ci => ci.moodCategory === 'positive').length,
            neutral: employeeCheckIns.filter(ci => ci.moodCategory === 'neutral').length,
            stressed: employeeCheckIns.filter(ci => ci.moodCategory === 'stressed').length,
            high_risk: employeeCheckIns.filter(ci => ci.moodCategory === 'high_risk').length,
          }
        };
      })
    );

    // Sort by risk score (highest first), then by wellness score (lowest first)
    employeeData.sort((a, b) => {
      if (a.riskScore !== b.riskScore) {
        return b.riskScore - a.riskScore;
      }
      if (a.latestWellnessScore && b.latestWellnessScore) {
        return a.latestWellnessScore - b.latestWellnessScore;
      }
      return 0;
    });

    // Calculate overall statistics
    const totalEmployees = employees.length;
    const checkedInToday = todayCheckIns.length;
    const highRiskEmployees = employeeData.filter(emp => emp.riskLevel === 'high').length;
    const mediumRiskEmployees = employeeData.filter(emp => emp.riskLevel === 'medium').length;

    const overallStats = {
      totalEmployees,
      checkedInToday,
      checkInRate: totalEmployees > 0 ? Math.round((checkedInToday / totalEmployees) * 100) : 0,
      highRiskEmployees,
      mediumRiskEmployees,
      avgWellnessScore: employeeData.filter(emp => emp.avgWellnessScore !== null).length > 0
        ? Math.round(
            employeeData
              .filter(emp => emp.avgWellnessScore !== null)
              .reduce((sum, emp) => sum + emp.avgWellnessScore!, 0) /
            employeeData.filter(emp => emp.avgWellnessScore !== null).length
          )
        : null,
    };

    return NextResponse.json({
      employees: employeeData,
      stats: overallStats,
      timeframe: daysAgo,
    });

  } catch (error: any) {
    console.error('Management dashboard error:', error);
    
    if (error.message === 'Management access required' || error.message === 'Authentication required') {
      return NextResponse.json(
        { error: error.message },
        { status: 403 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}