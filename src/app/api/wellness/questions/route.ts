import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessCheck from '@/models/WellnessCheck';
import User from '@/models/User';
import { generatePersonalizedWellnessQuestions } from '@/lib/anthropic';
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

    // Check if user already has questions for today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const existingCheck = await WellnessCheck.findOne({
      userId: user._id,
      date: { $gte: today, $lt: tomorrow }
    });

    if (existingCheck && existingCheck.aiGeneratedQuestions.length > 0) {
      return NextResponse.json({
        questions: existingCheck.aiGeneratedQuestions,
        checkId: existingCheck._id,
        alreadyCompleted: existingCheck.completedAt ? true : false
      });
    }

    // Get recent wellness scores for personalization
    const recentChecks = await WellnessCheck.find({
      userId: user._id,
      completedAt: { $exists: true }
    })
    .sort({ date: -1 })
    .limit(7);

    const recentScores = recentChecks.map(check => check.overallScore / 20); // Convert to 1-5 scale

    // Generate personalized questions
    console.log('Generating questions for user:', user.name, 'Role:', user.role);
    const questions = await generatePersonalizedWellnessQuestions({
      name: user.name,
      role: user.role,
      department: user.department,
      vessel: user.vessel,
      recentWellnessScores: recentScores
    });
    console.log('Generated questions count:', questions.length, 'Questions:', questions);

    // Create or update wellness check record
    let wellnessCheck;
    if (existingCheck) {
      existingCheck.aiGeneratedQuestions = questions;
      wellnessCheck = await existingCheck.save();
    } else {
      wellnessCheck = new WellnessCheck({
        userId: user._id,
        employeeId: user.employeeId,
        date: today,
        aiGeneratedQuestions: questions,
        responses: []
      });
      await wellnessCheck.save();
    }

    return NextResponse.json({
      questions,
      checkId: wellnessCheck._id,
      alreadyCompleted: false
    });

  } catch (error: any) {
    console.error('Error generating wellness questions:', error);
    return NextResponse.json(
      { error: 'Failed to generate wellness questions' },
      { status: 500 }
    );
  }
}