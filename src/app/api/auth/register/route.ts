import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { RegisterSchema } from '@/lib/validators';
import { signToken } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate request data
    const validatedData = RegisterSchema.parse(body);
    
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
    
    if (error.name === 'ZodError') {
      return Response.json(
        { error: 'Invalid input data', details: error.errors },
        { status: 400 }
      );
    }
    
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
