import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import Task from '@/models/Task';

export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    const authHeader = request.headers.get('authorization');
    if (!authHeader) {
      return NextResponse.json({ error: 'Authorization required' }, { status: 401 });
    }

    const token = authHeader.replace('Bearer ', '');
    const decoded = verifyToken(token);
    
    if (!decoded) {
      return NextResponse.json({ error: 'Invalid token' }, { status: 401 });
    }

    const { taskId, amount } = await request.json();

    // Update task status and handle payment release
    const task = await Task.findById(taskId);
    
    if (!task) {
      return NextResponse.json({ error: 'Task not found' }, { status: 404 });
    }

    // Update task status to completed and released
    task.status = 'completed';
    task.completedDate = new Date();
    await task.save();
    
    return NextResponse.json({ 
      message: 'Payment released successfully',
      success: true,
      taskId: task._id
    });
  } catch (error) {
    console.error('Payment release error:', error);
    return NextResponse.json(
      { error: 'Failed to release payment' },
      { status: 500 }
    );
  }
}
