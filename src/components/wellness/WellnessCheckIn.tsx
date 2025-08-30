'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Progress } from '@/components/ui/progress';
import { Heart, Brain, Zap, Briefcase, CheckCircle, AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface WellnessQuestion {
  question: string;
  answer: string;
}

export default function WellnessCheckIn() {
  const [questions, setQuestions] = useState<string[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [responses, setResponses] = useState<WellnessQuestion[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState('');
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [checkId, setCheckId] = useState('');
  const [completed, setCompleted] = useState(false);
  const [result, setResult] = useState<any>(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchTodaysQuestions();
  }, []);

  const fetchTodaysQuestions = async () => {
    try {
      console.log('WellnessCheckIn: Fetching questions from /api/wellness/questions');
      const response = await fetch('/api/wellness/questions');
      const data = await response.json();
      
      console.log('WellnessCheckIn: API response:', {
        status: response.status,
        ok: response.ok,
        questionCount: data.questions?.length,
        questions: data.questions?.slice(0, 3), // First 3 questions for debugging
        alreadyCompleted: data.alreadyCompleted
      });
      
      if (response.ok) {
        setQuestions(data.questions);
        setCheckId(data.checkId);
        setCompleted(data.alreadyCompleted);
        
        console.log('WellnessCheckIn: Set questions state with', data.questions.length, 'questions');
        
        if (data.alreadyCompleted) {
          setCurrentQuestion(data.questions.length);
        }
      } else {
        setError(data.error || 'Failed to load wellness questions');
      }
    } catch (err) {
      console.error('WellnessCheckIn: Network error:', err);
      setError('Network error loading wellness questions');
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSubmit = async () => {
    if (!currentAnswer.trim()) return;

    const newResponse: WellnessQuestion = {
      question: questions[currentQuestion],
      answer: currentAnswer
    };

    const updatedResponses = [...responses, newResponse];
    setResponses(updatedResponses);
    setCurrentAnswer('');

    // If this is the last question, submit automatically
    if (currentQuestion === questions.length - 1) {
      setSubmitting(true);
      
      try {
        const response = await fetch('/api/wellness/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            checkId,
            responses: updatedResponses,
            mood: 'Good', // Default values since we're not collecting summary
            stressLevel: 5,
            energyLevel: 5,
            workSatisfaction: 7
          })
        });

        const data = await response.json();
        
        if (response.ok) {
          setResult(data);
          setCompleted(true);
        } else {
          setError(data.error || 'Failed to submit wellness check');
        }
      } catch (err) {
        setError('Network error submitting wellness check');
      } finally {
        setSubmitting(false);
      }
    } else {
      setCurrentQuestion(currentQuestion + 1);
    }
  };


  if (loading) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Loading your personalized wellness questions...</p>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  if (completed && result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle>Thank You!</CardTitle>
          <CardDescription>Your daily wellness check-in has been completed successfully</CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-6 text-center">
          <div className="bg-green-50 p-6 rounded-lg">
            <Heart className="h-8 w-8 text-green-600 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-800 mb-2">
              Your Wellbeing Matters
            </h3>
            <p className="text-green-700">
              Thank you for taking time to check in with yourself today. Your responses help us ensure a safe and supportive work environment for everyone.
            </p>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>What happens next?</strong><br />
              Your responses are analyzed by our AI system and shared confidentially with management to ensure appropriate support is available when needed.
            </p>
          </div>

          <div className="text-muted-foreground text-sm">
            Please return tomorrow for your next daily wellness check-in.
          </div>
        </CardContent>
      </Card>
    );
  }

  if (completed && !result) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <CheckCircle className="h-12 w-12 text-green-500 mx-auto mb-4" />
          <CardTitle className="mb-2">Daily Check-in Complete!</CardTitle>
          <CardDescription className="mb-6">
            Thank you for completing your wellness check-in today. Please return tomorrow for your next daily check-in.
          </CardDescription>
          <div className="bg-blue-50 p-4 rounded-lg">
            <p className="text-sm text-blue-700">
              <strong>Remember:</strong> You can only complete one wellness check-in per day to ensure accurate tracking and maintain the daily routine.
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Questions phase
  if (currentQuestion < questions.length) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <div className="flex justify-between items-center mb-4">
            <CardTitle>Daily Wellness Check</CardTitle>
            <span className="text-sm text-muted-foreground">
              Question {currentQuestion + 1} of {questions.length}
            </span>
          </div>
          <Progress value={(currentQuestion / questions.length) * 100} className="mb-4" />
          <div className="text-xs text-muted-foreground text-center">
            AI-Generated Question • {Math.max(0, questions.length - currentQuestion - 1)} remaining
          </div>
        </CardHeader>
        
        <CardContent>
          <div className="space-y-4">
            <Label className="text-lg font-medium">
              {questions[currentQuestion]}
            </Label>
            
            <Textarea
              placeholder="Take your time to share how you're feeling..."
              value={currentAnswer}
              onChange={(e) => setCurrentAnswer(e.target.value)}
              rows={4}
              className="resize-none"
            />
          </div>
        </CardContent>
        
        <CardFooter>
          <Button 
            onClick={handleAnswerSubmit}
            disabled={!currentAnswer.trim()}
            className="w-full"
          >
{currentQuestion === questions.length - 1 ? 'Submit Wellness Check' : `Next Question (${currentQuestion + 1}/${questions.length})`}
          </Button>
        </CardFooter>
      </Card>
    );
  }

  // Show processing screen while submitting
  if (submitting) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
          <p>Processing your wellness check-in...</p>
        </CardContent>
      </Card>
    );
  }
}