(Master Project Context)
1. Project Overview

Name: DigitalWorkforce (working title)

Goal: Build an AI-assisted digital workforce platform where individuals (talents) are onboarded via chatbot, auto-profiled, and then matched to real projects & tasks (similar to how service-based companies like Infosys/Wipro execute projects).

Tech Stack: Next.js (Vercel) + MongoDB Atlas.

Core Idea:
Users sign up → AI chatbot collects structured info → Auto-create profile (skills, hobbies, experiences, availability) → Projects posted by companies/clients → AI auto-splits tasks and assigns them to matched users → Employee complete and get paid → Earnings (and future SIP/benefits) tracked in dashboard.

⚡ Unlike normal hiring platforms, this is not just "recruiter searches profiles" → It’s about instant workforce activation & project execution.

2. User Flow

Landing Page → Sign In / Sign Up

Sign Up flow:

AI Chatbot onboarding asks questions → stores data in MongoDB → creates user profile.

Fields collected:

Name

Top Skills (multiple allowed)

If multiple → ask follow-up questions per skill (experience, years, projects, etc.)

Skills & Hobbies

About Me

Portfolio links

Resume (PDF upload)

Profile auto-generated → visible to companies/hirers.

Company Flow:

Company posts project → Auto-split logic breaks into tasks → Employee matched by skills.

Company can view team, progress, and completed work.

Employee Flow:

Dashboard shows profile, assigned tasks, earnings, benefits.

Employee can edit profile or accept/reject assignments.

3. Data Models (MongoDB)
users collection
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "passwordHash": String,
  "aboutMe": String,
  "skills": [
    {
      "name": String,
      "experience": String,  
      "projects": [String]
    }
  ],
  "hobbies": [String],
  "portfolioLinks": [String],
  "resumeUrl": String,
  "createdAt": Date,
  "updatedAt": Date
}

companies collection
{
  "_id": ObjectId,
  "name": String,
  "email": String,
  "company": String,
  "projects": [ObjectId],  
  "createdAt": Date
}

jobs/projects collection
{
  "_id": ObjectId,
  "title": String,
  "description": String,
  "tasks": [ObjectId],  
  "requiredSkills": [String],
  "status": String, // open, in-progress, completed
  "companyId": ObjectId,
  "createdAt": Date
}

tasks collection
{
  "_id": ObjectId,
  "jobId": ObjectId,
  "assignedTo": ObjectId,  
  "description": String,
  "status": String, // todo, in-progress, done
  "deadline": Date
}

4. Pages & Routes

/ → Landing Page

/auth/signin → Sign In

/auth/signup → Sign Up (AI chatbot onboarding)

/dashboard → Employee dashboard (profile, tasks, earnings, etc.)

/dashboard/profile → Edit profile

/dashboard/tasks → View tasks

/dashboard/earnings → Earnings + SIP view

/company → Company dashboard

/company/projects → Post & manage projects

/profile/:id → Public profile page

/admin → Admin panel (future)

5. AI Chatbot

Role: Replace forms with conversational onboarding.

Logic:

Step-by-step questioning, saves to DB incrementally.

Auto-fills user profile.

Example Flow:

Bot: "What’s your full name?"

User: "Pawan" → saved in DB.

Bot: "Nice! What are your top 2-3 skills?"

User: "Web dev, design" → saved in DB.

Bot: "Cool, tell me about your experience in Web dev?"

User: "2 years freelancing" → added under skills.

6. MVP Features

✅ Auth (Sign in / Sign up)
✅ AI chatbot onboarding → profile creation
✅ Public profile page
✅ Company can post project → auto-task split
✅ Employee dashboard (profile, tasks, earnings)
✅ Resume upload

7. Future Features (after MVP)

Skill endorsements

Recruiter/Company subscriptions

Employee benefits: SIP & insurance

AI-enhanced project auto-management

Real-time chat between company & Employee

8. Design Notes

UI: Minimal, modern (TailwindCSS)

Chatbot: Bubble interface (Intercom-like)

Company dashboard: Project cards + task status

Employee dashboard: Task board + earnings tracker. 
Platform Flow & Key Features
1. User Onboarding & Profile Creation

AI Chatbot Guided Signup

Conversational flow to collect structured information.

Auto-detects skills, hobbies, and interests.

Supports resume parsing if user uploads a file.

Profile auto-generated into structured JSON.

Profile Elements

Personal info (basic details).

Skills (technical, soft skills).

Hobbies (to show uniqueness + cultural fit).

Experience (projects, jobs, internships).

Education.

Availability & Preferred Work Type (part-time, freelance, full-time, project-based).

2. Work & Project Matching (Main Goal)

Unlike traditional job boards, DigitalWorkForce is built for execution of tasks/projects.

MNCs, service-based companies, and startups can:

Post projects, gigs, or tasks.

Define required skills, timeline, and budget.

AI-powered Matching

Matches profiles to projects automatically.

Suggests top candidates for each work request.

3. Digital Workforce Marketplace

For Individuals:

Get project-based work from companies.

Showcase verified skills & hobbies to stand out.

Build reputation & rating based on completed tasks.

For Companies (Service-based / MNC):

Instead of recruiters → they directly assign or outsource work packages.

Reduce hiring overhead by accessing ready-to-go talent.

Use platform for quick team assembly for short-term or long-term projects.

4. Skills & Hobbies Integration

Skills auto-tagged using AI (from user input).

Hobbies integrated into profiles to reflect creativity & cultural personality.

Matching system can consider hobbies if company values cultural fit (optional).

5. Database & Tech Stack (MVP Setup)

Frontend: Next.js (deployed on Vercel).

Backend: Node.js / Express (serverless functions for scale).

Database: MongoDB (user profiles, projects, matches).

AI Layer:

Warp AI / Claude context-driven agent.

Uses context.md for consistent memory.

MVP Storage Needs:

users (profiles).

projects (work posted by companies).

matches (AI recommendations & status).

skills (standardized dictionary).

ratings (feedback after project completion).
AI Chatbot & Agent Integration
1. AI Chatbot Behavior (Onboarding Bot)

Goal: Collect structured user data and auto-populate profile.

Interaction Style: Step-by-step conversation, not a form.

Question Flow:

Ask full name → store as name.

Ask top skills → store as skills[].

If multiple skills, ask follow-ups for each: experience, projects, duration.

Ask about hobbies → store as hobbies[].

Ask “About Me” description → store as aboutMe.

Ask for portfolio links → store as portfolioLinks[].

Ask to upload resume → store cloud URL in resumeUrl.

Behavior Rules:

Save each answer incrementally in MongoDB.

Validate inputs using validators.ts before saving.

Follow up intelligently if answer is incomplete.

Can suggest skills/projects based on partial inputs using AI suggestions.

2. JSON Schemas (MongoDB)
User Schema (MVP)
{
  "_id": "ObjectId",
  "name": "string",
  "email": "string",
  "passwordHash": "string",
  "aboutMe": "string",
  "skills": [
    {
      "name": "string",
      "experience": "string",
      "projects": ["string"]
    }
  ],
  "hobbies": ["string"],
  "portfolioLinks": ["string"],
  "resumeUrl": "string",
  "createdAt": "Date",
  "updatedAt": "Date"
}

Project Schema
{
  "_id": "ObjectId",
  "companyName": "string",
  "projectTitle": "string",
  "description": "string",
  "requiredSkills": ["string"],
  "budget": "number",
  "timeline": "string",
  "assignedUsers": ["ObjectId"], // references to users
  "status": "string", // pending, in-progress, completed
  "createdAt": "Date",
  "updatedAt": "Date"
}

Match Schema (AI Recommendations)
{
  "_id": "ObjectId",
  "userId": "ObjectId",
  "projectId": "ObjectId",
  "matchScore": "number",
  "status": "string", // suggested, accepted, declined
  "createdAt": "Date"
}

3. Context Rules for Warp AI / Claude

Purpose: Keep agent consistent across multiple Warp AI sessions.

Rules:

Always refer to context.md for platform logic.

Do not invent features not discussed in context.md.

AI should produce Next.js + TypeScript + MongoDB-compatible code.

On generating API routes, follow App Router structure.

Always respect field names in JSON schemas.

Save incremental outputs (e.g., skills, hobbies) exactly as per schema.

When coding, AI assumes user may switch Warp AI accounts. Use context.md as single source of truth.

4. MVP API Endpoint Mapping
Feature	Endpoint	Method	Notes
Register	/api/auth/register/route.ts	POST	Trigger chatbot onboarding
Login	/api/auth/login/route.ts	POST	JWT-based auth
Profile	/api/users/profile/route.ts	GET/POST	Auto-populated from chatbot
Chatbot Q&A	/api/users/chatbot/route.ts	POST	Save incremental answers
Project Post	/api/jobs/post/route.ts	POST	Companies post projects
Project List	/api/jobs/list/route.ts	GET	Employee view available projects
Project Assign	/api/jobs/assign/route.ts	POST	Auto-match Employee by skills

Developer Notes, Deployment & Workflow Guide
1. Project Setup (Developer Notes)

Node & Package Setup:

Node.js v20+ recommended

Install dependencies:

npm install


Environment Variables (.env.local):

MONGODB_URI=mongodb+srv://pa1:Pawan@098@cluster0.poias51.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0
JWT_SECRET=<Your JWT secret key>
NEXT_PUBLIC_APP_URL=https://digitalworkforce.vercel.app
CLOUD_STORAGE_URL=<Optional: S3/Cloud storage URL for resumes>
GITHUB_REPO=https://github.com/hiraypawan/DigitalWorkForce.git


Notes:

JWT_SECRET: Generate a secure random string for signing tokens.

NEXT_PUBLIC_APP_URL: Use your dev URL or production domain.

CLOUD_STORAGE_URL: Optional, only if using cloud storage for resumes.

GITHUB_REPO: Add your repository link for reference and deployment hooks.

TypeScript:

Ensure tsconfig.json paths match @/lib, @/models, etc.

Use strict typing for all models and API responses.

2. Local Development Workflow

Start Development Server:

npm run dev


Default URL: http://localhost:3000

Folder Guidelines:

src/app → All pages + App Router

src/components → Reusable UI components

src/lib → Utility files (db.ts, validators.ts, auth.ts, etc.)

src/models → Mongoose schemas

src/types → TypeScript type definitions

Coding Conventions:

Use Next.js App Router conventions (page.tsx, route.ts)

Always type MongoDB models (User, Project, Match)

Chatbot flow must update MongoDB incrementally

Avoid hardcoding skills/projects; reference JSON schema

3. AI Chatbot Integration Workflow

On signup (/api/auth/register):

Create user record in MongoDB

Trigger chatbot onboarding (/api/users/chatbot)

Save each answer → incrementally populate profile fields

On completion → redirect to /dashboard/profile

Key Notes:

Use ChatBox.tsx for chatbot UI

Incremental updates must respect User schema

Validate all input using validators.ts

4. API & Feature Development Guidelines

Always follow App Router + Route API structure

/api/jobs/assign → match users based on skills overlap

/dashboard/tasks & /dashboard/earnings → start with dummy data, later fetch live matches/payments

Payments & benefits (SIP/Insurance) → integrate later, use mocks for MVP

5. Deployment Notes

Platform: Vercel (preferred for Next.js)

MongoDB Atlas: Remote DB connection

Env Variables: Add via Vercel dashboard for production

Build Command:

npm run build
npm start


Static Assets: Place in /public (logos, favicon, sample resume templates, etc.)

TailwindCSS: Already configured in tailwind.config.js

6. Developer Collaboration Rules

Always refer to context.md → single source of truth

Incremental updates in MongoDB must match JSON schema

Avoid adding unapproved features until MVP is stable

Document any schema or route changes in this context file

7. MVP Flow Summary (For Dev Reference)

User signs up → chatbot triggers onboarding

Bot collects profile data → stored in MongoDB

Profile auto-created → visible in /dashboard/profile

Employee view tasks & earnings → initially dummy data

Companies post projects → auto-assign Employee via skills

Payments & benefits → mock until fully integrated