'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';

interface CheckInFormProps {
  onSubmit: (data: any) => void;
  hasCheckedInToday: boolean;
  todayCheckIn?: any;
}

export default function CheckInForm({ onSubmit, hasCheckedInToday, todayCheckIn }: CheckInFormProps) {
  const [moodInput, setMoodInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/checkin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ moodInput, inputType: 'text' }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'An error occurred');
      }

      setSuccess(true);
      setMoodInput('');
      onSubmit(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positive':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'neutral':
        return 'bg-gray-100 text-gray-800 border-gray-200';
      case 'stressed':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'high_risk':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getCategoryLabel = (category: string) => {
    switch (category) {
      case 'positive':
        return 'Positive';
      case 'neutral':
        return 'Neutral';
      case 'stressed':
        return 'Needs Support';
      case 'high_risk':
        return 'Requires Attention';
      default:
        return 'Unknown';
    }
  };

  if (hasCheckedInToday && todayCheckIn) {
    return (
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            ✅ Today's Check-In Complete
          </CardTitle>
          <CardDescription>
            Thank you for checking in today. Your wellness is important to us.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Wellness Score</span>
            <div className="flex items-center gap-2">
              <Progress value={todayCheckIn.wellnessScore} className="w-32" />
              <span className="text-sm font-semibold">{todayCheckIn.wellnessScore}%</span>
            </div>
          </div>
          
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Status</span>
            <Badge className={getCategoryColor(todayCheckIn.moodCategory)}>
              {getCategoryLabel(todayCheckIn.moodCategory)}
            </Badge>
          </div>

          <Alert>
            <AlertDescription>
              Your responses are confidential and used only for wellness tracking. 
              Come back tomorrow for your next check-in.
            </AlertDescription>
          </Alert>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-2xl">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          🌊 Daily Wellness Check-In
        </CardTitle>
        <CardDescription>
          Share how you're feeling today. Your responses are confidential and help us support your wellbeing.
        </CardDescription>
      </CardHeader>
      
      <form onSubmit={handleSubmit}>
        <CardContent className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {success && (
            <Alert>
              <AlertDescription>
                Thank you for your check-in! Your wellness data has been recorded securely.
              </AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="moodInput">
              How are you feeling today? Share your thoughts, concerns, or what's on your mind.
            </Label>
            <Textarea
              id="moodInput"
              value={moodInput}
              onChange={(e) => setMoodInput(e.target.value)}
              placeholder="I'm feeling... Today has been... I'm worried about... I'm excited about..."
              rows={6}
              maxLength={1000}
              required
              className="resize-none"
            />
            <div className="text-right text-xs text-muted-foreground">
              {moodInput.length}/1000 characters
            </div>
          </div>

          <Button type="submit" className="w-full" disabled={isLoading || moodInput.trim().length === 0}>
            {isLoading ? 'Submitting...' : 'Submit Check-In'}
          </Button>

          <Alert>
            <AlertDescription className="text-xs">
              <strong>Privacy Notice:</strong> Your responses are encrypted and confidential. 
              Only wellness scores (not your actual responses) are shared with management for crew safety purposes.
            </AlertDescription>
          </Alert>
        </CardContent>
      </form>
    </Card>
  );
}