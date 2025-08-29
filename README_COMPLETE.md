# DigitalWorkforce - Micro-Task Platform with Integrated Financial Services

A comprehensive digital workforce platform that connects skilled workers with companies for micro-tasks, featuring AI-powered profile building, automatic task assignment, and integrated wealth-building services through SIP investments and insurance.

## 🚀 Features

### Core Platform
- **AI-Powered Onboarding**: Chatbot builds user profiles automatically
- **Smart Task Matching**: Algorithm matches workers with suitable micro-tasks
- **Role-Based Access**: Separate dashboards for workers and companies
- **Real-time Task Management**: Complete workflow from job posting to payment

### Financial Services Integration
- **SIP Investments**: Automatic investment of earnings in mutual funds
- **Health Insurance**: Integrated insurance coverage for workers
- **Instant Payments**: Razorpay/Stripe integration for immediate payments
- **Earnings Tracking**: Comprehensive financial dashboard

## 🛠️ Tech Stack

- **Frontend**: Next.js 14 with TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose ODM
- **Authentication**: Custom JWT implementation
- **Payments**: Razorpay & Stripe integration
- **UI Components**: Lucide React icons, custom components

## 📁 Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── auth/          # Authentication endpoints
│   │   ├── users/         # User management & chatbot
│   │   ├── jobs/          # Job posting & assignment
│   │   └── payments/      # Payment processing
│   ├── auth/              # Login/Register pages
│   ├── dashboard/         # Worker dashboard
│   ├── company/           # Company dashboard
│   └── onboarding/        # AI chatbot onboarding
├── components/            # Reusable UI components
├── lib/                   # Utilities (auth, db, payments)
├── models/                # MongoDB schemas
└── types/                 # TypeScript definitions
```

## 🚦 Getting Started

### Prerequisites
- Node.js 18+ 
- MongoDB (local or Atlas)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd digitalworkforce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   Update `.env.local` with your values:
   ```env
   # Database
   MONGODB_URI=mongodb://localhost:27017/digitalworkforce
   
   # Authentication
   JWT_SECRET=your-super-secret-jwt-key-here-change-in-production
   
   # Payment Providers
   STRIPE_SECRET_KEY=sk_test_your_stripe_key
   STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_key
   RAZORPAY_KEY_ID=your_razorpay_key_id
   RAZORPAY_KEY_SECRET=your_razorpay_key_secret
   ```

4. **Start MongoDB**
   ```bash
   # Local MongoDB
   mongod
   
   # Or use MongoDB Atlas connection string
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

## 🔑 User Flow

### For Workers
1. **Register** → Choose "Worker" role
2. **AI Onboarding** → Chat with AI to build profile
3. **Dashboard Access** → View tasks, earnings, profile
4. **Task Management** → Accept and complete micro-tasks
5. **Earnings & Investment** → Track income and SIP investments

### For Companies
1. **Register** → Choose "Company" role
2. **Post Projects** → Create job postings with requirements
3. **Auto-Task Splitting** → AI breaks down projects into micro-tasks
4. **Worker Assignment** → Algorithm assigns tasks to suitable workers
5. **Payment Processing** → Pay workers upon task completion

## 🎯 MVP Components Implemented

### ✅ Authentication System
- [x] User registration with role selection
- [x] JWT-based authentication
- [x] Protected routes middleware
- [x] Login/logout functionality

### ✅ AI Chatbot Profile Builder
- [x] Interactive chat interface
- [x] Skill and hobby extraction
- [x] Automatic profile population
- [x] Onboarding flow completion

### ✅ Dashboard Systems
- [x] Worker dashboard with stats
- [x] Task management interface
- [x] Earnings and investment tracking
- [x] Profile management

### ✅ Company Workflow
- [x] Project posting interface
- [x] Job listing and management
- [x] Auto-task assignment algorithm
- [x] Worker performance tracking

### ✅ Payment Foundation
- [x] Payment API structure
- [x] Razorpay/Stripe integration framework
- [x] Earnings calculation
- [x] Mock SIP/Insurance display

## 🔧 API Endpoints

### Authentication
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login

### User Management
- `GET /api/users/profile` - Get user profile
- `PUT /api/users/profile` - Update profile
- `POST /api/users/chatbot` - AI chatbot interaction

### Job Management
- `POST /api/jobs/post` - Post new job
- `POST /api/jobs/assign` - Auto-assign tasks
- `GET /api/jobs/list` - List jobs/tasks

### Payments
- `POST /api/payments/create` - Process payments
- `POST /api/payments/release` - Release escrow payments

## 🧪 Testing

1. **Start the app**: `npm run dev`
2. **Register as Worker**: Test AI onboarding flow
3. **Register as Company**: Test job posting and assignment
4. **Test Workflows**: Complete the full user journey

## 🚀 Next Steps (Phase 2)

1. **Real AI Integration**: Replace mock chatbot with OpenAI/Claude
2. **Payment Gateway**: Complete Razorpay/Stripe integration
3. **SIP Integration**: Connect with mutual fund APIs
4. **Insurance Portal**: Partner with insurance providers
5. **Advanced Analytics**: Performance tracking and insights
6. **Mobile App**: React Native implementation
7. **Video Calls**: Integrated communication tools
8. **Dispute Resolution**: Automated conflict management

## 📝 Database Models

### User
- Authentication & profile data
- Skills, hobbies, experience
- Financial tracking (earnings, SIP, insurance)

### Job
- Company job postings
- Requirements and budget
- Task splitting and assignment

### Task
- Micro-tasks split from jobs
- Worker assignment and progress
- Payment and completion tracking

### ChatbotConversation
- AI onboarding conversations
- Extracted user data
- Conversation context and status

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is proprietary. All rights reserved.

---

**DigitalWorkforce** - *Connecting skilled workers with companies for micro-tasks*
