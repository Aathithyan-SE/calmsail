import { NextRequest, NextResponse } from 'next/server';
import connectToDatabase from '@/lib/mongodb';
import WellnessCheck from '@/models/WellnessCheck';
import User from '@/models/User';
import { calculateWellnessScore } from '@/lib/anthropic';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
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

    const { 
      checkId, 
      responses, 
      mood, 
      stressLevel, 
      energyLevel, 
      workSatisfaction 
    } = await request.json();

    // Validate required fields
    if (!checkId || !responses || !Array.isArray(responses)) {
      return NextResponse.json(
        { error: 'Check ID and responses are required' },
        { status: 400 }
      );
    }

    // Find the wellness check
    const wellnessCheck = await WellnessCheck.findById(checkId);
    if (!wellnessCheck) {
      return NextResponse.json(
        { error: 'Wellness check not found' },
        { status: 404 }
      );
    }

    // Verify ownership
    if (wellnessCheck.userId.toString() !== user._id.toString()) {
      return NextResponse.json(
        { error: 'Unauthorized access to wellness check' },
        { status: 403 }
      );
    }

    // Check if already completed
    if (wellnessCheck.completedAt) {
      return NextResponse.json(
        { error: 'Wellness check already completed today' },
        { status: 400 }
      );
    }

    // Calculate wellness score using AI
    const { score, insights } = await calculateWellnessScore(responses, {
      name: user.name,
      role: user.role,
      department: user.department,
      vessel: user.vessel
    });

    // Convert responses to include individual scores (1-5 based on answer sentiment/length)
    const scoredResponses = responses.map((response: any) => {
      // Simple scoring based on answer positivity and length
      const answerLength = response.answer.length;
      const positiveWords = ['good', 'great', 'excellent', 'fine', 'well', 'positive', 'happy', 'satisfied'];
      const negativeWords = ['bad', 'terrible', 'awful', 'stressed', 'tired', 'overwhelmed', 'difficult'];
      
      let individualScore = 3; // Default neutral score
      
      const lowerAnswer = response.answer.toLowerCase();
      const positiveCount = positiveWords.filter(word => lowerAnswer.includes(word)).length;
      const negativeCount = negativeWords.filter(word => lowerAnswer.includes(word)).length;
      
      if (positiveCount > negativeCount) {
        individualScore = Math.min(5, 3 + positiveCount);
      } else if (negativeCount > positiveCount) {
        individualScore = Math.max(1, 3 - negativeCount);
      }
      
      // Adjust based on answer length (more detailed = potentially more engaged)
      if (answerLength > 50) individualScore = Math.min(5, individualScore + 0.5);
      if (answerLength < 10) individualScore = Math.max(1, individualScore - 0.5);
      
      return {
        question: response.question,
        answer: response.answer,
        score: Math.round(individualScore)
      };
    });

    // Update wellness check
    wellnessCheck.responses = scoredResponses;
    wellnessCheck.overallScore = score;
    wellnessCheck.completedAt = new Date();
    wellnessCheck.mood = mood;
    wellnessCheck.stressLevel = stressLevel;
    wellnessCheck.energyLevel = energyLevel;
    wellnessCheck.workSatisfaction = workSatisfaction;

    await wellnessCheck.save();

    // Return results
    return NextResponse.json({
      message: 'Wellness check completed successfully',
      wellnessScore: score,
      insights: insights,
      checkId: wellnessCheck._id,
      breakdown: {
        mood,
        stressLevel,
        energyLevel,
        workSatisfaction,
        responseScores: scoredResponses.map(r => r.score)
      }
    });

  } catch (error: any) {
    console.error('Error submitting wellness check:', error);
    return NextResponse.json(
      { error: 'Failed to submit wellness check' },
      { status: 500 }
    );
  }
}