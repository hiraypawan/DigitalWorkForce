import { NextRequest } from 'next/server';
import dbConnect from '@/lib/db';
import User from '@/models/User';
import Task from '@/models/Task';
import { getTokenFromRequest, getUserFromToken } from '@/lib/auth';
import { PaymentCreateSchema } from '@/lib/validators';

// POST /api/payments/create - Create payment for completed task
export async function POST(request: NextRequest) {
  try {
    await dbConnect();
    
    // Authenticate user
    const token = getTokenFromRequest(request);
    const user = getUserFromToken(token);
    
    if (!user || user.role !== 'company') {
      return Response.json(
        { error: 'Unauthorized. Only companies can create payments.' },
        { status: 401 }
      );
    }
    
    const body = await request.json();
    
    // Validate request data
    const validatedData = PaymentCreateSchema.parse(body);
    
    // Find the task
    const task = await Task.findById(validatedData.taskId)
      .populate('jobId')
      .populate('assignedTo');
      
    if (!task) {
      return Response.json(
        { error: 'Task not found' },
        { status: 404 }
      );
    }
    
    // Verify task is completed
    if (task.status !== 'completed') {
      return Response.json(
        { error: 'Task must be completed before payment can be processed' },
        { status: 400 }
      );
    }
    
    // Find the worker
    const worker = await User.findById(validatedData.workerId);
    if (!worker || worker.role !== 'worker') {
      return Response.json(
        { error: 'Worker not found' },
        { status: 404 }
      );
    }
    
    // Create payment intent with selected payment provider
    let paymentIntent;
    
    if (validatedData.method === 'razorpay') {
      paymentIntent = await createRazorpayPayment(validatedData.amount, {
        taskId: validatedData.taskId,
        workerId: validatedData.workerId,
        workerEmail: worker.email,
        description: `Payment for task: ${task.title}`,
      });
    } else if (validatedData.method === 'stripe') {
      paymentIntent = await createStripePayment(validatedData.amount, {
        taskId: validatedData.taskId,
        workerId: validatedData.workerId,
        workerEmail: worker.email,
        description: `Payment for task: ${task.title}`,
      });
    }
    
    // Update worker earnings (mock for now - in production, this would happen after payment confirmation)
    worker.totalEarnings += validatedData.amount;
    await worker.save();
    
    // Update task payment status
    task.status = 'reviewed';
    await task.save();
    
    return Response.json({
      message: 'Payment processed successfully',
      paymentId: paymentIntent?.id || 'mock-payment-id',
      amount: validatedData.amount,
      worker: {
        id: worker._id,
        name: worker.name,
        email: worker.email,
      },
      task: {
        id: task._id,
        title: task.title,
      },
    }, { status: 200 });
    
  } catch (error: any) {
    console.error('Payment creation error:', error);
    
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

// Placeholder functions for payment providers
// In production, implement actual Razorpay/Stripe integration
async function createRazorpayPayment(amount: number, metadata: any) {
  // TODO: Integrate with Razorpay API
  // const Razorpay = require('razorpay');
  // const instance = new Razorpay({ key_id: process.env.RAZORPAY_KEY_ID, key_secret: process.env.RAZORPAY_KEY_SECRET });
  // return await instance.orders.create({ amount: amount * 100, currency: 'INR', receipt: metadata.taskId });
  
  return {
    id: 'razorpay_mock_' + Date.now(),
    amount: amount * 100, // Razorpay uses paise
    currency: 'INR',
    status: 'created'
  };
}

async function createStripePayment(amount: number, metadata: any) {
  // TODO: Integrate with Stripe API
  // const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
  // return await stripe.paymentIntents.create({ amount: amount * 100, currency: 'inr', metadata });
  
  return {
    id: 'stripe_mock_' + Date.now(),
    amount: amount * 100, // Stripe uses smallest currency unit
    currency: 'inr',
    status: 'requires_payment_method'
  };
}
