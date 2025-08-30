import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Link from 'next/link';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-teal-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center gap-4">
              <h1 className="text-2xl font-bold text-blue-800">🌊 CalmSail</h1>
              <span className="text-sm text-muted-foreground">Privacy Policy</span>
            </div>
            <Link href="/">
              <Button variant="outline" size="sm">
                Back to Dashboard
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-2xl">Privacy Policy & Data Protection</CardTitle>
            <CardDescription>
              Last updated: {new Date().toLocaleDateString()}
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {/* Introduction */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Our Commitment to Your Privacy</h2>
              <p className="text-sm text-muted-foreground mb-4">
                CalmSail is committed to protecting the privacy and confidentiality of our employees' mental health information. 
                This privacy policy explains how we collect, use, protect, and share your personal wellness data.
              </p>
              <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                <p className="text-sm">
                  <strong>Key Promise:</strong> Your individual responses and personal thoughts shared during check-ins 
                  are never disclosed to management. Only anonymized wellness scores and risk indicators are shared 
                  for safety purposes.
                </p>
              </div>
            </section>

            {/* Data Collection */}
            <section>
              <h2 className="text-xl font-semibold mb-4">What Information We Collect</h2>
              <div className="space-y-3 text-sm">
                <div>
                  <h3 className="font-medium">Personal Information:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Name, email address, employee ID</li>
                    <li>Vessel assignment and department</li>
                    <li>Account creation and login timestamps</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium">Wellness Data:</h3>
                  <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                    <li>Daily mood check-in responses (text/voice input)</li>
                    <li>Automatically calculated wellness scores (0-100)</li>
                    <li>Sentiment analysis results and mood categories</li>
                    <li>Check-in frequency and patterns</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Data Usage */}
            <section>
              <h2 className="text-xl font-semibold mb-4">How We Use Your Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-green-50 border-green-200">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-green-800 mb-2">For You (Individual)</h3>
                    <ul className="text-xs text-green-700 space-y-1">
                      <li>• Personal wellness tracking and trends</li>
                      <li>• Self-awareness and mental health insights</li>
                      <li>• Historical mood pattern analysis</li>
                    </ul>
                  </CardContent>
                </Card>
                <Card className="bg-blue-50 border-blue-200">
                  <CardContent className="pt-4">
                    <h3 className="font-medium text-blue-800 mb-2">For Safety (Management)</h3>
                    <ul className="text-xs text-blue-700 space-y-1">
                      <li>• Wellness scores only (no personal responses)</li>
                      <li>• Risk level indicators for crew safety</li>
                      <li>• General wellness trends and patterns</li>
                    </ul>
                  </CardContent>
                </Card>
              </div>
            </section>

            {/* Data Protection */}
            <section>
              <h2 className="text-xl font-semibold mb-4">How We Protect Your Data</h2>
              <div className="space-y-3 text-sm">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h3 className="font-medium">Technical Safeguards:</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                      <li>End-to-end encryption of all data</li>
                      <li>Secure database connections (MongoDB Atlas)</li>
                      <li>Authentication tokens and secure sessions</li>
                      <li>Regular security updates and monitoring</li>
                    </ul>
                  </div>
                  <div>
                    <h3 className="font-medium">Access Controls:</h3>
                    <ul className="list-disc list-inside ml-4 space-y-1 text-muted-foreground">
                      <li>Role-based access restrictions</li>
                      <li>Employees can only see their own data</li>
                      <li>Management sees only anonymized metrics</li>
                      <li>Audit trails for all data access</li>
                    </ul>
                  </div>
                </div>
              </div>
            </section>

            {/* Data Sharing */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Data Sharing and Disclosure</h2>
              <div className="space-y-4">
                <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">We NEVER Share:</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    <li>• Your actual written or spoken responses</li>
                    <li>• Personal thoughts, feelings, or specific concerns you share</li>
                    <li>• Individual check-in content with anyone, including management</li>
                  </ul>
                </div>
                
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                  <h3 className="font-medium text-amber-800 mb-2">We Only Share (with Management):</h3>
                  <ul className="text-sm text-amber-700 space-y-1">
                    <li>• Wellness scores (0-100 numerical values only)</li>
                    <li>• Risk categories (low, medium, high - no details)</li>
                    <li>• Check-in frequency and participation rates</li>
                    <li>• Anonymized trends for crew safety purposes</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Your Rights */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Your Privacy Rights</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                <div>
                  <h3 className="font-medium mb-2">You Have the Right To:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Access your personal data</li>
                    <li>Correct inaccurate information</li>
                    <li>Delete your account and data</li>
                    <li>Data portability (export your data)</li>
                    <li>Restrict processing of your data</li>
                  </ul>
                </div>
                <div>
                  <h3 className="font-medium mb-2">To Exercise Your Rights:</h3>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    <li>Contact your HR department</li>
                    <li>Email: privacy@calmsail.com</li>
                    <li>Submit a request through your dashboard</li>
                    <li>Speak with your supervisor</li>
                  </ul>
                </div>
              </div>
            </section>

            {/* Emergency Situations */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Emergency Situations</h2>
              <div className="bg-orange-50 p-4 rounded-lg border border-orange-200">
                <p className="text-sm text-orange-800">
                  <strong>Important:</strong> In cases where immediate safety risks are detected (high-risk indicators 
                  suggesting self-harm or harm to others), we may need to alert appropriate personnel to ensure your safety 
                  and the safety of the crew. Even in these situations, your specific responses remain confidential.
                </p>
              </div>
            </section>

            {/* Data Retention */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Data Retention</h2>
              <div className="space-y-2 text-sm text-muted-foreground">
                <p>• Personal wellness data is retained for 2 years after your employment ends</p>
                <p>• Anonymized statistical data may be retained longer for research and safety improvements</p>
                <p>• You can request deletion of your data at any time</p>
              </div>
            </section>

            {/* Contact Information */}
            <section>
              <h2 className="text-xl font-semibold mb-4">Contact Us</h2>
              <div className="bg-gray-50 p-4 rounded-lg">
                <p className="text-sm mb-2">
                  If you have questions about this privacy policy or your data:
                </p>
                <div className="text-sm space-y-1">
                  <p>Email: privacy@calmsail.com</p>
                  <p>Phone: +1 (555) 123-4567</p>
                  <p>Address: CalmSail Privacy Office, 123 Maritime Way, Harbor City</p>
                </div>
              </div>
            </section>

            {/* Footer */}
            <section className="text-center pt-8 border-t">
              <p className="text-xs text-muted-foreground">
                This privacy policy is compliant with GDPR, CCPA, and maritime industry regulations. 
                We are committed to maintaining the highest standards of data protection and employee privacy.
              </p>
            </section>
          </CardContent>
        </Card>
      </main>
    </div>
  );
}