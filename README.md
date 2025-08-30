# 🌊 CalmSail - Mental Health Tracking for Ship Employees

**Sailing with Peace of Mind**

CalmSail is a comprehensive SaaS application designed specifically for tracking and monitoring the mental health of ship employees. It provides secure, confidential wellness monitoring with role-based dashboards for both employees and management.

![CalmSail Dashboard](https://img.shields.io/badge/Status-Production%20Ready-green)
![Next.js](https://img.shields.io/badge/Next.js-15.5.2-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)
![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-green)

## ✨ Features

### 👥 For Employees
- **Daily Check-ins**: Text-based mood tracking with sentiment analysis
- **Personal Dashboard**: View your own wellness trends and scores
- **Privacy First**: Your responses are confidential and encrypted
- **Wellness Visualization**: Track your mental health journey over time
- **Support Resources**: Access to crisis helplines and employee assistance

### 🏢 For Management
- **Crew Overview**: Monitor team wellness indicators
- **Risk Assessment**: Identify employees who may need support
- **Real-time Alerts**: Get notified about high-risk situations
- **Anonymized Data**: See wellness scores, not personal responses
- **Intervention Tracking**: Log support actions and follow-ups

### 🔒 Privacy & Security
- **GDPR Compliant**: Full data protection and privacy controls
- **End-to-End Encryption**: All sensitive data is encrypted
- **Role-Based Access**: Strict access controls based on user roles
- **Confidentiality**: Personal responses never shared with management

## 🚀 Technology Stack

- **Frontend**: Next.js 15.5.2 with App Router, TypeScript, TailwindCSS
- **UI Components**: shadcn/ui with Radix UI primitives
- **Backend**: Next.js API Routes with Server Actions
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: JWT-based sessions with secure cookies
- **Charts**: Recharts for data visualization
- **Sentiment Analysis**: Built-in NLP for mood classification
- **Deployment**: Vercel-ready with MongoDB Atlas

## 📦 Installation

### Prerequisites
- Node.js 18.17 or later
- npm, yarn, pnpm, or bun
- MongoDB Atlas account (or local MongoDB)

### 1. Clone the Repository
```bash
git clone https://github.com/yourusername/calmsail.git
cd calmsail
```

### 2. Install Dependencies
```bash
npm install
# or
yarn install
# or
pnpm install
```

### 3. Environment Setup
Create a `.env.local` file in the root directory:

```env
# MongoDB Connection
MONGODB_URI=mongodb+srv://username:password@cluster0.mongodb.net/calmsail?retryWrites=true&w=majority

# JWT Secret (generate a strong secret)
JWT_SECRET=your-super-secret-jwt-key-at-least-32-characters-long

# NextAuth Configuration
NEXTAUTH_SECRET=your-nextauth-secret-change-this-in-production
NEXTAUTH_URL=http://localhost:3000
```

### 4. Run Development Server
```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🌐 Deployment

### Vercel Deployment (Recommended)

1. **Connect to Vercel**
   ```bash
   npm install -g vercel
   vercel login
   vercel
   ```

2. **Set Environment Variables in Vercel**
   - Go to your Vercel project dashboard
   - Navigate to Settings → Environment Variables
   - Add all variables from `.env.local`

3. **Deploy**
   ```bash
   vercel --prod
   ```

### MongoDB Atlas Setup

1. **Create MongoDB Atlas Account**
   - Visit [MongoDB Atlas](https://www.mongodb.com/atlas)
   - Create a new cluster
   - Create a database user
   - Add your IP address to the whitelist

2. **Get Connection String**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password

3. **Database Collections**
   The application will automatically create the following collections:
   - `users` - Employee and management accounts
   - `checkins` - Daily wellness check-ins
   - `interventionnotes` - Management intervention logs

## 🎯 Usage

### First Time Setup

1. **Access the Application**
   - Navigate to your deployed URL or `http://localhost:3000`

2. **Create Management Account**
   - Click "Sign up" and create an account
   - Set role to "Management" for admin access
   - Fill in vessel and department information

3. **Create Employee Accounts**
   - Employees can self-register or be created by management
   - Set role to "Employee"
   - Provide employee ID and vessel information

### Daily Workflow

**For Employees:**
1. Log in to your dashboard
2. Complete daily wellness check-in
3. View your personal wellness trends
4. Access support resources if needed

**For Management:**
1. Log in to management dashboard
2. Review crew wellness indicators
3. Identify employees needing support
4. Log intervention actions
5. Monitor overall crew wellbeing

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - Create new user account
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### Wellness Check-ins
- `POST /api/checkin` - Submit daily check-in
- `GET /api/checkin` - Get user's check-in history

### Management
- `GET /api/management/dashboard` - Get crew wellness overview
- `POST /api/management/intervention` - Log intervention note

## 🎨 Customization

### Branding
Update the branding in:
- `src/app/layout.tsx` - Page title and description
- `src/components/AuthForm.tsx` - Logo and company name
- `src/app/globals.css` - Color scheme and themes

### Sentiment Analysis
Customize mood classification in:
- `src/lib/sentiment.ts` - Keywords and scoring logic
- Add custom risk assessment rules
- Modify wellness score calculations

## 🔒 Security Features

- **Data Encryption**: All sensitive data encrypted at rest and in transit
- **JWT Authentication**: Secure token-based authentication
- **Role-Based Access**: Strict separation between employee and management data
- **Input Validation**: All user inputs validated and sanitized
- **CSRF Protection**: Built-in Next.js security features
- **Rate Limiting**: API endpoints protected against abuse

## 🆘 Support & Crisis Management

The application includes built-in support resources:
- 24/7 Crisis hotlines
- Employee assistance programs
- Medical officer contacts
- Peer support networks

### Emergency Protocols
- High-risk indicators trigger automatic alerts
- Management receives anonymized risk notifications
- Support resources prominently displayed
- Clear escalation procedures

## 📊 Monitoring & Analytics

### Employee Metrics
- Daily check-in completion rates
- Wellness score trends
- Mood category distribution
- Risk level indicators

### Management Insights
- Crew wellness overview
- Department-wise trends
- Vessel-specific patterns
- Intervention effectiveness

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE.md](LICENSE.md) file for details.

## 🆘 Support

For support and questions:
- Email: support@calmsail.com
- Documentation: [docs.calmsail.com](https://docs.calmsail.com)
- Issues: [GitHub Issues](https://github.com/yourusername/calmsail/issues)

## 🙏 Acknowledgments

- **Next.js Team** for the incredible framework
- **Vercel** for seamless deployment
- **MongoDB** for reliable database services
- **shadcn/ui** for beautiful UI components
- **Maritime Industry** for inspiring workplace wellness initiatives

---

**CalmSail - Because mental health matters at sea.** 🌊