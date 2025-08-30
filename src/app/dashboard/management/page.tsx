'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface Employee {
  id: string;
  name: string;
  email: string;
  employeeId: string;
  vessel: string;
  department: string;
  avgWellnessScore: number | null;
  latestWellnessScore: number | null;
  latestCheckIn: string | null;
  riskLevel: string;
  hasCheckedInToday: boolean;
  concerningPattern: boolean;
  totalCheckIns: number;
  moodCategories: {
    positive: number;
    neutral: number;
    stressed: number;
    high_risk: number;
  };
}

interface DashboardStats {
  totalEmployees: number;
  checkedInToday: number;
  checkInRate: number;
  highRiskEmployees: number;
  mediumRiskEmployees: number;
  avgWellnessScore: number | null;
}

export default function ManagementDashboard() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [timeframe, setTimeframe] = useState('7');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [sortBy, setSortBy] = useState('risk');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshInterval, setRefreshInterval] = useState<NodeJS.Timeout | null>(null);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);
  const [employeeDetails, setEmployeeDetails] = useState<any>(null);

  useEffect(() => {
    fetchUserData();
    fetchDashboardData();
  }, [timeframe, selectedDate]);

  useEffect(() => {
    // Set up auto-refresh every 30 seconds
    const interval = setInterval(() => {
      fetchDashboardData();
    }, 30000);
    
    setRefreshInterval(interval);
    
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [timeframe, selectedDate]);

  useEffect(() => {
    return () => {
      if (refreshInterval) clearInterval(refreshInterval);
    };
  }, [refreshInterval]);

  const fetchUserData = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        if (data.user.role !== 'management') {
          router.push('/dashboard/employee');
          return;
        }
        setUser(data.user);
      } else {
        router.push('/auth/login');
      }
    } catch (error) {
      console.error('Error fetching user data:', error);
      router.push('/auth/login');
    }
  };

  const fetchDashboardData = async () => {
    try {
      const response = await fetch(`/api/wellness/team?days=${timeframe}&date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        
        // Transform wellness team data to match existing interface  
        const transformedEmployees = (data.employeeStatus || []).map((emp: any) => {
          // Calculate average wellness score from historical data
          const empHistoricalData = (data.teamData || []).filter((item: any) => 
            item._id?.userId?.toString() === emp._id?.toString()
          );
          const avgScore = empHistoricalData.length > 0 
            ? empHistoricalData.reduce((sum: number, item: any) => sum + (item.wellnessScore || 0), 0) / empHistoricalData.length
            : null;

          // Check for concerning patterns (3+ consecutive low scores)
          const recentScores = empHistoricalData
            .sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())
            .slice(0, 3)
            .map((item: any) => item.wellnessScore)
            .filter(score => score !== null && score !== undefined);
          
          const concerningPattern = recentScores.length >= 3 && 
            recentScores.every((score: number) => score < 60);

          // Get the latest check-in date from historical data or today if checked in
          const latestCheckInDate = emp.hasCheckedInToday 
            ? emp.checkInTime || new Date().toISOString()
            : empHistoricalData.length > 0 
              ? empHistoricalData.sort((a: any, b: any) => new Date(b.date || 0).getTime() - new Date(a.date || 0).getTime())[0].date
              : null;

          // Determine risk level with better null checking
          let riskLevel = 'unknown';
          if (emp.todayWellnessScore !== null && emp.todayWellnessScore !== undefined) {
            if (emp.todayWellnessScore < 50) {
              riskLevel = 'high';
            } else if (emp.todayWellnessScore < 70) {
              riskLevel = 'medium';
            } else {
              riskLevel = 'low';
            }
          }

          return {
            id: emp._id,
            name: emp.name || 'Unknown Employee',
            email: '', 
            employeeId: emp.employeeId || 'N/A',
            vessel: emp.vessel || 'Unknown',
            department: emp.department || 'Unknown',
            avgWellnessScore: avgScore ? Math.round(avgScore) : null,
            latestWellnessScore: emp.todayWellnessScore,
            latestCheckIn: latestCheckInDate,
            riskLevel,
            hasCheckedInToday: emp.hasCheckedInToday || false,
            concerningPattern,
            totalCheckIns: empHistoricalData.length,
            moodCategories: {
              positive: 0,
              neutral: 0,
              stressed: 0,
              high_risk: 0,
            }
          };
        });

        setEmployees(transformedEmployees);
        setStats({
          totalEmployees: data.totalEmployees,
          checkedInToday: data.todayCheckIns,
          checkInRate: data.statistics.complianceRate,
          highRiskEmployees: data.statistics.lowScoreAlerts,
          mediumRiskEmployees: 0, // Calculate if needed
          avgWellnessScore: data.statistics.averageWellness
        });
      } else if (response.status === 403) {
        router.push('/dashboard/employee');
      } else {
        setError('Failed to fetch dashboard data');
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
      setError('Failed to fetch dashboard data');
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

  const fetchEmployeeDetails = async (employeeId: string) => {
    try {
      const response = await fetch(`/api/wellness/history?userId=${employeeId}&days=30`);
      if (response.ok) {
        const data = await response.json();
        setEmployeeDetails(data);
      }
    } catch (error) {
      console.error('Error fetching employee details:', error);
    }
  };

  const handleEmployeeClick = (employee: Employee) => {
    setSelectedEmployee(employee);
    fetchEmployeeDetails(employee.id);
  };

  const getRiskBadgeColor = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'low':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'very_low':
        return 'bg-green-100 text-green-800 border-green-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getRiskLabel = (riskLevel: string) => {
    switch (riskLevel) {
      case 'high':
        return 'High Risk';
      case 'medium':
        return 'Medium Risk';
      case 'low':
        return 'Low Risk';
      case 'very_low':
        return 'Very Low Risk';
      default:
        return 'Unknown';
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  const sortEmployees = (employees: Employee[], sortBy: string) => {
    return [...employees].sort((a, b) => {
      switch (sortBy) {
        case 'risk':
          return b.riskLevel === 'high' ? 1 : a.riskLevel === 'high' ? -1 : 0;
        case 'wellness':
          if (!a.latestWellnessScore && !b.latestWellnessScore) return 0;
          if (!a.latestWellnessScore) return 1;
          if (!b.latestWellnessScore) return -1;
          return a.latestWellnessScore - b.latestWellnessScore;
        case 'name':
          return a.name.localeCompare(b.name);
        case 'vessel':
          return (a.vessel || '').localeCompare(b.vessel || '');
        default:
          return 0;
      }
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="text-2xl mb-4">🌊</div>
          <div>Loading management dashboard...</div>
        </div>
      </div>
    );
  }

  const sortedEmployees = sortEmployees(employees, sortBy);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-800">🌊 CalmSail Management</h1>
              <div className="text-sm text-muted-foreground">
                Welcome, {user?.name}
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-sm">
                <label htmlFor="date-filter" className="font-medium">Date:</label>
                <input
                  id="date-filter"
                  type="date"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                  className="px-3 py-1 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500"
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>
              <Select value={timeframe} onValueChange={setTimeframe}>
                <SelectTrigger className="w-32">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="7">Last 7 days</SelectItem>
                  <SelectItem value="14">Last 14 days</SelectItem>
                  <SelectItem value="30">Last 30 days</SelectItem>
                </SelectContent>
              </Select>
              <Button 
                variant="outline" 
                size="sm" 
                onClick={() => fetchDashboardData()}
                className="flex items-center gap-2"
              >
                🔄 Refresh
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
          <Alert variant="destructive" className="mb-6">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Product Guide - Show when no employee data */}
        {sortedEmployees.length === 0 && (
          <div className="mb-8">
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-blue-800">
                  📚 Welcome to CalmSail Management Dashboard
                </CardTitle>
                <CardDescription className="text-blue-700">
                  Your comprehensive wellness management system for maritime crews
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Current System Status */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    📊 Current System Status
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">System Active & Ready</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-green-50 rounded-lg">
                      <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                      <span className="text-sm">{stats?.totalEmployees || 0} Employees Registered</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-yellow-50 rounded-lg">
                      <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                      <span className="text-sm">Waiting for First Check-ins</span>
                    </div>
                    <div className="flex items-center gap-3 p-3 bg-blue-50 rounded-lg">
                      <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                      <span className="text-sm">Management Dashboard Ready</span>
                    </div>
                  </div>
                </div>

                {/* How to Get Started */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    🚀 Getting Started Guide
                  </h3>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">1</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Employee Setup Complete</h4>
                        <p className="text-sm text-gray-600">Employees are registered and can access their dashboards</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">2</div>
                      <div>
                        <h4 className="font-medium text-gray-900">Next: Employee Check-ins</h4>
                        <p className="text-sm text-gray-600">Have employees log in and complete their first wellness check-ins</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="bg-gray-100 text-gray-500 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">3</div>
                      <div>
                        <h4 className="font-medium text-gray-500">Then: Monitor & Support</h4>
                        <p className="text-sm text-gray-500">Track wellness trends and provide support where needed</p>
                      </div>
                    </div>
                  </div>
                </div>

                {/* System Features Overview */}
                <div className="bg-white rounded-lg p-4 border border-blue-200">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    ⚡ What CalmSail Provides
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Wellness Tracking</h4>
                          <p className="text-xs text-gray-600">Daily mood, stress, and energy monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Risk Detection</h4>
                          <p className="text-xs text-gray-600">AI-powered early warning system</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Privacy First</h4>
                          <p className="text-xs text-gray-600">Individual responses remain confidential</p>
                        </div>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Real-time Dashboard</h4>
                          <p className="text-xs text-gray-600">Live updates and trend analysis</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Team Overview</h4>
                          <p className="text-xs text-gray-600">Comprehensive crew wellness monitoring</p>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="text-green-600">✅</div>
                        <div>
                          <h4 className="text-sm font-medium text-gray-900">Support Guidance</h4>
                          <p className="text-xs text-gray-600">Actionable insights for interventions</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Action Items */}
                <div className="bg-gradient-to-r from-blue-600 to-teal-600 rounded-lg p-4 text-white">
                  <h3 className="font-semibold mb-2 flex items-center gap-2">
                    🎯 Next Steps
                  </h3>
                  <div className="space-y-2 text-sm">
                    <p>• Share employee login credentials with your crew</p>
                    <p>• Encourage daily wellness check-ins (takes 2-3 minutes)</p>
                    <p>• Return here to monitor team wellness trends</p>
                    <p>• Use insights to provide timely support when needed</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Team Overview</h2>
              <div className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                Updates every 30 seconds
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className="text-2xl font-bold">{stats.totalEmployees}</div>
                    <div className="bg-blue-100 rounded-full p-2">
                      <span className="text-blue-600">👥</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Total Crew Members</p>
                  <p className="text-xs text-gray-500 mt-1">Registered in CalmSail system</p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl font-bold ${
                      stats.checkInRate >= 80 ? 'text-green-600' : 
                      stats.checkInRate >= 50 ? 'text-yellow-600' : 
                      'text-red-600'
                    }`}>
                      {stats.checkInRate}%
                    </div>
                    <div className="bg-green-100 rounded-full p-2">
                      <span className="text-green-600">✅</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    Daily Check-in Rate
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.checkedInToday} of {stats.totalEmployees} completed today
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl font-bold ${
                      stats.highRiskEmployees === 0 ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {stats.highRiskEmployees}
                    </div>
                    <div className={`rounded-full p-2 ${
                      stats.highRiskEmployees === 0 ? 'bg-green-100' : 'bg-red-100'
                    }`}>
                      <span className={stats.highRiskEmployees === 0 ? 'text-green-600' : 'text-red-600'}>
                        {stats.highRiskEmployees === 0 ? '🛡️' : '⚠️'}
                      </span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Attention Needed</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.highRiskEmployees === 0 ? 'All crew members doing well' : 'Low wellness scores detected'}
                  </p>
                </CardContent>
              </Card>
              
              <Card className="hover:shadow-md transition-shadow">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between mb-2">
                    <div className={`text-2xl font-bold ${
                      stats.avgWellnessScore >= 80 ? 'text-green-600' :
                      stats.avgWellnessScore >= 60 ? 'text-yellow-600' :
                      stats.avgWellnessScore >= 40 ? 'text-orange-600' :
                      stats.avgWellnessScore ? 'text-red-600' : 'text-gray-400'
                    }`}>
                      {stats.avgWellnessScore ? `${stats.avgWellnessScore}%` : 'N/A'}
                    </div>
                    <div className="bg-purple-100 rounded-full p-2">
                      <span className="text-purple-600">📊</span>
                    </div>
                  </div>
                  <p className="text-sm text-muted-foreground">Team Wellness Avg</p>
                  <p className="text-xs text-gray-500 mt-1">
                    {stats.avgWellnessScore ? 'Based on recent check-ins' : 'Awaiting check-in data'}
                  </p>
                </CardContent>
              </Card>
            </div>
          </div>
        )}

        {/* Employee List */}
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <div>
                <CardTitle className="flex items-center gap-2">
                  Employee Wellness Overview
                  {sortedEmployees.length > 0 && (
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-normal">
                      {sortedEmployees.length} crew members
                    </span>
                  )}
                </CardTitle>
                <CardDescription>
                  {sortedEmployees.length > 0 ? (
                    <>Monitor your crew's wellbeing and identify those who may need support. Click any employee card for detailed insights.</>
                  ) : (
                    <>Your employee wellness data will appear here once crew members start completing their daily check-ins.</>
                  )}
                </CardDescription>
              </div>
              {sortedEmployees.length > 0 && (
                <div className="flex items-center gap-3">
                  <div className="text-xs text-gray-500">
                    Sort by:
                  </div>
                  <Select value={sortBy} onValueChange={setSortBy}>
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="risk">Risk Level</SelectItem>
                      <SelectItem value="wellness">Wellness Score</SelectItem>
                      <SelectItem value="name">Employee Name</SelectItem>
                      <SelectItem value="vessel">Vessel</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {sortedEmployees.map((employee) => (
                <div
                  key={employee.id}
                  onClick={() => handleEmployeeClick(employee)}
                  className="group relative p-6 bg-white border border-gray-200 rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 cursor-pointer hover:border-blue-300 hover:-translate-y-1"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16 ring-2 ring-blue-100 group-hover:ring-blue-200 transition-all">
                        <AvatarFallback className="bg-gradient-to-br from-blue-500 to-blue-600 text-white text-lg font-semibold">
                          {getInitials(employee.name)}
                        </AvatarFallback>
                      </Avatar>
                      
                      <div className="flex-1">
                        <h3 className="font-semibold text-xl text-gray-900 mb-1 group-hover:text-blue-700 transition-colors">
                          {employee.name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <div className="flex items-center gap-2">
                            <span className="font-medium">ID:</span>
                            <span className="bg-gray-100 px-2 py-1 rounded-md text-xs font-mono">
                              {employee.employeeId || 'N/A'}
                            </span>
                          </div>
                          <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                              <span>{employee.department || 'Unknown Dept'}</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-2 h-2 bg-teal-500 rounded-full"></span>
                              <span>{employee.vessel || 'Unknown Vessel'}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-8">
                      {employee.avgWellnessScore && (
                        <div className="text-center">
                          <div className="text-sm font-medium text-gray-500 mb-2">Wellness Average</div>
                          <div className="flex flex-col items-center gap-2">
                            <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold text-lg shadow-lg ${
                              employee.avgWellnessScore >= 80 ? 'bg-green-500' :
                              employee.avgWellnessScore >= 60 ? 'bg-yellow-500' :
                              employee.avgWellnessScore >= 40 ? 'bg-orange-500' :
                              'bg-red-500'
                            }`}>
                              {employee.avgWellnessScore}
                            </div>
                            <div className={`text-xs font-medium ${
                              employee.avgWellnessScore >= 80 ? 'text-green-600' :
                              employee.avgWellnessScore >= 60 ? 'text-yellow-600' :
                              employee.avgWellnessScore >= 40 ? 'text-orange-600' :
                              'text-red-600'
                            }`}>
                              {employee.avgWellnessScore >= 80 ? 'Excellent' :
                               employee.avgWellnessScore >= 60 ? 'Good' :
                               employee.avgWellnessScore >= 40 ? 'Fair' :
                               'Poor'}
                            </div>
                          </div>
                        </div>
                      )}

                      <div className="text-center">
                        <div className="text-sm font-medium text-gray-500 mb-2">Total Check-ins</div>
                        <div className="text-2xl font-bold text-gray-700">{employee.totalCheckIns}</div>
                        {employee.latestCheckIn && (
                          <div className="text-xs text-gray-500 mt-1">
                            Last: {new Date(employee.latestCheckIn).toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>

                  {employee.concerningPattern && (
                    <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                      <div className="flex items-center gap-2 text-amber-800">
                        <span className="text-lg">⚠️</span>
                        <span className="text-sm font-medium">
                          Concerning patterns detected. Consider reaching out for support.
                        </span>
                      </div>
                    </div>
                  )}

                  <div className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
                    <div className="text-xs text-gray-400 bg-white px-2 py-1 rounded-md border shadow-sm">
                      Click for details
                    </div>
                  </div>
                </div>
              ))}

              {sortedEmployees.length === 0 && (
                <div className="text-center py-12 bg-gray-50 rounded-lg border-2 border-dashed border-gray-200">
                  <div className="text-4xl mb-4">📊</div>
                  <div className="text-lg font-medium text-gray-900 mb-2">
                    Wellness Data Coming Soon
                  </div>
                  <div className="text-sm text-gray-600 mb-4">
                    Employee wellness cards will appear here once your crew starts completing their daily check-ins.
                  </div>
                  <div className="text-xs text-gray-500">
                    💡 Tip: Encourage employees to log in and complete their first wellness assessment
                  </div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Support Notice */}
        <Card className="mt-8">
          <CardContent className="pt-6">
            <div className="text-center space-y-2">
              <h3 className="font-semibold">Important Reminder</h3>
              <p className="text-sm text-muted-foreground">
                This dashboard shows wellness indicators only. For employees showing concerning patterns, 
                please reach out directly and provide appropriate support resources. All individual responses remain confidential.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Employee Detail Modal */}
        {selectedEmployee && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg max-w-4xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b">
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-2xl font-bold">{selectedEmployee.name}</h2>
                    <div className="text-sm text-muted-foreground mt-1">
                      ID: {selectedEmployee.employeeId} • {selectedEmployee.department} • {selectedEmployee.vessel}
                    </div>
                  </div>
                  <button 
                    onClick={() => {
                      setSelectedEmployee(null);
                      setEmployeeDetails(null);
                    }}
                    className="text-gray-500 hover:text-gray-700 text-2xl"
                  >
                    ×
                  </button>
                </div>
              </div>

              <div className="p-6">
                {employeeDetails ? (
                  <div className="space-y-6">
                    {/* Summary Stats */}
                    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                      <div className="bg-blue-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">
                          {employeeDetails.statistics?.averageScore || 'N/A'}%
                        </div>
                        <div className="text-sm text-blue-700">Average Score</div>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">
                          {employeeDetails.statistics?.totalCheckins || 0}
                        </div>
                        <div className="text-sm text-green-700">Total Check-ins</div>
                      </div>
                      <div className="bg-orange-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-orange-600">
                          {employeeDetails.statistics?.averageStress?.toFixed(1) || 'N/A'}
                        </div>
                        <div className="text-sm text-orange-700">Avg Stress Level</div>
                      </div>
                      <div className="bg-purple-50 p-4 rounded-lg text-center">
                        <div className="text-2xl font-bold text-purple-600">
                          {employeeDetails.statistics?.trend || 'stable'}
                        </div>
                        <div className="text-sm text-purple-700">Trend</div>
                      </div>
                    </div>

                    {/* Recent Check-ins */}
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Recent Wellness Check-ins</h3>
                      <div className="space-y-3 max-h-60 overflow-y-auto">
                        {employeeDetails.history?.slice(0, 10).map((checkin: any, index: number) => (
                          <div key={index} className="border rounded-lg p-4 bg-gray-50">
                            <div className="flex justify-between items-start mb-2">
                              <div className="font-medium">
                                {new Date(checkin.date).toLocaleDateString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Progress value={checkin.overallScore} className="w-20" />
                                <span className="text-sm font-semibold">{checkin.overallScore}%</span>
                              </div>
                            </div>
                            {checkin.responses && checkin.responses.length > 0 && (
                              <div className="text-sm text-gray-600">
                                <div className="font-medium mb-1">Responses:</div>
                                {checkin.responses.slice(0, 2).map((response: any, idx: number) => (
                                  <div key={idx} className="mb-1">
                                    <span className="font-medium">Q: </span>{response.question}
                                    <br />
                                    <span className="font-medium">A: </span>{response.answer}
                                  </div>
                                ))}
                                {checkin.responses.length > 2 && (
                                  <div className="text-xs text-gray-500">
                                    + {checkin.responses.length - 2} more responses
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* AI Insights */}
                    {employeeDetails.insights && employeeDetails.insights.length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold mb-4">AI Insights</h3>
                        <ul className="space-y-2">
                          {employeeDetails.insights.map((insight: string, index: number) => (
                            <li key={index} className="flex items-start space-x-2">
                              <div className="h-2 w-2 bg-blue-500 rounded-full mt-2"></div>
                              <span className="text-sm">{insight}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="animate-spin h-8 w-8 border-b-2 border-blue-500 mx-auto mb-4"></div>
                    <p>Loading employee details...</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}