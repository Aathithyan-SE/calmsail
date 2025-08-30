'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import WellnessCheckIn from '@/components/wellness/WellnessCheckIn';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUserData();
  }, []);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    } finally {
      setIsLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      router.push('/auth/login');
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🌊</div>
          <div>Loading your dashboard...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-800">🌊 CalmSail</h1>
              <div className="text-sm text-muted-foreground">
                Daily Wellness Check-in • Welcome, {user?.name}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" size="sm" onClick={() => router.push('/privacy')}>
                Privacy Policy
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <Alert variant="destructive" className="mb-8">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Daily Wellness Check-in */}
        <div className="space-y-8">
          <div className="text-center space-y-2">
            <h2 className="text-2xl font-bold">Daily Wellness Check-in</h2>
            <p className="text-muted-foreground">
              Answer 5 quick questions about your wellbeing today. Takes just 2-3 minutes.
            </p>
          </div>
          
          <div className="flex justify-center">
            <WellnessCheckIn />
          </div>
        </div>


        {/* Support Resources - Always visible at bottom */}
        <div className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Support Resources</CardTitle>
              <CardDescription>
                Remember, you're not alone. Help is always available.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <h4 className="font-medium">24/7 Crisis Support</h4>
                <p className="text-sm text-muted-foreground">
                  National Suicide Prevention Lifeline: 988
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Employee Assistance</h4>
                <p className="text-sm text-muted-foreground">
                  Contact your HR department for confidential counseling services.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Medical Support</h4>
                <p className="text-sm text-muted-foreground">
                  Reach out to the ship's medical officer if you need immediate assistance.
                </p>
              </div>
              <div className="space-y-2">
                <h4 className="font-medium">Peer Support</h4>
                <p className="text-sm text-muted-foreground">
                  Talk to trusted colleagues or your supervisor if you're struggling.
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}