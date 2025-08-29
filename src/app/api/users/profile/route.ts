import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { ProfileUpdateSchema } from '@/lib/validators';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';

// GET /api/users/profile - Get user profile
export async function GET(request: NextRequest) {
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
    
    // Find user profile
    const userProfile = await User.findById(user.userId);
    if (!userProfile) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      user: userProfile.getPublicProfile(),
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Profile fetch error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT /api/users/profile - Update user profile
export async function PUT(request: NextRequest) {
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
    
    // Validate request data
    const validatedData = ProfileUpdateSchema.parse(body);
    
    // Update user profile
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      validatedData,
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      message: 'Profile updated successfully',
      user: updatedUser.getPublicProfile(),
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Profile update error:', error);
    
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
