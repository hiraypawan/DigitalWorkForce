import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import Job from '@/models/Job';
import User from '@/models/User';
import Task from '@/models/Task';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';

// POST /api/jobs/assign - Auto-assign job tasks to suitable workers
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authenticate user
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'company') {
      return Response.json(
        { error: 'Unauthorized. Only companies can assign jobs.' },
        { status: 401 }
      );
    }
    
    const { jobId } = await request.json();
    
    if (!jobId) {
      return Response.json(
        { error: 'Job ID is required' },
        { status: 400 }
      );
    }
    
    // Find the job
    const job = await Job.findById(jobId).populate('tasks');
    if (!job) {
      return Response.json(
        { error: 'Job not found' },
        { status: 404 }
      );
    }
    
    // Check if user owns this job
    if (job.postedBy.toString() !== user.userId) {
      return Response.json(
        { error: 'You can only assign your own jobs' },
        { status: 403 }
      );
    }
    
    // Find suitable workers based on skills match
    const suitableWorkers = await User.find({
      role: 'worker',
      available: true,
      skills: { $in: job.skills },
    }).sort({ rating: -1, completedTasks: -1 });
    
    if (suitableWorkers.length === 0) {
      return Response.json(
        { error: 'No suitable workers found for this job' },
        { status: 404 }
      );
    }
    
    // Get all tasks for this job
    const jobTasks = await Task.find({ jobId: job._id, status: 'pending' });
    
    const assignments = [];
    let workerIndex = 0;
    
    // Simple round-robin assignment of tasks to workers
    for (const task of jobTasks) {
      const assignedWorker = suitableWorkers[workerIndex % suitableWorkers.length];
      
      // Check skill compatibility score
      const skillMatch = task.skills.filter((skill: string) => 
        assignedWorker.skills.includes(skill)
      ).length / task.skills.length;
      
      if (skillMatch >= 0.3) { // At least 30% skill match
        task.assignedTo = assignedWorker._id;
        task.status = 'assigned';
        await task.save();
        
        assignments.push({
          taskId: task._id,
          taskTitle: task.title,
          workerId: assignedWorker._id,
          workerName: assignedWorker.name,
          skillMatch: Math.round(skillMatch * 100) + '%',
        });
        
        workerIndex++;
      }
    }
    
    // Update job status
    job.status = 'in_progress';
    job.selectedWorkers = assignments.map(a => a.workerId);
    await job.save();
    
    return Response.json({
      message: 'Job tasks assigned successfully',
      jobId: job._id,
      assignmentsCount: assignments.length,
      assignments,
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Job assignment error:', error);
    return Response.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
