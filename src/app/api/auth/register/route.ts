import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { RegisterSchema } from '@/lib/validators';
import { signToken } from '@/lib/auth';
import { isValidUsername, isValidPassword, sanitizeText, formatDisplayName } from '@/lib/utils';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate request data
    const validatedData = RegisterSchema.parse(body);
    
    // Additional validation for special characters
    if (!isValidUsername(validatedData.name)) {
      return Response.json(
        { error: 'Name contains invalid characters. Use letters, numbers, underscore, hyphen, or dot only.' },
        { status: 400 }
      );
    }
    
    const passwordValidation = isValidPassword(validatedData.password);
    if (!passwordValidation.isValid) {
      return Response.json(
        { error: 'Password validation failed', details: passwordValidation.errors },
        { status: 400 }
      );
    }
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: validatedData.email });
    if (existingUser) {
      return Response.json(
        { error: 'User with this email already exists' },
        { status: 400 }
      );
    }
    
    // Create new user
    const user = new User({
      ...validatedData,
      passwordHash: validatedData.password,
    });
    // Remove password field since we're using passwordHash
    delete (user as any).password;
    await user.save();
    
    // Generate JWT token
    const token = signToken({ userId: user._id, email: user.email, role: user.role });
    
    return Response.json({
      message: 'Registration successful',
      token,
      user: user.getPublicProfile(),
      requiresOnboarding: true, // Trigger AI chatbot onboarding
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Registration error:', error);
    console.error('Error stack:', error.stack);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    
    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    // Check for MongoDB connection errors
    if (error.name === 'MongooseError' || error.name === 'MongoError') {
      return Response.json(
        { error: 'Database connection failed', details: error.message },
        { status: 503 }
      );
    }
    
    // Check for validation errors
    if (error.name === 'ValidationError') {
      return Response.json(
        { error: 'Validation failed', details: error.message },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error', details: error.message },
      { status: 500 }
    );
  }
}
