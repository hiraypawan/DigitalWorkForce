import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '../../auth/[...nextauth]/route';
import { dbConnect } from '@/lib/mongodb';
import User from '@/models/User';

// GET /api/users/profile - Fetch user profile
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    await dbConnect();
    
    const user = await User.findById(session.user.id).select('-passwordHash');
    
    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Ensure profile structure exists
    if (!user.profile) {
      user.profile = {
        about: '',
        skills: [],
        experience: [],
        projects: []
      };
      await user.save();
    }

    return NextResponse.json({
      profile: user.profile,
      name: user.name,
      email: user.email,
      portfolioLinks: user.portfolioLinks || [],
      profilePicture: user.profilePicture || user.image || '',
      role: user.role,
      rating: user.rating,
      completedTasks: user.completedTasks,
    });

  } catch (error) {
    console.error('Profile GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch profile' }, { status: 500 });
  }
}

// PATCH /api/users/profile - Update user profile
export async function PATCH(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const updateData = await request.json();
    
    const sanitizedUpdate: any = {};

    // Handle profile updates
    if (updateData.profile) {
      sanitizedUpdate.profile = {};
      
      if (updateData.profile.about !== undefined) {
        sanitizedUpdate.profile.about = updateData.profile.about;
      }
      if (updateData.profile.skills !== undefined) {
        sanitizedUpdate.profile.skills = Array.isArray(updateData.profile.skills) 
          ? updateData.profile.skills.filter((s: any) => typeof s === 'string' && s.trim())
          : [];
      }
      if (updateData.profile.experience !== undefined) {
        sanitizedUpdate.profile.experience = Array.isArray(updateData.profile.experience)
          ? updateData.profile.experience.filter((e: any) => typeof e === 'string' && e.trim())
          : [];
      }
      if (updateData.profile.projects !== undefined) {
        sanitizedUpdate.profile.projects = Array.isArray(updateData.profile.projects)
          ? updateData.profile.projects.filter((p: any) => typeof p === 'string' && p.trim())
          : [];
      }
    }

    // Handle other fields
    if (updateData.name !== undefined) {
      sanitizedUpdate.name = updateData.name;
    }
    if (updateData.portfolioLinks !== undefined) {
      sanitizedUpdate.portfolioLinks = Array.isArray(updateData.portfolioLinks)
        ? updateData.portfolioLinks.filter((link: any) => {
            try {
              new URL(link);
              return true;
            } catch {
              return false;
            }
          })
        : [];
    }
    if (updateData.profilePicture !== undefined) {
      sanitizedUpdate.profilePicture = updateData.profilePicture;
    }

    await dbConnect();
    
    const updatedUser = await User.findByIdAndUpdate(
      session.user.id,
      sanitizedUpdate,
      { new: true, runValidators: true }
    ).select('-passwordHash');

    if (!updatedUser) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    return NextResponse.json({
      profile: updatedUser.profile,
      name: updatedUser.name,
      email: updatedUser.email,
      portfolioLinks: updatedUser.portfolioLinks || [],
      profilePicture: updatedUser.profilePicture || updatedUser.image || '',
      role: updatedUser.role,
      rating: updatedUser.rating,
      completedTasks: updatedUser.completedTasks,
    });

  } catch (error) {
    console.error('Profile PATCH error:', error);
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
}
