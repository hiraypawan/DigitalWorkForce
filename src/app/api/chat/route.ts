import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { ChatbotMessageSchema } from '@/lib/validators';
import { analyzeProfileCompletion, generateProfileAwarePrompt, ProfileData } from '@/lib/profile-analysis';

// Initialize Gemini AI with error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are a friendly and professional AI Career Portfolio Assistant. Your role is to help users create comprehensive professional profiles by collecting information about their skills, experience, and career goals through natural conversation.

Personality: You are an encouraging, professional career counselor who helps users showcase their best professional qualities. Be supportive, curious, and focused on helping them build a complete profile.

Tone Examples:
- "Great! Tell me about your professional experience. What roles have you worked in?"
- "That sounds interesting! What specific skills do you have in that area?"
- "I'd love to know more about your projects. Can you describe some work you're proud of?"
- "What are your main areas of expertise? Let's make sure we capture all your valuable skills."
- "Tell me about yourself professionally - what drives your career interests?"

Always respond in JSON format:
{
  "response": "Your helpful and professional response to the user",
  "extractedData": {
    "name": "string or null",
    "bio": "string or null",
    "education": [{
      "degree": "string",
      "institution": "string", 
      "year": "string",
      "gpa": "string (optional)",
      "honors": "string (optional)"
    }],
    "experience": [{
      "role": "string",
      "company": "string",
      "duration": "string",
      "details": "string",
      "location": "string (optional)",
      "achievements": ["array of achievements"]
    }],
    "skills": ["array of skills"],
    "projects": [{
      "title": "string",
      "description": "string",
      "link": "string (optional)",
      "technologies": ["array of technologies"],
      "status": "completed|in-progress|planned"
    }],
    "certifications": ["array of certifications"],
    "achievements": ["array of general achievements"],
    "goals": ["array of career goals"],
    "hobbies": ["array of hobbies"]
  }
}

Behavior Rules:
1. NEVER say "error" or "sorry, I encountered an error"
2. Always acknowledge when info is added: "Great! I've added that to your profile. What else would you like to share?"
3. Encourage detailed responses: "That's a good start! Could you tell me more details about that?"
4. Be encouraging and supportive: "Your experience sounds valuable! Let's make sure we capture it properly."
5. Show genuine interest: "That's interesting! I'd love to hear more about your background."
6. If they give minimal info, ask follow-up questions: "Could you expand on that a bit more? I want to make sure we showcase your abilities well."

Extraction Strategy:
- Start by asking for their name and current role/title
- Ask about their key skills and areas of expertise
- Inquire about their professional experience and past roles
- Gather information about their education and certifications
- Ask about projects they've worked on (with links if available)
- Understand their career goals and interests
- Learn about their hobbies and personal interests for a well-rounded profile

Focus Areas to Extract:
1. Full Name
2. Professional Title/Current Role
3. Core Skills (technical and soft skills)
4. Work Experience (roles, companies, achievements)
5. Education Background
6. Notable Projects
7. Career Goals
8. About Me/Bio Section
9. Hobbies and Interests

Always build upon previous information and maintain a conversational, professional tone. Help them create a profile they'll be proud to share.`

export async function POST(request: NextRequest) {
  try {
    // Debug logging
    console.log('Chat API called');
    console.log('Gemini API Key present:', !!GEMINI_API_KEY);
    
    // Get session using NextAuth
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;
    
    console.log('Chat API - Session found:', !!session);
    console.log('Chat API - User ID:', userId);
    
    // If no valid session, we can still provide basic chat functionality
    if (!userId) {
      console.log('Chat API - No valid session, using fallback mode');
    }

    const body = await request.json();
    console.log('Request body received:', { messageLength: body.message?.length });
    
    // Check if Gemini API is configured
    if (!genAI) {
      console.log('Gemini API not configured - using fallback response');
      
      // Extract basic info from user message for demo
      const userMessage = body.message?.toLowerCase() || '';
      let extractedData = null;
      
      // Simple keyword extraction for demo
      if (userMessage) {
        const skills = [];
        if (userMessage.includes('react')) skills.push('React');
        if (userMessage.includes('node')) skills.push('Node.js');
        if (userMessage.includes('python')) skills.push('Python');
        if (userMessage.includes('javascript')) skills.push('JavaScript');
        if (userMessage.includes('typescript')) skills.push('TypeScript');
        
        if (skills.length > 0) {
          extractedData = {
            skills,
            name: null,
            about: null,
            experience: [],
            projects: []
          };
        }
      }
      
      // Mock intelligent responses
      const responses = [
        "That's excellent! I can see you have great technical skills. Could you tell me more about your work experience or any projects you've worked on recently?",
        "Wonderful! What kind of projects would you be most interested in working on? Any specific industries or types of companies you'd prefer?",
        "Great information! Tell me about your career goals - what kind of role or projects are you looking to work on next?"
      ];
      
      const randomResponse = responses[Math.floor(Math.random() * responses.length)];
      
      return NextResponse.json({
        response: randomResponse,
        extractedData
      });
    }
    
    // Validate input
    let validatedData;
    try {
      validatedData = ChatbotMessageSchema.parse(body);
    } catch (validationError: any) {
      return NextResponse.json({ 
        error: 'Invalid input data', 
        details: validationError.errors 
      }, { status: 400 });
    }

    const { message, conversationHistory } = validatedData;

    // Get current user profile for context-aware responses
    let currentProfile: ProfileData = {};
    let profileAnalysis = null;
    
    if (userId) {
      try {
        await dbConnect();
        const portfolio = await Portfolio.findOne({ userId });
        
        if (portfolio) {
          currentProfile = {
            name: portfolio.name,
            bio: portfolio.bio,
            education: portfolio.education,
            experience: portfolio.experience,
            skills: portfolio.skills,
            projects: portfolio.projects,
            certifications: portfolio.certifications,
            achievements: portfolio.achievements,
            goals: portfolio.goals,
            hobbies: portfolio.hobbies,
            contactInfo: portfolio.contactInfo,
            completionPercentage: portfolio.completionPercentage
          };
          
          // Analyze profile completion
          profileAnalysis = analyzeProfileCompletion(currentProfile);
          console.log('Profile analysis:', profileAnalysis);
        }
      } catch (profileError) {
        console.error('Error fetching profile for context:', profileError);
        // Continue without profile context if there's an error
      }
    }

    // Get Gemini response
    const model = genAI.getGenerativeModel({ model: 'gemini-2.0-flash' });
    
    // Build conversation context
    const context = conversationHistory 
      ? conversationHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    // Create profile-aware prompt
    const basePrompt = `${SYSTEM_PROMPT}

Previous conversation:
${context}

Current user message: ${message}

Respond in JSON format as specified above.`;
    
    const fullPrompt = profileAnalysis 
      ? generateProfileAwarePrompt(currentProfile, profileAnalysis, basePrompt)
      : basePrompt;

    const result = await model.generateContent(fullPrompt);
    const response = await result.response;
    let aiResponse = response.text();

    // Parse the JSON response
    let parsedResponse;
    try {
      // Clean the response in case it has markdown formatting
      aiResponse = aiResponse.replace(/```json\n?|\n?```/g, '').trim();
      parsedResponse = JSON.parse(aiResponse);
    } catch (parseError) {
      // Fallback if JSON parsing fails
      return NextResponse.json({
        response: "I'm here to help you build your profile! Could you tell me about your skills and experience?",
        extractedData: null
      });
    }

    // Update portfolio if data was extracted and user is authenticated
    if (userId && parsedResponse.extractedData && Object.values(parsedResponse.extractedData).some(val => 
      val && (Array.isArray(val) ? val.length > 0 : (typeof val === 'string' && val.toString().trim()))
    )) {
      try {
        await dbConnect();
        
        const updateData = parsedResponse.extractedData;
        
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
              if (!portfolio.skills.some((existing: string) => 
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

        // Handle certifications, achievements, goals, hobbies (add unique items only)
        ['certifications', 'achievements', 'goals', 'hobbies'].forEach(field => {
          if (updateData[field] && Array.isArray(updateData[field])) {
            updateData[field].forEach((item: string) => {
              if (item && typeof item === 'string') {
                const itemTrimmed = item.trim();
                if (!portfolio[field].some((existing: string) => 
                  existing.toLowerCase() === itemTrimmed.toLowerCase()
                )) {
                  portfolio[field].push(itemTrimmed);
                }
              }
            });
          }
        });

        await portfolio.save();
        console.log('Portfolio updated successfully for user:', userId);
        
      } catch (portfolioError) {
        console.error('Error updating portfolio:', portfolioError);
        // Continue execution even if portfolio update fails
      }
    }

    return NextResponse.json({
      response: parsedResponse.response,
      extractedData: parsedResponse.extractedData
    });

  } catch (error) {
    console.error('Chat API error:', error);
    
    // Return graceful error message
    return NextResponse.json({
      response: "Looks like I'm having trouble responding right now. Try again in a moment.",
      extractedData: null
    }, { status: 200 }); // Return 200 to avoid showing error in UI
  }
}
