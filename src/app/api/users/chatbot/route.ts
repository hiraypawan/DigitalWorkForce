import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { ChatbotConversation } from '@/models/Message';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { ChatbotResponseSchema } from '@/lib/validators';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authenticate user
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user) {
      return Response.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    const { message, context = 'onboarding' } = body;
    
    // Find or create chatbot conversation
    let conversation = await ChatbotConversation.findOne({
      userId: user.userId,
      context,
      status: 'active',
    });
    
    if (!conversation) {
      conversation = new ChatbotConversation({
        userId: user.userId,
        context,
        messages: [],
        extractedData: {
          skills: [],
          hobbies: [],
          experience: [],
          aboutMe: '',
          preferences: {},
        },
      });
    }
    
    // Add user message
    conversation.messages.push({
      role: 'user',
      content: message,
      timestamp: new Date(),
    });
    
    // Generate AI response (placeholder - in real implementation, integrate with OpenAI/Claude)
    const aiResponse = await generateChatbotResponse(message, conversation.extractedData, context);
    
    // Add AI response
    conversation.messages.push({
      role: 'assistant',
      content: aiResponse.response,
      timestamp: new Date(),
      metadata: aiResponse.metadata,
    });
    
    // Update extracted data if AI found relevant information
    if (aiResponse.extractedInfo) {
      conversation.extractedData = {
        ...conversation.extractedData,
        ...aiResponse.extractedInfo,
      };
    }
    
    await conversation.save();
    
    // If onboarding is complete, update user profile
    if (aiResponse.isComplete) {
      await User.findByIdAndUpdate(user.userId, {
        skills: conversation.extractedData.skills,
        hobbies: conversation.extractedData.hobbies,
        experience: conversation.extractedData.experience,
        aboutMe: conversation.extractedData.aboutMe,
      });
      
      conversation.status = 'completed';
      await conversation.save();
    }
    
    return Response.json({
      response: aiResponse.response,
      isComplete: aiResponse.isComplete,
      extractedData: conversation.extractedData,
      conversationId: conversation._id,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Chatbot error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// Placeholder AI response generator - replace with actual AI integration
async function generateChatbotResponse(userMessage: string, extractedData: any, context: string) {
  // This is a placeholder. In a real implementation, you would:
  // 1. Send the message and context to OpenAI/Claude API
  // 2. Extract skills, hobbies, and experience from the response
  // 3. Determine if onboarding is complete
  
  const message = userMessage.toLowerCase();
  let response = "";
  let extractedInfo = {};
  let isComplete = false;
  
  // Simple pattern matching for demo purposes
  if (message.includes('skill') || message.includes('programming') || message.includes('develop')) {
    const skills = extractSkillsFromMessage(userMessage);
    if (skills.length > 0) {
      extractedInfo = { skills: [...(extractedData.skills || []), ...skills] };
      response = `Great! I've noted your skills: ${skills.join(', ')}. What are some of your hobbies or interests outside of work?`;
    } else {
      response = "Tell me more about your technical skills and experience.";
    }
  } else if (message.includes('hobby') || message.includes('interest') || message.includes('enjoy')) {
    const hobbies = extractHobbiesFromMessage(userMessage);
    if (hobbies.length > 0) {
      extractedInfo = { hobbies: [...(extractedData.hobbies || []), ...hobbies] };
      response = `Interesting! Your hobbies: ${hobbies.join(', ')}. Can you tell me about your work experience?`;
    } else {
      response = "What do you like to do in your free time?";
    }
  } else if (message.includes('experience') || message.includes('work') || message.includes('job')) {
    response = "Thank you for sharing your experience! Based on our conversation, I'm building your profile. Is there anything else you'd like to add?";
    
    // Check if we have enough information to complete onboarding
    if ((extractedData.skills?.length || 0) > 0 && (extractedData.hobbies?.length || 0) > 0) {
      isComplete = true;
      response = "Perfect! I've gathered enough information to create your profile. Welcome to DigitalWorkforce! You can now start browsing available tasks.";
    }
  } else {
    response = "Hi! Welcome to DigitalWorkforce! I'm here to help set up your profile. Let's start - what are your main skills or areas of expertise?";
  }
  
  return {
    response,
    extractedInfo,
    isComplete,
    metadata: { context }
  };
}

function extractSkillsFromMessage(message: string): string[] {
  const skillKeywords = [
    'javascript', 'typescript', 'react', 'node.js', 'python', 'java', 'c++', 'c#',
    'html', 'css', 'angular', 'vue', 'mongodb', 'sql', 'postgresql', 'mysql',
    'aws', 'docker', 'kubernetes', 'git', 'figma', 'photoshop', 'illustrator'
  ];
  
  const foundSkills: string[] = [];
  const messageLower = message.toLowerCase();
  
  skillKeywords.forEach(skill => {
    if (messageLower.includes(skill)) {
      foundSkills.push(skill);
    }
  });
  
  return foundSkills;
}

function extractHobbiesFromMessage(message: string): string[] {
  const hobbyKeywords = [
    'reading', 'gaming', 'music', 'sports', 'cooking', 'travel', 'photography',
    'writing', 'drawing', 'painting', 'dancing', 'singing', 'fitness', 'yoga',
    'movies', 'books', 'podcasts', 'hiking', 'cycling', 'swimming'
  ];
  
  const foundHobbies: string[] = [];
  const messageLower = message.toLowerCase();
  
  hobbyKeywords.forEach(hobby => {
    if (messageLower.includes(hobby)) {
      foundHobbies.push(hobby);
    }
  });
  
  return foundHobbies;
}
