# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Project Overview

DigitalWorkforce is an AI-powered digital workforce platform built with Next.js 14 (App Router), TypeScript, MongoDB Atlas, and Google Gemini AI. The platform connects talented individuals with companies for micro-task execution, featuring automated project splitting, skill-based matching, and integrated payment systems.

**Key Value Proposition**: Unlike traditional hiring platforms, this provides instant workforce activation and project execution through AI-powered task breakdown and automated assignment.

## Essential Commands

### Development
```bash
# Start development server
npm run dev

# Build for production
npm run build

# Run production server
npm start

# Run ESLint
npm run lint
```

### Database & Environment Setup
```bash
# Set up environment variables (copy .env.example to .env.local)
cp .env.example .env.local
# Then update MongoDB URI, JWT secrets, and API keys in .env.local
```

### Testing API Endpoints
```bash
# Test AI chat functionality
curl -X POST http://localhost:3000/api/chat \
  -H "Content-Type: application/json" \
  -d '{"message": "I am a React developer with 3 years experience"}'

# Test portfolio endpoint
curl -X GET http://localhost:3000/api/portfolio
```

## High-Level Architecture

### Core System Design

The platform uses a **dual-profile system**:
- **Legacy User Model** (`src/models/User.ts`): Traditional structured profiles with skills arrays
- **New Profile System** (via Portfolio model): AI-extracted conversational data

### Key Architectural Patterns

#### 1. AI-Driven Profile Creation
- **ChatbotOnboarding** component uses **"Dark Psychology"** conversational AI
- Google Gemini AI extracts structured data from natural conversation
- Real-time profile updates via `/api/chat` route with portfolio persistence
- Dual data storage: immediate UI updates + database persistence

#### 2. Intelligent Task Splitting
- **TaskSplitter** class (`src/lib/task-splitter.ts`) automatically breaks complex projects into micro-tasks
- Algorithm considers: complexity level, budget distribution, skill requirements
- Auto-assignment based on skill matching and worker availability scores

#### 3. Multi-Role User System
- **Workers**: Complete micro-tasks, earn money, auto-invest in SIP
- **Companies**: Post projects, get auto-task breakdown, monitor progress
- **Admins**: System oversight and management

#### 4. Middleware-Based Route Protection
- Authentication via NextAuth with JWT tokens
- Protected routes automatically redirect to login
- Onboarding flow enforcement for incomplete profiles

### Database Architecture

#### Primary Collections (MongoDB)
```typescript
// Users - Core user data with dual profile system
users: {
  // Traditional fields
  name, email, passwordHash, role, rating, earnings
  // New AI-extracted profile
  profile: { about, skills[], experience[], projects[] }
  // Legacy fields (backwards compatibility)
  aboutMe, skills: Skill[], hobbies[], portfolioLinks[]
}

// Portfolios - Detailed AI-extracted profiles  
portfolios: {
  userId, name, bio, education[], experience[], skills[], 
  projects[], certifications[], achievements[], goals[], hobbies[]
}

// Jobs/Projects - Company-posted work
jobs: {
  title, description, tasks[], requiredSkills[], 
  budget, complexity, companyId, status
}

// Tasks - Auto-generated micro-tasks
tasks: {
  jobId, assignedTo, description, estimatedHours, 
  budget, skills[], priority, status
}
```

#### Key Indexing Strategy
- Skills-based querying: `skills.name`, `profile.skills`
- Availability matching: `available`, `rating`
- Task assignment: `skills` intersection with task requirements

### API Route Patterns

#### App Router Structure
All API routes follow Next.js 13+ App Router pattern:
```
src/app/api/
├── chat/route.ts          # AI chatbot with Gemini integration
├── portfolio/route.ts     # Portfolio CRUD operations
└── auth/[...nextauth]/    # NextAuth configuration
```

#### Critical API Behaviors

**`/api/chat`** (Core AI Engine):
- Processes natural language → structured data extraction
- Uses "Dark Psychology" prompting for engagement
- Incremental portfolio updates in real-time
- Graceful fallbacks when AI service unavailable

**Task Assignment Algorithm** (`TaskSplitter`):
- Planning (20% budget) → Implementation tasks → Testing (15%) → Review (10%)
- Skill matching via keyword extraction and semantic similarity
- Priority determination based on requirement keywords

## Development Patterns

### Component Architecture
- **Server Components** for data fetching (dashboard pages)
- **Client Components** for interactive UI (ChatbotOnboarding, ProfilePreview)
- **Middleware** for authentication and route protection

### State Management
- **NextAuth** for authentication state
- **SWR** for client-side data fetching and caching
- **React Hook Form + Zod** for form validation

### Error Handling Strategy
- API routes return graceful fallbacks (status 200 with error messages)
- Client components show user-friendly error states
- MongoDB connection caching to prevent connection exhaustion

## Environment Requirements

### Required Variables
```env
MONGODB_URI=                 # MongoDB Atlas connection string
JWT_SECRET=                  # For manual JWT operations
NEXTAUTH_SECRET=            # NextAuth encryption key
GEMINI_API_KEY=             # Google Gemini AI (core feature)
NEXT_PUBLIC_APP_URL=        # Application base URL
```

### Optional Variables
```env
STRIPE_SECRET_KEY=          # Payment processing
RAZORPAY_KEY_ID=           # Alternative payment provider
GOOGLE_CLIENT_ID=          # OAuth login
OPENAI_API_KEY=            # Fallback AI provider
```

## Fixed Issues (Latest Updates)

### ✅ Authentication & Session Management
- Fixed NextAuth session handling throughout the application
- Updated dashboard to use `useSession()` instead of localStorage tokens
- Fixed middleware route protection for authenticated users
- Resolved "Sign in to begin" appearing for logged-in users

### ✅ AI Chatbot Improvements
- **Replaced "Dark Psychology" prompting** with professional, supportive tone
- Updated system prompt to focus on portfolio building essentials:
  - Name extraction and professional title
  - Skills and expertise areas
  - Work experience and projects
  - Education and certifications
  - Career goals and interests
- Real-time profile updates working with live preview
- Graceful fallbacks when AI service unavailable

### ✅ Live Profile Preview
- Real-time updates during AI conversation
- Professional profile cards with completion tracking
- Data persistence to both User and Portfolio models
- Export functionality (JSON, PDF, shareable links)

## Testing Approach

### Manual Testing Flow
1. **Authentication**: Test sign-in → dashboard flow without redirects
2. **AI Onboarding**: Chat with bot at `/onboarding`, verify professional responses
3. **Live Updates**: Watch profile preview update as you chat with AI
4. **Dashboard Access**: Navigate to `/dashboard` after completing profile
5. **Profile Persistence**: Refresh page, verify data maintained

### Key Test Scenarios
- NextAuth session persistence across page navigation
- AI chatbot professional conversation flow (no "dark psychology")
- Real-time profile updates during chat
- MongoDB dual-model data synchronization (User + Portfolio)
- Fallback responses when Gemini AI unavailable

## Deployment Architecture

### Vercel Deployment
- **Serverless Functions**: All API routes auto-deployed as serverless
- **MongoDB Atlas**: Remote database with connection pooling
- **Environment Variables**: Set via Vercel dashboard for production
- **Static Assets**: `/public` folder for favicon, images

### Production Considerations
- MongoDB connection caching prevents serverless cold start issues
- Gemini AI quota monitoring (fallback responses if quota exceeded)
- NextAuth JWT secret must be consistent across deployments

## AI Integration Details

### Gemini AI Configuration
The platform uses a sophisticated "Dark Psychology" approach for profile extraction:
- **Conversational Flow**: Step-by-step data extraction vs traditional forms
- **JSON Response Format**: Structured data extraction from natural language
- **Real-time Updates**: Immediate portfolio persistence with UI feedback
- **Fallback Mechanisms**: Keyword-based extraction when AI unavailable

### Task Intelligence
- **Auto-splitting Algorithm**: Complexity-aware task breakdown
- **Skill Matching**: Semantic skill matching between tasks and workers
- **Priority Assignment**: Keyword-based priority determination
- **Budget Distribution**: Intelligent budget allocation across task phases

## Integration Points

### Payment Systems
- **Stripe Integration**: Primary payment processor
- **Razorpay Support**: Alternative for international markets
- **SIP Investments**: Automatic wealth building feature (planned)

### Authentication Flow
- **NextAuth**: Supports OAuth (Google) + credential-based login
- **JWT Tokens**: For API authentication
- **Role-based Access**: Worker/Company/Admin role enforcement

This architecture enables rapid scaling through serverless deployment while maintaining sophisticated AI-powered task management and user experience.
