import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessCheck from '@/models/WellnessCheck';
import User from '@/models/User';
import jwt from 'jsonwebtoken';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Get auth token from cookies
    const token = request.cookies.get('auth-token')?.value;
    if (!token) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Verify token and check if user is management
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);
    
    if (!user || user.role !== 'management') {
      return NextResponse.json({ error: 'Unauthorized - Management access required' }, { status: 403 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '7');
    const dateParam = url.searchParams.get('date');
    const vessel = url.searchParams.get('vessel');
    const department = url.searchParams.get('department');

    // Calculate date range
    let endDate: Date;
    let startDate: Date;
    
    if (dateParam) {
      // If specific date provided, use it as the end date
      endDate = new Date(dateParam);
      endDate.setHours(23, 59, 59, 999); // End of selected day
      startDate = new Date(dateParam);
      startDate.setDate(startDate.getDate() - days);
      startDate.setHours(0, 0, 0, 0);
    } else {
      // Default to current date range
      endDate = new Date();
      startDate = new Date();
      startDate.setDate(startDate.getDate() - days);
    }

    // Build query filters
    const matchConditions: any = {
      completedAt: { $exists: true },
      date: { $gte: startDate, $lte: endDate }
    };

    if (vessel) matchConditions.vessel = vessel;
    if (department) matchConditions.department = department;

    // Aggregate team wellness data
    const teamData = await WellnessCheck.aggregate([
      {
        $lookup: {
          from: 'users',
          localField: 'userId',
          foreignField: '_id',
          as: 'user'
        }
      },
      { $unwind: '$user' },
      { $match: matchConditions },
      {
        $group: {
          _id: {
            userId: '$userId',
            date: { $dateToString: { format: '%Y-%m-%d', date: '$date' } }
          },
          name: { $first: '$user.name' },
          role: { $first: '$user.role' },
          vessel: { $first: '$user.vessel' },
          department: { $first: '$user.department' },
          employeeId: { $first: '$user.employeeId' },
          wellnessScore: { $first: '$overallScore' },
          stressLevel: { $first: '$stressLevel' },
          energyLevel: { $first: '$energyLevel' },
          workSatisfaction: { $first: '$workSatisfaction' },
          date: { $first: '$date' },
          responses: { $first: '$responses' }
        }
      },
      { $sort: { date: -1, name: 1 } }
    ]);

    // Get selected date's check-in status for all employees
    const selectedDateStart = dateParam ? new Date(dateParam) : new Date();
    selectedDateStart.setHours(0, 0, 0, 0);
    const selectedDateEnd = new Date(selectedDateStart);
    selectedDateEnd.setDate(selectedDateEnd.getDate() + 1);

    const selectedDateCheckIns = await WellnessCheck.find({
      date: { $gte: selectedDateStart, $lt: selectedDateEnd },
      completedAt: { $exists: true }
    }).populate('userId', 'name employeeId vessel department');

    const selectedDateCheckInIds = new Set(selectedDateCheckIns.map(check => check.userId.toString()));

    // Get all employees
    const allEmployees = await User.find({ role: 'employee' })
      .select('name employeeId vessel department')
      .lean();
    

    const employeeStatus = allEmployees.map(emp => {
      const checkIn = selectedDateCheckIns.find(check => 
        check.userId.toString() === emp._id.toString()
      );
      
      return {
        ...emp,
        hasCheckedInToday: selectedDateCheckInIds.has(emp._id.toString()),
        todayWellnessScore: checkIn?.overallScore || null,
        checkInDate: checkIn ? checkIn.date : null,
        checkInTime: checkIn ? checkIn.completedAt : null
      };
    });

    // Calculate summary statistics
    const recentScores = teamData
      .filter(item => new Date(item.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
      .map(item => item.wellnessScore);

    const averageWellness = recentScores.length > 0 
      ? recentScores.reduce((a, b) => a + b, 0) / recentScores.length 
      : 0;

    const lowScoreAlerts = recentScores.filter(score => score < 50).length;
    
    const complianceRate = allEmployees.length > 0 
      ? (selectedDateCheckIns.length / allEmployees.length) * 100 
      : 0;

    // Get trend data (last 14 days)
    const trendData = await WellnessCheck.aggregate([
      {
        $match: {
          completedAt: { $exists: true },
          date: { $gte: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000) }
        }
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$date' } },
          averageScore: { $avg: '$overallScore' },
          checkInCount: { $sum: 1 },
          date: { $first: '$date' }
        }
      },
      { $sort: { date: 1 } }
    ]);

    return NextResponse.json({
      teamData,
      employeeStatus,
      todayCheckIns: selectedDateCheckIns.length,
      totalEmployees: allEmployees.length,
      selectedDate: dateParam || new Date().toISOString().split('T')[0],
      statistics: {
        averageWellness: Math.round(averageWellness * 10) / 10,
        complianceRate: Math.round(complianceRate * 10) / 10,
        lowScoreAlerts,
        totalResponses: teamData.length
      },
      trendData,
      alerts: generateAlerts(teamData, employeeStatus)
    });

  } catch (error: any) {
    console.error('Error fetching team wellness data:', error);
    return NextResponse.json(
      { error: 'Failed to fetch team wellness data' },
      { status: 500 }
    );
  }
}

function generateAlerts(teamData: any[], employeeStatus: any[]): any[] {
  const alerts = [];

  // Check for employees who haven't checked in today
  const missedCheckIns = employeeStatus.filter(emp => !emp.hasCheckedInToday);
  if (missedCheckIns.length > 0) {
    alerts.push({
      type: 'missed_checkin',
      severity: 'medium',
      count: missedCheckIns.length,
      message: `${missedCheckIns.length} employees haven't completed today's wellness check-in`,
      employees: missedCheckIns.map(emp => emp.name)
    });
  }

  // Check for low wellness scores today
  const todayLowScores = employeeStatus.filter(emp => 
    emp.todayWellnessScore !== null && emp.todayWellnessScore < 50
  );
  if (todayLowScores.length > 0) {
    alerts.push({
      type: 'low_wellness',
      severity: 'high',
      count: todayLowScores.length,
      message: `${todayLowScores.length} employees have concerning wellness scores today`,
      employees: todayLowScores.map(emp => emp.name)
    });
  }

  // Check for consistent low scores (last 3 days)
  const consistentlyLow = [];
  const employeeGroups = teamData.reduce((acc, item) => {
    if (!acc[item._id.userId]) acc[item._id.userId] = [];
    acc[item._id.userId].push(item);
    return acc;
  }, {});

  Object.values(employeeGroups).forEach((employeeData: any) => {
    const recentScores = employeeData
      .sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .slice(0, 3)
      .map((item: any) => item.wellnessScore);
    
    if (recentScores.length >= 3 && recentScores.every(score => score < 60)) {
      consistentlyLow.push(employeeData[0].name);
    }
  });

  if (consistentlyLow.length > 0) {
    alerts.push({
      type: 'trend_concern',
      severity: 'high',
      count: consistentlyLow.length,
      message: `${consistentlyLow.length} employees showing consistently low wellness scores`,
      employees: consistentlyLow
    });
  }

  return alerts;
}