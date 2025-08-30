'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  AreaChart,
  Area
} from 'recharts';
import { 
  TrendingUp, 
  TrendingDown, 
  Minus, 
  Heart, 
  Brain, 
  Zap, 
  Calendar,
  Target,
  AlertTriangle
} from 'lucide-react';

interface WellnessHistory {
  date: string;
  overallScore: number;
  mood?: string;
  stressLevel?: number;
  energyLevel?: number;
  workSatisfaction?: number;
}

interface WellnessStats {
  totalCheckins: number;
  averageScore: number;
  recentAverage: number;
  trend: 'improving' | 'declining' | 'stable';
  averageStress: number;
  averageEnergy: number;
  consistencyScore: number;
}

export default function WellnessDashboard() {
  const [history, setHistory] = useState<WellnessHistory[]>([]);
  const [stats, setStats] = useState<WellnessStats | null>(null);
  const [insights, setInsights] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState(30);

  useEffect(() => {
    fetchWellnessHistory();
  }, [timeRange]);

  const fetchWellnessHistory = async () => {
    try {
      const response = await fetch(`/api/wellness/history?days=${timeRange}`);
      const data = await response.json();
      
      if (response.ok) {
        setHistory(data.history);
        setStats(data.statistics);
        setInsights(data.insights);
      }
    } catch (error) {
      console.error('Failed to fetch wellness history:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatChartData = () => {
    return history
      .slice(0, 14) // Last 14 days
      .reverse()
      .map((check) => ({
        date: new Date(check.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        score: check.overallScore,
        stress: check.stressLevel || 0,
        energy: check.energyLevel || 0,
        satisfaction: check.workSatisfaction || 0
      }));
  };

  const getTrendIcon = (trend: string) => {
    switch (trend) {
      case 'improving':
        return <TrendingUp className="h-4 w-4 text-green-500" />;
      case 'declining':
        return <TrendingDown className="h-4 w-4 text-red-500" />;
      default:
        return <Minus className="h-4 w-4 text-gray-500" />;
    }
  };

  const getTrendColor = (trend: string) => {
    switch (trend) {
      case 'improving':
        return 'text-green-600 bg-green-50';
      case 'declining':
        return 'text-red-600 bg-red-50';
      default:
        return 'text-gray-600 bg-gray-50';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-green-600';
    if (score >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[...Array(4)].map((_, i) => (
            <Card key={i}>
              <CardContent className="p-6">
                <div className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Time Range Selector */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold">Wellness Dashboard</h2>
        <div className="flex gap-2">
          {[7, 14, 30].map((days) => (
            <Button
              key={days}
              variant={timeRange === days ? 'default' : 'outline'}
              size="sm"
              onClick={() => setTimeRange(days)}
            >
              {days} days
            </Button>
          ))}
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Current Score</p>
                <p className={`text-3xl font-bold ${getScoreColor(stats?.recentAverage || 0)}`}>
                  {stats?.recentAverage.toFixed(0) || 0}%
                </p>
              </div>
              <Target className="h-8 w-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Trend</p>
                <div className="flex items-center space-x-2">
                  {getTrendIcon(stats?.trend || 'stable')}
                  <Badge className={getTrendColor(stats?.trend || 'stable')}>
                    {stats?.trend || 'stable'}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Check-ins</p>
                <p className="text-3xl font-bold">{stats?.totalCheckins || 0}</p>
              </div>
              <Calendar className="h-8 w-8 text-green-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-muted-foreground">Consistency</p>
                <p className="text-3xl font-bold">{stats?.consistencyScore || 0}%</p>
              </div>
              <div className="h-8 w-8">
                <Progress value={stats?.consistencyScore || 0} className="h-2" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Wellness Score Trend */}
        <Card>
          <CardHeader>
            <CardTitle>Wellness Score Trend</CardTitle>
            <CardDescription>Your wellness scores over time</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 100]} />
                <Tooltip />
                <Area
                  type="monotone"
                  dataKey="score"
                  stroke="#3b82f6"
                  fill="#3b82f6"
                  fillOpacity={0.1}
                />
              </AreaChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Multi-metric Chart */}
        <Card>
          <CardHeader>
            <CardTitle>Detailed Metrics</CardTitle>
            <CardDescription>Stress, energy, and satisfaction levels</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={formatChartData()}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis domain={[0, 10]} />
                <Tooltip />
                <Line
                  type="monotone"
                  dataKey="stress"
                  stroke="#ef4444"
                  strokeWidth={2}
                  name="Stress"
                />
                <Line
                  type="monotone"
                  dataKey="energy"
                  stroke="#22c55e"
                  strokeWidth={2}
                  name="Energy"
                />
                <Line
                  type="monotone"
                  dataKey="satisfaction"
                  stroke="#8b5cf6"
                  strokeWidth={2}
                  name="Satisfaction"
                />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Detailed Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Heart className="h-6 w-6 text-red-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Stress Level</p>
                <p className="text-2xl font-bold">{stats?.averageStress.toFixed(1) || 0}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Zap className="h-6 w-6 text-yellow-500" />
              <div>
                <p className="text-sm text-muted-foreground">Avg Energy Level</p>
                <p className="text-2xl font-bold">{stats?.averageEnergy.toFixed(1) || 0}/10</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center space-x-3">
              <Target className="h-6 w-6 text-blue-500" />
              <div>
                <p className="text-sm text-muted-foreground">Overall Average</p>
                <p className="text-2xl font-bold">{stats?.averageScore.toFixed(0) || 0}%</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* AI Insights */}
      {insights.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Brain className="h-5 w-5" />
              <span>AI Insights</span>
            </CardTitle>
            <CardDescription>
              Personalized insights based on your wellness patterns
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {insights.map((insight, index) => (
                <li key={index} className="flex items-start space-x-3">
                  <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                  <span className="text-sm">{insight}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      )}

      {/* Support Resources */}
      {stats && stats.recentAverage < 60 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2 text-yellow-800">
              <AlertTriangle className="h-5 w-5" />
              <span>Wellness Support</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-yellow-700 mb-4">
              Your recent wellness scores suggest you might benefit from additional support. 
              Consider reaching out to your manager or wellness team.
            </p>
            <Button variant="outline" size="sm">
              Contact Wellness Team
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );
}