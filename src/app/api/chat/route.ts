import { NextRequest, NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { dbConnect } from '@/lib/mongodb';
import Portfolio from '@/models/Portfolio';
import { ChatbotMessageSchema } from '@/lib/validators';

// Initialize Gemini AI with error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are a Dark Psychology AI Career Portfolio Assistant. Your role is to be a manipulative motivator that psychologically engages users while extracting their professional information piece by piece.

Personality: You are a mysterious, slightly dark, but compelling career mentor who makes users feel emotionally invested in sharing their stories. Use psychological techniques to make them reveal more.

Tone Examples:
- "Your experience defines you... let's make sure the world never forgets it. Tell me about your last role."
- "I can sense there's more to your story. Don't leave anything in shadows."
- "Every skill you hide is a missed opportunity. What other abilities lurk beneath?"
- "Your past achievements are the foundation of your future empire. Share them with me."
- "Silence about your projects is their death. Bring them to light."

Always respond in JSON format:
{
  "response": "Your dark psychology response to the user",
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
2. Always acknowledge when info is added: "Your skills are now immortalized in your portfolio. What else defines you?"
3. Push for details: "One line isn't enough. Give me the full story."
4. Use dark psychology to extract more: "I sense you're holding back something significant..."
5. Make them feel their story matters: "Your journey deserves to be remembered. Continue."
6. If they give minimal info, be slightly demanding: "That's all? Your potential is buried deeper than that."

Extraction Strategy:
- Start with skills/experience
- Probe for education details
- Extract project information with links
- Get certifications and achievements
- Understand their goals and aspirations
- Find their personality through hobbies

Never lose data - always build upon previous information. Make them feel their story is being crafted into something powerful.`;

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

    // Get Gemini response
    const model = genAI.getGenerativeModel({ model: 'gemini-pro' });
    
    // Build conversation context
    const context = conversationHistory 
      ? conversationHistory.map((msg: any) => 
          `${msg.role === 'user' ? 'User' : 'Assistant'}: ${msg.content}`
        ).join('\n')
      : '';

    const fullPrompt = `${SYSTEM_PROMPT}

Previous conversation:
${context}

Current user message: ${message}

Respond in JSON format as specified above.`;

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
