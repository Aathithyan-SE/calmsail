'use client';

import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

interface CheckInData {
  id: string;
  date: string;
  wellnessScore: number;
  moodCategory: string;
  sentimentScore: number;
}

interface WellnessChartProps {
  checkIns: CheckInData[];
}

export default function WellnessChart({ checkIns }: WellnessChartProps) {
  if (!checkIns || checkIns.length === 0) {
    return (
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Wellness Trends</CardTitle>
          <CardDescription>Your wellness journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 text-muted-foreground">
            No check-in data available yet. Complete your daily check-ins to see your wellness trends.
          </div>
        </CardContent>
      </Card>
    );
  }

  // Process data for charts
  const chartData = checkIns
    .slice(0, 30) // Last 30 days
    .reverse() // Show chronological order
    .map((checkIn, index) => ({
      date: new Date(checkIn.date).toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric' 
      }),
      wellnessScore: checkIn.wellnessScore,
      category: checkIn.moodCategory,
      sentiment: checkIn.sentimentScore,
    }));

  // Calculate summary statistics
  const avgWellnessScore = Math.round(
    checkIns.reduce((sum, item) => sum + item.wellnessScore, 0) / checkIns.length
  );

  const recentTrend = checkIns.length >= 2 
    ? checkIns[0].wellnessScore - checkIns[1].wellnessScore
    : 0;

  const categoryCount = checkIns.reduce((acc, item) => {
    acc[item.moodCategory] = (acc[item.moodCategory] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'positive':
        return '#22c55e';
      case 'neutral':
        return '#6b7280';
      case 'stressed':
        return '#f59e0b';
      case 'high_risk':
        return '#ef4444';
      default:
        return '#6b7280';
    }
  };

  const getBadgeColor = (category: string) => {
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
        return category;
    }
  };

  return (
    <div className="space-y-6">
      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{avgWellnessScore}%</div>
            <p className="text-xs text-muted-foreground">Average Wellness Score</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold flex items-center gap-1">
              {recentTrend > 0 ? '↗' : recentTrend < 0 ? '↘' : '→'}
              {Math.abs(recentTrend)}%
            </div>
            <p className="text-xs text-muted-foreground">Recent Trend</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="pt-6">
            <div className="text-2xl font-bold">{checkIns.length}</div>
            <p className="text-xs text-muted-foreground">Total Check-ins</p>
          </CardContent>
        </Card>
      </div>

      {/* Wellness Trend Chart */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Wellness Trends (Last 30 Days)</CardTitle>
          <CardDescription>Track your wellness journey over time</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="date" 
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis 
                  domain={[0, 100]}
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <Tooltip 
                  formatter={(value, name) => [
                    name === 'wellnessScore' ? `${value}%` : value,
                    name === 'wellnessScore' ? 'Wellness Score' : name
                  ]}
                />
                <Line 
                  type="monotone" 
                  dataKey="wellnessScore" 
                  stroke="#3b82f6" 
                  strokeWidth={2}
                  dot={{ fill: '#3b82f6', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Category Distribution */}
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Mood Distribution</CardTitle>
          <CardDescription>Breakdown of your recent mood patterns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {Object.entries(categoryCount).map(([category, count]) => (
              <div key={category} className="text-center space-y-2">
                <Badge className={getBadgeColor(category)} variant="outline">
                  {getCategoryLabel(category)}
                </Badge>
                <div className="text-2xl font-bold">{count}</div>
                <div className="text-xs text-muted-foreground">
                  {Math.round((count / checkIns.length) * 100)}% of check-ins
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}