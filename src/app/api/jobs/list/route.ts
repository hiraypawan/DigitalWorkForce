import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import Task from '@/models/Task';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';

// GET /api/jobs/list - List jobs and tasks for workers
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
    
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const skills = searchParams.get('skills')?.split(',') || [];
    const status = searchParams.get('status') || undefined;
    
    if (user.role === 'worker') {
      // For workers - show tasks assigned to them or available tasks
      const query: any = {};
      
      if (status === 'assigned') {
        query.assignedTo = user.userId;
        query.status = { $in: ['assigned', 'in_progress'] };
      } else if (status === 'available') {
        query.assignedTo = { $exists: false };
        query.status = 'pending';
        if (skills.length > 0) {
          query.skills = { $in: skills };
        }
      } else {
        // Default - show both assigned and available tasks
        query.$or = [
          { assignedTo: user.userId },
          { assignedTo: { $exists: false }, status: 'pending' }
        ];
      }
      
      const tasks = await Task.find(query)
        .populate('jobId', 'title description budget deadline')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      
      const totalTasks = await Task.countDocuments(query);
      
      return Response.json({
        tasks,
        pagination: {
          page,
          limit,
          total: totalTasks,
          pages: Math.ceil(totalTasks / limit),
        },
      }, { status: 200 });
      
    } else if (user.role === 'company') {
      // For companies - show their posted jobs
      const query: any = { postedBy: user.userId };
      
      if (status) {
        query.status = status;
      }
      
      const jobs = await Job.find(query)
        .populate('tasks')
        .populate('selectedWorkers', 'name email rating')
        .sort({ createdAt: -1 })
        .limit(limit)
        .skip((page - 1) * limit);
      
      const totalJobs = await Job.countDocuments(query);
      
      return Response.json({
        jobs,
        pagination: {
          page,
          limit,
          total: totalJobs,
          pages: Math.ceil(totalJobs / limit),
        },
      }, { status: 200 });
    }
    
    return Response.json(
      { error: 'Invalid user role' },
      { status: 400 }
    );
    
  } catch (error: any) {
    console.error('Job listing error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
