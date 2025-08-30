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

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get query parameters
    const url = new URL(request.url);
    const days = parseInt(url.searchParams.get('days') || '30');
    const limit = parseInt(url.searchParams.get('limit') || '50');
    const targetUserId = url.searchParams.get('userId'); // For management to view specific employee

    // Calculate date range
    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(startDate.getDate() - days);

    // Determine which user's data to fetch
    let queryUserId = user._id;
    if (targetUserId && user.role === 'management') {
      // Management can view specific employee data
      queryUserId = targetUserId;
    }

    // Fetch wellness history
    const wellnessHistory = await WellnessCheck.find({
      userId: queryUserId,
      completedAt: { $exists: true },
      date: { $gte: startDate, $lte: endDate }
    })
    .sort({ date: -1 })
    .limit(limit)
    .select('date overallScore mood stressLevel energyLevel workSatisfaction responses completedAt');

    // Calculate statistics
    const scores = wellnessHistory.map(check => check.overallScore);
    const averageScore = scores.length > 0 
      ? scores.reduce((a, b) => a + b, 0) / scores.length 
      : 0;

    const last7Days = wellnessHistory.slice(0, 7);
    const recentAverage = last7Days.length > 0
      ? last7Days.reduce((sum, check) => sum + check.overallScore, 0) / last7Days.length
      : 0;

    // Trend analysis
    const trend = calculateTrend(scores.slice(0, 14)); // Last 14 days for trend

    // Identify patterns
    const stressLevels = wellnessHistory
      .filter(check => check.stressLevel)
      .map(check => check.stressLevel);
    
    const averageStress = stressLevels.length > 0
      ? stressLevels.reduce((a, b) => a + b, 0) / stressLevels.length
      : 0;

    const energyLevels = wellnessHistory
      .filter(check => check.energyLevel)
      .map(check => check.energyLevel);
    
    const averageEnergy = energyLevels.length > 0
      ? energyLevels.reduce((a, b) => a + b, 0) / energyLevels.length
      : 0;

    return NextResponse.json({
      history: wellnessHistory,
      statistics: {
        totalCheckins: wellnessHistory.length,
        averageScore: Math.round(averageScore * 10) / 10,
        recentAverage: Math.round(recentAverage * 10) / 10,
        trend: trend,
        averageStress: Math.round(averageStress * 10) / 10,
        averageEnergy: Math.round(averageEnergy * 10) / 10,
        consistencyScore: calculateConsistency(wellnessHistory, days)
      },
      insights: generateInsights(wellnessHistory, averageScore, trend)
    });

  } catch (error: any) {
    console.error('Error fetching wellness history:', error);
    return NextResponse.json(
      { error: 'Failed to fetch wellness history' },
      { status: 500 }
    );
  }
}

function calculateTrend(scores: number[]): 'improving' | 'declining' | 'stable' {
  if (scores.length < 5) return 'stable';
  
  const firstHalf = scores.slice(-Math.ceil(scores.length / 2));
  const secondHalf = scores.slice(0, Math.floor(scores.length / 2));
  
  const firstAvg = firstHalf.reduce((a, b) => a + b, 0) / firstHalf.length;
  const secondAvg = secondHalf.reduce((a, b) => a + b, 0) / secondHalf.length;
  
  const difference = firstAvg - secondAvg;
  
  if (difference > 5) return 'improving';
  if (difference < -5) return 'declining';
  return 'stable';
}

function calculateConsistency(history: any[], days: number): number {
  const expectedCheckins = Math.min(days, 30); // Max 30 days for consistency calc
  const actualCheckins = history.length;
  return Math.round((actualCheckins / expectedCheckins) * 100);
}

function generateInsights(history: any[], averageScore: number, trend: string): string[] {
  const insights: string[] = [];
  
  if (averageScore >= 80) {
    insights.push("You're maintaining excellent wellness levels!");
  } else if (averageScore >= 60) {
    insights.push("Your wellness is in a healthy range with room for improvement.");
  } else {
    insights.push("Your wellness scores suggest you may need additional support.");
  }
  
  if (trend === 'improving') {
    insights.push("Great news! Your wellness trend is improving over time.");
  } else if (trend === 'declining') {
    insights.push("Your wellness trend shows some decline - consider reaching out for support.");
  }
  
  if (history.length >= 7) {
    const recentScores = history.slice(0, 7);
    const lowScoreDays = recentScores.filter(check => check.overallScore < 50).length;
    
    if (lowScoreDays >= 3) {
      insights.push("You've had several challenging days recently - please consider talking to someone.");
    }
  }
  
  return insights;
}