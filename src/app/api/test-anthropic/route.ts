import { NextRequest, NextResponse } from 'next/server';
import { generatePersonalizedWellnessQuestions } from '@/lib/anthropic';

export async function GET() {
  try {
    console.log('Testing Anthropic API...');
    
    const testEmployee = {
      name: 'Test Employee',
      role: 'employee',
      department: 'Deck',
      vessel: 'Test Vessel',
      recentWellnessScores: [3, 4, 3, 4, 4]
    };

    const questions = await generatePersonalizedWellnessQuestions(testEmployee);
    
    return NextResponse.json({
      success: true,
      questionCount: questions.length,
      questions: questions,
      message: 'Anthropic API is working correctly'
    });

  } catch (error: any) {
    console.error('Anthropic test failed:', error);
    return NextResponse.json({
      success: false,
      error: error.message,
      message: 'Anthropic API failed'
    }, { status: 500 });
  }
}