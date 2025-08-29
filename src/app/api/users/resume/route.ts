import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';

// POST /api/users/resume - Upload resume file
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
    
    const formData = await request.formData();
    const file = formData.get('resume') as File;
    
    if (!file) {
      return Response.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }
    
    // Validate file type and size
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      return Response.json(
        { error: 'Invalid file type. Only PDF and Word documents are allowed.' },
        { status: 400 }
      );
    }
    
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return Response.json(
        { error: 'File size too large. Maximum size is 5MB.' },
        { status: 400 }
      );
    }
    
    // Create upload directory if it doesn't exist
    const uploadDir = join(process.cwd(), 'public', 'uploads', 'resumes');
    try {
      await mkdir(uploadDir, { recursive: true });
    } catch (error) {
      // Directory might already exist
    }
    
    // Generate unique filename
    const timestamp = Date.now();
    const fileExtension = file.name.split('.').pop();
    const fileName = `${user.userId}_${timestamp}.${fileExtension}`;
    const filePath = join(uploadDir, fileName);
    
    // Save file
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    await writeFile(filePath, buffer);
    
    // Update user profile with resume URL
    const resumeUrl = `/uploads/resumes/${fileName}`;
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { resumeUrl },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      message: 'Resume uploaded successfully',
      resumeUrl,
      user: updatedUser.getPublicProfile(),
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Resume upload error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE /api/users/resume - Delete resume file
export async function DELETE(request: NextRequest) {
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
    
    // Update user profile to remove resume URL
    const updatedUser = await User.findByIdAndUpdate(
      user.userId,
      { $unset: { resumeUrl: 1 } },
      { new: true, runValidators: true }
    );
    
    if (!updatedUser) {
      return Response.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }
    
    return Response.json({
      message: 'Resume removed successfully',
      user: updatedUser.getPublicProfile(),
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Resume delete error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
