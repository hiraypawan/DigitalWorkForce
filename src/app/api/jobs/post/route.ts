import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import { JobPostSchema } from '@/lib/validators';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { TaskSplitter } from '@/lib/task-splitter';
import Task from '@/models/Task';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authenticate user
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'company') {
      return Response.json(
        { error: 'Unauthorized. Only companies can post jobs.' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request data
    const validatedData = JobPostSchema.parse(body);
    
    // Create new job
    const job = new Job({
      ...validatedData,
      postedBy: user.userId,
      deadline: new Date(validatedData.deadline),
    });
    
    await job.save();
    
    // Auto-split job into micro-tasks
    const microTasks = TaskSplitter.splitJob({
      id: job._id.toString(),
      title: job.title,
      description: job.description,
      requirements: job.requirements,
      budget: job.budget,
      skills: job.skills,
      complexity: job.complexity,
    });
    
    // Create tasks in database
    const createdTasks = [];
    for (const taskData of microTasks) {
      const task = new Task({
        title: taskData.title,
        description: taskData.description,
        jobId: job._id,
        estimatedHours: taskData.estimatedHours,
        budget: taskData.budget,
        skills: taskData.skills,
        priority: taskData.priority,
        deadline: job.deadline,
        deliverables: [],
        dependencies: [],
      });
      
      await task.save();
      createdTasks.push(task._id);
    }
    
    // Update job with created tasks
    job.tasks = createdTasks;
    await job.save();
    
    return Response.json({
      message: 'Job posted and split into micro-tasks successfully',
      job: job,
      tasksCreated: createdTasks.length,
    }, { status: 201 });
    
  } catch (error: any) {
    console.error('Job posting error:', error);
    
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
