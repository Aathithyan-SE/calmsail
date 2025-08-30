import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Shield, 
  Users, 
  BarChart3, 
  Brain, 
  Heart, 
  Ship, 
  CheckCircle, 
  Clock, 
  Zap,
  Target,
  ArrowRight,
  Star,
  AlertTriangle
} from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Header */}
      <header className="border-b bg-white/80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            <Ship className="h-8 w-8 text-blue-600" />
            <h1 className="text-2xl font-bold text-blue-900">CalmSail</h1>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/auth/login">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/auth/register">
              <Button>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <Badge className="mb-4" variant="outline">
            Powered by AI • Maritime-Focused • GDPR Compliant
          </Badge>
          
          <h2 className="text-5xl font-bold text-gray-900 mb-6 leading-tight">
            Maritime Workforce <br />
            <span className="text-blue-600">Wellness & Safety</span> Platform
          </h2>
          
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
            AI-powered daily wellness tracking system designed specifically for maritime operations and offshore teams. 
            5 personalized questions per day to monitor crew wellbeing and ensure workplace safety.
          </p>
          
          <div className="flex justify-center">
            <Link href="/auth/register">
              <Button size="lg" className="text-lg px-8">
                Start Free Trial
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>

          <div className="mt-12 flex items-center justify-center space-x-8 text-gray-500">
            <div className="flex items-center space-x-2">
              <CheckCircle className="h-5 w-5 text-green-500" />
              <span>ISO 27001 Compliant</span>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Bank-level Security</span>
            </div>
            <div className="flex items-center space-x-2">
              <Star className="h-5 w-5 text-green-500" />
              <span>24/7 Support</span>
            </div>
          </div>
        </div>
      </section>

      {/* Key Features */}
      <section className="py-20 bg-white px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              AI-Powered Daily Wellness Tracking
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple, effective daily wellness monitoring designed specifically for maritime crews. 
              One check-in per day, comprehensive management oversight.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {/* AI-Powered Wellness */}
            <Card className="border-2 hover:border-blue-200 transition-colors">
              <CardHeader>
                <Brain className="h-10 w-10 text-blue-600 mb-4" />
                <CardTitle>AI-Powered Wellness Tracking</CardTitle>
                <CardDescription>
                  Personalized daily wellness check-ins with 5 AI-generated questions tailored to each employee's role, vessel, and recent wellness patterns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Maritime-specific questions</li>
                  <li>• Anthropic Claude AI integration</li>
                  <li>• Personalized based on role & history</li>
                  <li>• Automated wellness percentage scoring</li>
                </ul>
              </CardContent>
            </Card>

            {/* Digital Check-ins */}
            <Card className="border-2 hover:border-green-200 transition-colors">
              <CardHeader>
                <CheckCircle className="h-10 w-10 text-green-600 mb-4" />
                <CardTitle>Digital Check-in System</CardTitle>
                <CardDescription>
                  Streamlined daily check-ins for crew members with automatic logging, timestamps, and location tracking for comprehensive safety records.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• GPS location verification</li>
                  <li>• Automatic timestamp logging</li>
                  <li>• Offline capability for sea operations</li>
                  <li>• Emergency alert integration</li>
                </ul>
              </CardContent>
            </Card>

            {/* Analytics Dashboard */}
            <Card className="border-2 hover:border-purple-200 transition-colors">
              <CardHeader>
                <BarChart3 className="h-10 w-10 text-purple-600 mb-4" />
                <CardTitle>Advanced Analytics</CardTitle>
                <CardDescription>
                  Comprehensive dashboards with wellness trends, predictive insights, and early warning systems for mental health and safety concerns.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Real-time wellness trends</li>
                  <li>• Predictive burnout alerts</li>
                  <li>• Team performance metrics</li>
                  <li>• Custom reporting tools</li>
                </ul>
              </CardContent>
            </Card>

            {/* Safety Management */}
            <Card className="border-2 hover:border-red-200 transition-colors">
              <CardHeader>
                <Shield className="h-10 w-10 text-red-600 mb-4" />
                <CardTitle>Safety Management</CardTitle>
                <CardDescription>
                  Incident reporting, safety protocol tracking, and emergency response coordination with real-time alerts and automated notifications.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Digital incident reporting</li>
                  <li>• Safety protocol compliance</li>
                  <li>• Emergency response workflows</li>
                  <li>• Regulatory compliance tracking</li>
                </ul>
              </CardContent>
            </Card>

            {/* Team Management */}
            <Card className="border-2 hover:border-orange-200 transition-colors">
              <CardHeader>
                <Users className="h-10 w-10 text-orange-600 mb-4" />
                <CardTitle>Workforce Management</CardTitle>
                <CardDescription>
                  Complete crew management with role-based access, vessel assignments, department organization, and performance tracking.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Multi-vessel crew management</li>
                  <li>• Role-based permissions</li>
                  <li>• Shift scheduling integration</li>
                  <li>• Performance evaluation tools</li>
                </ul>
              </CardContent>
            </Card>

            {/* Mental Health Support */}
            <Card className="border-2 hover:border-pink-200 transition-colors">
              <CardHeader>
                <Heart className="h-10 w-10 text-pink-600 mb-4" />
                <CardTitle>Mental Health Support</CardTitle>
                <CardDescription>
                  Proactive mental health monitoring with AI-powered insights, confidential support resources, and early intervention capabilities.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm text-gray-600">
                  <li>• Confidential wellness tracking</li>
                  <li>• AI-powered mental health insights</li>
                  <li>• Resource recommendations</li>
                  <li>• Crisis intervention protocols</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-20 bg-gray-50 px-4">
        <div className="container mx-auto">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How CalmSail Works
            </h3>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Simple 3-step process to transform your maritime workforce wellness and safety management.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-blue-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">1. Setup Your Team</h4>
              <p className="text-gray-600">
                Register your vessels, add crew members with their roles and departments. 
                Our system automatically configures maritime-specific settings.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <Brain className="h-8 w-8 text-green-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">2. AI Personalizes Experience</h4>
              <p className="text-gray-600">
                Our AI analyzes each employee's role, vessel type, and wellness history to generate 
                personalized daily check-in questions and insights.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-6">
                <BarChart3 className="h-8 w-8 text-purple-600" />
              </div>
              <h4 className="text-xl font-semibold mb-4">3. Monitor & Act</h4>
              <p className="text-gray-600">
                Access real-time dashboards, receive predictive alerts, and take proactive 
                action to maintain crew wellness and safety standards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Complete Step-by-Step Guide */}
      <section className="py-20 bg-white px-4">
        <div className="container mx-auto max-w-4xl">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              How to Use CalmSail - Complete Guide
            </h3>
            <p className="text-gray-600 text-lg">
              Follow this comprehensive step-by-step guide to get started with CalmSail and maximize your maritime workforce wellness management.
            </p>
          </div>

          {/* Step 1: Initial Setup */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-blue-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">1</div>
              <h3 className="text-2xl font-bold text-gray-900">Account Registration & Setup</h3>
            </div>
            <div className="ml-16 space-y-4">
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Users className="h-5 w-5 mr-2 text-blue-600" />
                  For Management/Admin Users:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Click "Get Started" and create your organization account</li>
                  <li>• Enter your company name, fleet details, and primary contact information</li>
                  <li>• Add vessel information (names, types, capacity, routes)</li>
                  <li>• Set up departments (Engine, Deck, Catering, Bridge, etc.)</li>
                  <li>• Configure your Anthropic API key in settings for AI features</li>
                </ul>
              </div>
              <div className="bg-green-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Heart className="h-5 w-5 mr-2 text-green-600" />
                  For Crew Members:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Wait for invitation email from your management team</li>
                  <li>• Click the invitation link and create your personal account</li>
                  <li>• Enter your employee ID, role, and vessel assignment</li>
                  <li>• Set up your profile with department and contact preferences</li>
                  <li>• <strong>Note:</strong> You can complete one wellness check-in per day</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 2: Daily Wellness Check-ins */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-green-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">2</div>
              <h3 className="text-2xl font-bold text-gray-900">Daily Wellness Check-ins</h3>
            </div>
            <div className="ml-16 space-y-4">
              <div className="border-l-4 border-green-500 pl-6">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Brain className="h-5 w-5 mr-2 text-green-600" />
                  AI-Powered Personalized Questions:
                </h4>
                <div className="space-y-3 text-gray-700">
                  <p>Every day, our AI generates 5 personalized wellness questions based on:</p>
                  <ul className="ml-6 space-y-1">
                    <li>→ Your specific role (Captain, Engineer, Crew, Cook, etc.)</li>
                    <li>→ Your vessel type and current voyage status</li>
                    <li>→ Your department and work responsibilities</li>
                    <li>→ Your recent wellness history and patterns</li>
                    <li>→ Maritime-specific challenges and stressors</li>
                  </ul>
                </div>
              </div>
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3">Step-by-Step Check-in Process:</h4>
                <ol className="space-y-2 text-gray-700">
                  <li><strong>1.</strong> Log into your CalmSail dashboard each morning</li>
                  <li><strong>2.</strong> Click on the "Wellness" tab to start your daily check-in</li>
                  <li><strong>3.</strong> Answer 5 personalized questions honestly (takes 2-3 minutes)</li>
                  <li><strong>4.</strong> Submit your responses to receive instant AI analysis</li>
                  <li><strong>5.</strong> View your wellness percentage score and personalized insights</li>
                </ol>
              </div>
            </div>
          </div>

          {/* Step 3: Understanding Your Wellness Score */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-purple-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">3</div>
              <h3 className="text-2xl font-bold text-gray-900">Understanding Your Wellness Score</h3>
            </div>
            <div className="ml-16">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                <div className="bg-green-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-green-600 mb-2">80-100%</div>
                  <div className="font-semibold text-green-800">Excellent</div>
                  <p className="text-sm text-green-700 mt-2">Great mental state, high energy, satisfied with work</p>
                </div>
                <div className="bg-yellow-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-yellow-600 mb-2">60-79%</div>
                  <div className="font-semibold text-yellow-800">Good</div>
                  <p className="text-sm text-yellow-700 mt-2">Generally positive, some stress but manageable</p>
                </div>
                <div className="bg-red-50 p-6 rounded-lg text-center">
                  <div className="text-3xl font-bold text-red-600 mb-2">Below 60%</div>
                  <div className="font-semibold text-red-800">Needs Attention</div>
                  <p className="text-sm text-red-700 mt-2">May need support, consider reaching out</p>
                </div>
              </div>
              <div className="bg-blue-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Target className="h-5 w-5 mr-2 text-blue-600" />
                  What Your Score Includes:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• <strong>Response Analysis:</strong> AI analyzes the sentiment and content of your answers</li>
                  <li>• <strong>Mood Indicators:</strong> Your self-reported mood and stress levels</li>
                  <li>• <strong>Energy Assessment:</strong> Physical and mental energy evaluation</li>
                  <li>• <strong>Work Satisfaction:</strong> How satisfied you feel with your role and responsibilities</li>
                  <li>• <strong>Maritime Context:</strong> Considers unique challenges of seafaring life</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 4: Management Oversight */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-orange-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">4</div>
              <h3 className="text-2xl font-bold text-gray-900">Management Wellness Tracking</h3>
            </div>
            <div className="ml-16 space-y-4">
              <div className="bg-orange-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2 text-orange-600" />
                  Management Dashboard Features:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-gray-700">
                  <ul className="space-y-2">
                    <li>• Daily check-in compliance tracking</li>
                    <li>• Team wellness score averages</li>
                    <li>• Individual employee wellness status</li>
                    <li>• Automated alerts for low scores</li>
                  </ul>
                  <ul className="space-y-2">
                    <li>• Vessel and department breakdowns</li>
                    <li>• Trend analysis over time</li>
                    <li>• Risk level categorization</li>
                    <li>• Compliance reporting tools</li>
                  </ul>
                </div>
              </div>
              <div className="border-l-4 border-orange-500 pl-6">
                <h4 className="font-semibold mb-3">Key Principles:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Employees complete one wellness check-in per day</li>
                  <li>• Individual progress tracking is available only to management</li>
                  <li>• Employees receive simple completion confirmation</li>
                  <li>• Focus remains on daily wellness, not score competition</li>
                  <li>• AI analysis helps identify employees who may need support</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Step 5: Getting Support */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-red-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">5</div>
              <h3 className="text-2xl font-bold text-gray-900">When You Need Support</h3>
            </div>
            <div className="ml-16 space-y-4">
              <div className="bg-red-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <AlertTriangle className="h-5 w-5 mr-2 text-red-600" />
                  Automatic Alerts Are Sent When:
                </h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Your wellness score drops below 50% for 2+ consecutive days</li>
                  <li>• You report high stress levels (8-10) for multiple days</li>
                  <li>• AI detects concerning patterns in your responses</li>
                  <li>• You explicitly request support in your check-in</li>
                </ul>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">Available Resources:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• 24/7 Crisis hotlines</li>
                    <li>• Employee assistance programs</li>
                    <li>• Ship medical officers</li>
                    <li>• Peer support networks</li>
                    <li>• Management check-ins</li>
                  </ul>
                </div>
                <div className="bg-gray-50 p-6 rounded-lg">
                  <h4 className="font-semibold mb-3">How to Request Help:</h4>
                  <ul className="space-y-2 text-gray-700">
                    <li>• Contact your direct supervisor</li>
                    <li>• Reach out to the wellness team</li>
                    <li>• Use emergency contact numbers</li>
                    <li>• Access confidential counseling</li>
                    <li>• Request schedule adjustments</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Step 6: Management Features */}
          <div className="mb-16">
            <div className="flex items-center mb-6">
              <div className="bg-indigo-600 text-white rounded-full w-12 h-12 flex items-center justify-center text-xl font-bold mr-4">6</div>
              <h3 className="text-2xl font-bold text-gray-900">Management & Oversight</h3>
            </div>
            <div className="ml-16 space-y-4">
              <div className="bg-indigo-50 p-6 rounded-lg">
                <h4 className="font-semibold mb-3 flex items-center">
                  <Shield className="h-5 w-5 mr-2 text-indigo-600" />
                  Management Dashboard Features:
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-gray-700">
                  <div>
                    <h5 className="font-semibold mb-2">Team Overview:</h5>
                    <ul className="space-y-1">
                      <li>• Vessel-wide wellness averages</li>
                      <li>• Department-specific trends</li>
                      <li>• Individual crew member status</li>
                      <li>• Check-in compliance rates</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-semibold mb-2">Alerts & Actions:</h5>
                    <ul className="space-y-1">
                      <li>• Low wellness score notifications</li>
                      <li>• Missed check-in alerts</li>
                      <li>• Trend deterioration warnings</li>
                      <li>• Crisis intervention triggers</li>
                    </ul>
                  </div>
                </div>
              </div>
              <div className="border-l-4 border-indigo-500 pl-6">
                <h4 className="font-semibold mb-3">Best Practices for Managers:</h4>
                <ul className="space-y-2 text-gray-700">
                  <li>• Review team wellness data weekly</li>
                  <li>• Respond to alerts within 24 hours</li>
                  <li>• Have regular one-on-one wellness conversations</li>
                  <li>• Use data to improve working conditions</li>
                  <li>• Maintain confidentiality and trust</li>
                  <li>• Provide additional training for struggling crew members</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Final Tips */}
          <div className="bg-gradient-to-r from-blue-50 to-green-50 p-8 rounded-lg">
            <h3 className="text-xl font-bold text-center mb-6">🎯 Success Tips for Maximum Benefit</h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div>
                <Clock className="h-10 w-10 text-blue-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Be Consistent</h4>
                <p className="text-sm text-gray-600">Complete check-ins daily at the same time for best results and accurate trending</p>
              </div>
              <div>
                <Heart className="h-10 w-10 text-green-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Be Honest</h4>
                <p className="text-sm text-gray-600">Answer questions truthfully - the AI can only help when given accurate information</p>
              </div>
              <div>
                <Users className="h-10 w-10 text-purple-600 mx-auto mb-4" />
                <h4 className="font-semibold mb-2">Communicate</h4>
                <p className="text-sm text-gray-600">Use wellness data as a starting point for meaningful conversations about wellbeing</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-12 bg-blue-600 text-white px-4">
        <div className="container mx-auto text-center">
          <h3 className="text-2xl font-bold mb-4">
            Ready to Get Started?
          </h3>
          <p className="text-lg text-blue-100 mb-6 max-w-xl mx-auto">
            Transform your maritime workforce wellness management today.
          </p>
          
          <Link href="/auth/register">
            <Button size="lg" variant="secondary" className="text-lg px-8">
              Create Your Account
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}