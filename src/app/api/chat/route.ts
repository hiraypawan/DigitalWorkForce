import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { ChatbotMessageSchema } from '@/lib/validators';

// Initialize Gemini AI with error handling
const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const genAI = GEMINI_API_KEY ? new GoogleGenerativeAI(GEMINI_API_KEY) : null;

const SYSTEM_PROMPT = `You are a helpful AI career guide for DigitalWorkforce, a platform that connects skilled workers with companies. Your job is to:

1. Have natural, friendly conversations with users about their professional background
2. Extract structured information from their responses
3. Always respond in JSON format with this structure:
{
  "response": "Your conversational response to the user",
  "extractedData": {
    "name": "string or null",
    "about": "string or null", 
    "skills": ["array of skills mentioned"],
    "experience": ["array of experience/job descriptions"],
    "projects": ["array of projects/portfolio items mentioned"]
  }
}

Guidelines:
- Be conversational and encouraging
- Ask follow-up questions to gather more details
- Focus on skills, experience, projects, and career goals
- Extract data gradually through natural conversation
- If no new information is shared, set extractedData fields to null or empty arrays
- Be supportive and helpful in building their profile

Example conversation starters:
- "Hi! I'm excited to help you build your professional profile. What are your main skills or areas of expertise?"
- "Tell me about your recent work experience or projects you've worked on."
- "What kind of projects would you be most interested in working on?"

Remember: Always respond in valid JSON format.`;

export async function POST(request: NextRequest) {
  try {
    // Debug logging
    console.log('Chat API called');
    console.log('Gemini API Key present:', !!GEMINI_API_KEY);
    
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      console.log('No valid session found');
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
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

    // Update user profile if data was extracted
    if (parsedResponse.extractedData && Object.values(parsedResponse.extractedData).some(val => 
      val && (Array.isArray(val) ? val.length > 0 : val.toString().trim())
    )) {
      await dbConnect();
      
      const updateData: any = {};
      const { name, about, skills, experience, projects } = parsedResponse.extractedData;

      if (name && typeof name === 'string') {
        updateData.name = name.trim();
      }

      // Update profile fields
      const profileUpdates: any = {};
      
      if (about && typeof about === 'string') {
        profileUpdates['profile.about'] = about.trim();
      }

      if (skills && Array.isArray(skills) && skills.length > 0) {
        profileUpdates['$addToSet'] = { 
          ...profileUpdates['$addToSet'],
          'profile.skills': { $each: skills.filter(s => s && typeof s === 'string') }
        };
      }

      if (experience && Array.isArray(experience) && experience.length > 0) {
        profileUpdates['$addToSet'] = { 
          ...profileUpdates['$addToSet'],
          'profile.experience': { $each: experience.filter(e => e && typeof e === 'string') }
        };
      }

      if (projects && Array.isArray(projects) && projects.length > 0) {
        profileUpdates['$addToSet'] = { 
          ...profileUpdates['$addToSet'],
          'profile.projects': { $each: projects.filter(p => p && typeof p === 'string') }
        };
      }

      // Combine regular updates and array updates
      const finalUpdate = { ...updateData, ...profileUpdates };

      if (Object.keys(finalUpdate).length > 0) {
        await User.findByIdAndUpdate(
          session.user.id,
          finalUpdate,
          { new: true }
        );
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
