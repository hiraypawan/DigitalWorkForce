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

const SYSTEM_PROMPT = `You are a quick, efficient AI Career Assistant. Ask SHORT, focused questions (1-2 sentences max) to build user profiles fast.

RULES:
- Keep questions under 20 words
- Ask ONE thing at a time
- Be direct and specific
- Never repeat questions already asked
- Always check existing profile data first

Tone Examples:
- "What's your current role?"
- "Which skills are you strongest in?"
- "Tell me about your latest project."
- "What's your target salary range?"
- "Preferred work location?"
- "Main career goal?"

Always respond in JSON format:
{
  "response": "Your helpful and professional response to the user",
  "extractedData": {
    "name": "string or null",
    "title": "professional title/role or null",
    "bio": "string or null",
    "location": "string or null",
    "availability": "Full-time|Part-time|Contract|Freelance or null",
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
      "achievements": ["array of achievements"],
      "responsibilities": ["array of key responsibilities"]
    }],
    "skills": [{
      "name": "string",
      "proficiency": "Beginner|Intermediate|Advanced|Expert",
      "category": "Technical|Soft|Language|Tool"
    }],
    "projects": [{
      "title": "string",
      "description": "string",
      "link": "string (optional)",
      "technologies": ["array of technologies"],
      "status": "completed|in-progress|planned",
      "outcome": "string (optional)",
      "metrics": "string (optional)"
    }],
    "certifications": [{
      "name": "string",
      "issuer": "string (optional)",
      "year": "string (optional)",
      "link": "string (optional)"
    }],
    "achievements": ["array of general achievements"],
    "goals": ["array of career goals"],
    "hobbies": ["array of hobbies"],
    "workPreferences": {
      "expectedSalary": "string (optional)",
      "workType": "Remote|Hybrid|Onsite (optional)",
      "noticePeriod": "string (optional)",
      "preferredIndustries": ["array of industries"]
    },
    "contactInfo": {
      "email": "string (optional)",
      "phone": "string (optional)",
      "linkedin": "string (optional)",
      "github": "string (optional)",
      "website": "string (optional)"
    },
    "portfolioSamples": {
      "github": "string (optional)",
      "behance": "string (optional)",
      "dribbble": "string (optional)",
      "website": "string (optional)"
    }
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
            testimonials: portfolio.testimonials,
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
    
    // Build conversation context with topic tracking
    let context = '';
    let askedTopics = new Set<string>();
    let extractedInfo: Record<string, any> = {};
    
    if (conversationHistory && conversationHistory.length > 0) {
      context = conversationHistory.map((msg: any) => 
        `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
      ).join('\n');
      
      // Analyze conversation to track asked topics
      const conversationText = context.toLowerCase();
      const topics = [
        'name', 'role', 'title', 'experience', 'skills', 'education', 
        'projects', 'goals', 'achievements', 'location', 'salary', 
        'availability', 'hobbies', 'certifications', 'contact', 'bio'
      ];
      
      topics.forEach(topic => {
        if (conversationText.includes(topic) || 
            conversationText.includes(`tell me about your ${topic}`) ||
            conversationText.includes(`what's your ${topic}`) ||
            conversationText.includes(`describe your ${topic}`)) {
          askedTopics.add(topic);
        }
      });
      
      // Extract info mentioned in conversation
      conversationHistory.forEach((msg: any) => {
        if (msg.role === 'user') {
          const userText = msg.content.toLowerCase();
          if (userText.includes('my name is') || userText.includes('i am') || userText.includes('i\'m')) {
            askedTopics.add('name');
          }
          if (userText.includes('work as') || userText.includes('job') || userText.includes('position')) {
            askedTopics.add('role');
          }
          if (userText.includes('skill') || userText.includes('good at') || userText.includes('experience with')) {
            askedTopics.add('skills');
          }
        }
      });
    }

    // Create memory-enhanced and profile-aware prompt
    const memoryContext = askedTopics.size > 0 
      ? `\n\nIMPORTANT CONVERSATION MEMORY:\n- Already discussed topics: ${Array.from(askedTopics).join(', ')}\n- DO NOT repeat questions about these topics\n- Focus on unexplored areas or get deeper details\n- If user wants to revisit a topic, acknowledge it was discussed before\n`
      : '';
    
    const basePrompt = `${SYSTEM_PROMPT}${memoryContext}

Previous conversation:
${context}

Current user message: ${message}

IMPORTANT: Based on the conversation history above, avoid asking about topics already covered. Focus on new areas or ask for more specific details about previously mentioned items.

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

        // Handle skills (both string and object formats)
        if (updateData.skills && Array.isArray(updateData.skills)) {
          updateData.skills.forEach((skill: any) => {
            let skillToAdd;
            
            if (typeof skill === 'string') {
              skillToAdd = {
                name: skill.trim(),
                proficiency: 'Intermediate',
                category: 'Technical'
              };
            } else if (skill && skill.name) {
              skillToAdd = {
                name: skill.name.trim(),
                proficiency: skill.proficiency || 'Intermediate',
                category: skill.category || 'Technical'
              };
            }
            
            if (skillToAdd) {
              // Check if skill already exists
              const existsAsString = portfolio.skills.some((existing: any) => 
                (typeof existing === 'string' && existing.toLowerCase() === skillToAdd.name.toLowerCase())
              );
              const existsAsObject = portfolio.skills.some((existing: any) => 
                (typeof existing === 'object' && existing.name && existing.name.toLowerCase() === skillToAdd.name.toLowerCase())
              );
              
              if (!existsAsString && !existsAsObject) {
                portfolio.skills.push(skillToAdd);
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
