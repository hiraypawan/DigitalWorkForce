import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio, { IPortfolio } from '@/models/Portfolio';
import { analyzeProfileCompletion } from '@/lib/profile-analysis';

export const dynamic = 'force-dynamic';

// GET /api/portfolio - Fetch user portfolio
export async function GET(request: NextRequest) {
  try {
    console.log('Portfolio API - GET request received');
    console.log('Portfolio API - Request URL:', request.url);
    console.log('Portfolio API - Request headers:', Object.fromEntries(request.headers.entries()));
    console.log('Portfolio API - Request cookies:', request.cookies.getAll());
    
    // Get specific NextAuth cookies for debugging
    const sessionToken = request.cookies.get('next-auth.session-token');
    const csrfToken = request.cookies.get('next-auth.csrf-token');
    console.log('Portfolio API - Session token present:', !!sessionToken);
    console.log('Portfolio API - CSRF token present:', !!csrfToken);
    
    // Get session using NextAuth with request context
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    console.log('Portfolio API - Session found:', !!session);
    console.log('Portfolio API - Full session:', session);
    console.log('Portfolio API - User ID:', userId);
    
    if (!userId) {
      console.log('Portfolio API - No valid session');
      return NextResponse.json({ 
        error: 'Unauthorized',
        debug: {
          sessionTokenPresent: !!sessionToken,
          csrfTokenPresent: !!csrfToken,
          sessionFound: !!session,
          headers: Object.fromEntries(request.headers.entries())
        }
      }, { status: 401 });
    }

    await dbConnect();
    
    // Find or create portfolio
    let portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        name: '',
        bio: '',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        goals: [],
        hobbies: [],
        contactInfo: {},
        preferences: {},
        lastUpdated: new Date(),
        completionPercentage: 0
      });
      await portfolio.save();
    }

    // Recalculate completion percentage for accurate display
    const profileData = {
      name: portfolio.name,
      title: portfolio.title,
      bio: portfolio.bio,
      location: portfolio.location,
      availability: portfolio.availability,
      education: portfolio.education,
      experience: portfolio.experience,
      skills: portfolio.skills,
      projects: portfolio.projects,
      certifications: portfolio.certifications,
      achievements: portfolio.achievements,
      goals: portfolio.goals,
      hobbies: portfolio.hobbies,
      contactInfo: portfolio.contactInfo,
      portfolioSamples: portfolio.portfolioSamples,
      workPreferences: portfolio.workPreferences,
      endorsements: portfolio.endorsements,
      onlineCourses: portfolio.onlineCourses,
      testimonials: portfolio.testimonials
    };
    
    const analysis = analyzeProfileCompletion(profileData);
    portfolio.completionPercentage = analysis.completionPercentage;
    await portfolio.save();

    // Debug log experience data
    console.log('Portfolio API - Experience data:', JSON.stringify(portfolio.experience, null, 2));
    
    // Ensure backward compatibility by transforming data if needed
    const compatiblePortfolio = {
      ...portfolio.toObject(),
      skills: portfolio.skills?.map((skill: any) => {
        if (typeof skill === 'string') {
          return { name: skill, proficiency: 'Intermediate', category: 'Technical' };
        }
        return skill;
      }) || [],
      certifications: portfolio.certifications?.map((cert: any) => {
        if (typeof cert === 'string') {
          return { name: cert, issuer: 'Unknown', year: new Date().getFullYear().toString() };
        }
        return cert;
      }) || [],
      experience: portfolio.experience?.map((exp: any) => {
        // Fix any malformed experience data
        if (typeof exp === 'string' || !exp.role || !exp.company) {
          console.log('Portfolio API - Found malformed experience:', exp);
          return {
            role: exp?.role || 'Unknown Role',
            company: exp?.company || 'Unknown Company', 
            duration: exp?.duration || 'Unknown Duration',
            details: exp?.details || exp || 'No details provided',
            location: exp?.location || undefined,
            achievements: exp?.achievements || [],
            websiteUrl: exp?.websiteUrl || undefined,
            projectUrls: exp?.projectUrls || []
          };
        }
        return {
          ...exp,
          websiteUrl: exp?.websiteUrl || undefined,
          projectUrls: exp?.projectUrls || []
        };
      }) || []
    };
    
    return NextResponse.json(compatiblePortfolio);

  } catch (error) {
    console.error('Portfolio GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 });
  }
}

// POST /api/portfolio - Update portfolio with extracted data
export async function POST(request: NextRequest) {
  try {
    console.log('Portfolio API - POST request received');
    
    // Get session using NextAuth with request context
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    console.log('Portfolio API - Session found:', !!session);
    console.log('Portfolio API - User ID:', userId);
    
    if (!userId) {
      console.log('Portfolio API - No valid session');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    
    const updateData = await request.json();
    console.log('Portfolio API - Update data received:', updateData);

    await dbConnect();
    
    // Find or create portfolio
    let portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      portfolio = new Portfolio({
        userId,
        name: '',
        bio: '',
        education: [],
        experience: [],
        skills: [],
        projects: [],
        certifications: [],
        achievements: [],
        goals: [],
        hobbies: [],
        contactInfo: {},
        preferences: {},
        lastUpdated: new Date(),
        completionPercentage: 0
      });
    }

    // Update fields based on extracted data
    if (updateData.name && typeof updateData.name === 'string') {
      portfolio.name = updateData.name.trim();
    }

    if (updateData.bio && typeof updateData.bio === 'string') {
      portfolio.bio = updateData.bio.trim();
    }

    // Handle education
    if (updateData.education && Array.isArray(updateData.education)) {
      updateData.education.forEach((edu: any) => {
        if (edu.degree && edu.institution && edu.year) {
          // Check if education already exists to avoid duplicates
          const exists = portfolio.education.some((existing: any) => 
            existing.degree.toLowerCase() === edu.degree.toLowerCase() &&
            existing.institution.toLowerCase() === edu.institution.toLowerCase()
          );
          
          if (!exists) {
            portfolio.education.push({
              degree: edu.degree,
              institution: edu.institution,
              year: edu.year,
              gpa: edu.gpa,
              honors: edu.honors
            });
          }
        }
      });
    }

    // Handle experience
    if (updateData.experience && Array.isArray(updateData.experience)) {
      updateData.experience.forEach((exp: any) => {
        if (exp.role && exp.company && exp.duration && exp.details) {
          // Check if experience already exists to avoid duplicates
          const exists = portfolio.experience.some((existing: any) => 
            existing.role.toLowerCase() === exp.role.toLowerCase() &&
            existing.company.toLowerCase() === exp.company.toLowerCase()
          );
          
          if (!exists) {
            portfolio.experience.push({
              role: exp.role,
              company: exp.company,
              duration: exp.duration,
              details: exp.details,
              location: exp.location,
              achievements: exp.achievements || []
            });
          }
        }
      });
    }

    // Handle skills (add unique skills only)
    if (updateData.skills && Array.isArray(updateData.skills)) {
      updateData.skills.forEach((skill: string) => {
        if (skill && typeof skill === 'string') {
          const skillTrimmed = skill.trim();
          if (!portfolio.skills.some((existing: any) => 
            existing.toLowerCase() === skillTrimmed.toLowerCase()
          )) {
            portfolio.skills.push(skillTrimmed);
          }
        }
      });
    }

    // Handle projects
    if (updateData.projects && Array.isArray(updateData.projects)) {
      updateData.projects.forEach((proj: any) => {
        if (proj.title && proj.description) {
          // Check if project already exists to avoid duplicates
          const exists = portfolio.projects.some((existing: any) => 
            existing.title.toLowerCase() === proj.title.toLowerCase()
          );
          
          if (!exists) {
            portfolio.projects.push({
              title: proj.title,
              description: proj.description,
              link: proj.link,
              technologies: proj.technologies || [],
              status: proj.status || 'completed'
            });
          }
        }
      });
    }

    // Handle certifications (add unique certifications only)
    if (updateData.certifications && Array.isArray(updateData.certifications)) {
      updateData.certifications.forEach((cert: string) => {
        if (cert && typeof cert === 'string') {
          const certTrimmed = cert.trim();
          if (!portfolio.certifications.some((existing: any) => 
            existing.toLowerCase() === certTrimmed.toLowerCase()
          )) {
            portfolio.certifications.push(certTrimmed);
          }
        }
      });
    }

    // Handle achievements (add unique achievements only)
    if (updateData.achievements && Array.isArray(updateData.achievements)) {
      updateData.achievements.forEach((achievement: string) => {
        if (achievement && typeof achievement === 'string') {
          const achievementTrimmed = achievement.trim();
          if (!portfolio.achievements.some((existing: any) => 
            existing.toLowerCase() === achievementTrimmed.toLowerCase()
          )) {
            portfolio.achievements.push(achievementTrimmed);
          }
        }
      });
    }

    // Handle goals (add unique goals only)
    if (updateData.goals && Array.isArray(updateData.goals)) {
      updateData.goals.forEach((goal: string) => {
        if (goal && typeof goal === 'string') {
          const goalTrimmed = goal.trim();
          if (!portfolio.goals.some((existing: any) => 
            existing.toLowerCase() === goalTrimmed.toLowerCase()
          )) {
            portfolio.goals.push(goalTrimmed);
          }
        }
      });
    }

    // Handle hobbies (add unique hobbies only)
    if (updateData.hobbies && Array.isArray(updateData.hobbies)) {
      updateData.hobbies.forEach((hobby: string) => {
        if (hobby && typeof hobby === 'string') {
          const hobbyTrimmed = hobby.trim();
          if (!portfolio.hobbies.some((existing: any) => 
            existing.toLowerCase() === hobbyTrimmed.toLowerCase()
          )) {
            portfolio.hobbies.push(hobbyTrimmed);
          }
        }
      });
    }

    // Handle contact info
    if (updateData.contactInfo) {
      portfolio.contactInfo = {
        ...portfolio.contactInfo,
        ...updateData.contactInfo
      };
    }

    // Handle preferences
    if (updateData.preferences) {
      portfolio.preferences = {
        ...portfolio.preferences,
        ...updateData.preferences
      };
    }

    // Calculate real-time completion percentage
    const profileData = {
      name: portfolio.name,
      title: portfolio.title,
      bio: portfolio.bio,
      location: portfolio.location,
      availability: portfolio.availability,
      education: portfolio.education,
      experience: portfolio.experience,
      skills: portfolio.skills,
      projects: portfolio.projects,
      certifications: portfolio.certifications,
      achievements: portfolio.achievements,
      goals: portfolio.goals,
      hobbies: portfolio.hobbies,
      contactInfo: portfolio.contactInfo,
      portfolioSamples: portfolio.portfolioSamples,
      workPreferences: portfolio.workPreferences,
      endorsements: portfolio.endorsements,
      onlineCourses: portfolio.onlineCourses,
      testimonials: portfolio.testimonials
    };
    
    const analysis = analyzeProfileCompletion(profileData);
    portfolio.completionPercentage = analysis.completionPercentage;
    portfolio.lastUpdated = new Date();

    await portfolio.save();
    console.log('Portfolio updated successfully for user:', userId, 'Completion:', analysis.completionPercentage + '%');

    return NextResponse.json(portfolio);

  } catch (error) {
    console.error('Portfolio POST error:', error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

// PATCH /api/portfolio - Direct portfolio field updates (for manual edits)
export async function PATCH(request: NextRequest) {
  try {
    // Get session using NextAuth with request context
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    
    await dbConnect();
    
    const portfolio = await Portfolio.findOneAndUpdate(
      { userId },
      { ...updateData, lastUpdated: new Date() },
      { new: true, upsert: true }
    );

    // Calculate real-time completion percentage after update
    const profileData = {
      name: portfolio.name,
      title: portfolio.title,
      bio: portfolio.bio,
      location: portfolio.location,
      availability: portfolio.availability,
      education: portfolio.education,
      experience: portfolio.experience,
      skills: portfolio.skills,
      projects: portfolio.projects,
      certifications: portfolio.certifications,
      achievements: portfolio.achievements,
      goals: portfolio.goals,
      hobbies: portfolio.hobbies,
      contactInfo: portfolio.contactInfo,
      portfolioSamples: portfolio.portfolioSamples,
      workPreferences: portfolio.workPreferences,
      endorsements: portfolio.endorsements,
      onlineCourses: portfolio.onlineCourses,
      testimonials: portfolio.testimonials
    };
    
    const analysis = analyzeProfileCompletion(profileData);
    portfolio.completionPercentage = analysis.completionPercentage;
    await portfolio.save();

    return NextResponse.json(portfolio);

  } catch (error) {
    console.error('Portfolio PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 });
  }
}

// DELETE /api/portfolio - Delete specific portfolio entries or clear entire profile
export async function DELETE(request: NextRequest) {
  try {
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if request has body
    const requestText = await request.text();
    const hasBody = requestText.trim().length > 0;
    
    await dbConnect();
    
    const portfolio = await Portfolio.findOne({ userId });
    
    if (!portfolio) {
      return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 });
    }

    // If no body, clear entire profile
    if (!hasBody) {
      portfolio.name = '';
      portfolio.bio = '';
      portfolio.education = [];
      portfolio.experience = [];
      portfolio.skills = [];
      portfolio.projects = [];
      portfolio.certifications = [];
      portfolio.achievements = [];
      portfolio.goals = [];
      portfolio.hobbies = [];
      portfolio.contactInfo = {};
      portfolio.preferences = {};
      portfolio.completionPercentage = 0;
      portfolio.lastUpdated = new Date();
      
      await portfolio.save();
      console.log('Entire portfolio cleared for user:', userId);
      
      return NextResponse.json(portfolio);
    }

    // Otherwise, handle specific item deletion
    const { field, index } = JSON.parse(requestText);
    
    // Remove specific item based on field and index
    if (field && index !== undefined) {
      if (Array.isArray(portfolio[field as keyof IPortfolio])) {
        (portfolio[field as keyof IPortfolio] as any[]).splice(index, 1);
        
        // Recalculate completion percentage after deletion
        const profileData = {
          name: portfolio.name,
          title: portfolio.title,
          bio: portfolio.bio,
          location: portfolio.location,
          availability: portfolio.availability,
          education: portfolio.education,
          experience: portfolio.experience,
          skills: portfolio.skills,
          projects: portfolio.projects,
          certifications: portfolio.certifications,
          achievements: portfolio.achievements,
          goals: portfolio.goals,
          hobbies: portfolio.hobbies,
          contactInfo: portfolio.contactInfo,
          portfolioSamples: portfolio.portfolioSamples,
          workPreferences: portfolio.workPreferences,
          endorsements: portfolio.endorsements,
          onlineCourses: portfolio.onlineCourses,
          testimonials: portfolio.testimonials
        };
        
        const analysis = analyzeProfileCompletion(profileData);
        portfolio.completionPercentage = analysis.completionPercentage;
        portfolio.lastUpdated = new Date();
        
        await portfolio.save();
        
        console.log('Portfolio item deleted for user:', userId, 'New completion:', analysis.completionPercentage + '%');
      }
    }

    return NextResponse.json(portfolio);

  } catch (error) {
    console.error('Portfolio DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete portfolio item' }, { status: 500 });
  }
}
