import { NextRequest } from 'next/server';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';
import { RegisterSchema } from '@/lib/validators';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    const body = await request.json();
    
    // Validate request data
    const validatedData = RegisterSchema.parse(body);
    
    // Basic name validation
    if (!validatedData.name || validatedData.name.trim().length < 2) {
      return Response.json(
        { error: 'Name must be at least 2 characters long' },
        { status: 400 }
      );
    }
    
    // Basic password validation
    if (!validatedData.password || validatedData.password.length < 6) {
      return Response.json(
        { error: 'Password must be at least 6 characters long' },
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
    
    // Hash password
    const hashedPassword = await bcrypt.hash(validatedData.password, 12);
    
    // Create new user
    const user = new User({
      name: validatedData.name.trim(),
      email: validatedData.email.toLowerCase().trim(),
      passwordHash: hashedPassword,
      role: validatedData.role || 'worker',
      profile: {
        about: '',
        skills: [],
        experience: [],
        projects: []
      },
      portfolioLinks: [],
      resumeUrl: '',
    });
    
    await user.save();
    
    return Response.json({
      message: 'Registration successful',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
      },
      requiresOnboarding: true,
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
