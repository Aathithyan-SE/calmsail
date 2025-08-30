import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import CheckIn from '@/models/CheckIn';
import { requireAuth } from '@/lib/auth';
import { analyzeSentiment } from '@/lib/sentiment';

export async function POST(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await requireAuth();
    const { moodInput, inputType = 'text' } = await request.json();

    // Validation
    if (!moodInput || moodInput.trim().length === 0) {
      return NextResponse.json(
        { error: 'Mood input is required' },
        { status: 400 }
      );
    }

    if (moodInput.length > 1000) {
      return NextResponse.json(
        { error: 'Mood input cannot be more than 1000 characters' },
        { status: 400 }
      );
    }

    // Check if user already checked in today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheckIn = await CheckIn.findOne({
      userId: user.userId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    if (existingCheckIn) {
      return NextResponse.json(
        { error: 'You have already checked in today' },
        { status: 409 }
      );
    }

    // Analyze sentiment
    const sentimentAnalysis = analyzeSentiment(moodInput);

    // Create check-in
    const checkIn = new CheckIn({
      userId: user.userId,
      date: new Date(),
      moodInput: moodInput.trim(),
      inputType,
      sentimentScore: sentimentAnalysis.normalizedScore,
      wellnessScore: sentimentAnalysis.wellnessScore,
      moodCategory: sentimentAnalysis.category,
    });

    await checkIn.save();

    return NextResponse.json(
      {
        message: 'Check-in submitted successfully',
        checkIn: {
          id: checkIn._id,
          date: checkIn.date,
          wellnessScore: checkIn.wellnessScore,
          moodCategory: checkIn.moodCategory,
          sentimentScore: checkIn.sentimentScore,
        },
        analysis: {
          category: sentimentAnalysis.category,
          wellnessScore: sentimentAnalysis.wellnessScore,
          positiveWords: sentimentAnalysis.positiveWords,
          negativeWords: sentimentAnalysis.negativeWords,
        },
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error('Check-in error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    const user = await requireAuth();
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '30');
    const offset = parseInt(searchParams.get('offset') || '0');

    // Get user's check-ins
    const checkIns = await CheckIn.find({ userId: user.userId })
      .sort({ date: -1 })
      .limit(limit)
      .skip(offset)
      .select('date wellnessScore moodCategory sentimentScore moodInput');

    // Get today's check-in status
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const todayCheckIn = await CheckIn.findOne({
      userId: user.userId,
      date: {
        $gte: today,
        $lt: tomorrow,
      },
    });

    return NextResponse.json({
      checkIns: checkIns.map(checkIn => ({
        id: checkIn._id,
        date: checkIn.date,
        wellnessScore: checkIn.wellnessScore,
        moodCategory: checkIn.moodCategory,
        sentimentScore: checkIn.sentimentScore,
        moodInput: checkIn.moodInput,
      })),
      hasCheckedInToday: !!todayCheckIn,
      todayCheckIn: todayCheckIn ? {
        id: todayCheckIn._id,
        wellnessScore: todayCheckIn.wellnessScore,
        moodCategory: todayCheckIn.moodCategory,
        sentimentScore: todayCheckIn.sentimentScore,
      } : null,
    });
  } catch (error: any) {
    console.error('Get check-ins error:', error);
    
    if (error.message === 'Authentication required') {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}