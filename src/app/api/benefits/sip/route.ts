import { NextRequest, NextResponse } from 'next/server';
import dbConnect from '@/lib/db';
import { verifyToken } from '@/lib/auth';
import User from '@/models/User';

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

    const { amount, fundType, duration } = await request.json();

    // Update user's SIP preferences
    await User.findByIdAndUpdate(decoded.userId, {
      $set: {
        'benefits.sip.monthlyAmount': amount,
        'benefits.sip.fundType': fundType,
        'benefits.sip.duration': duration,
        'benefits.sip.isActive': true,
        'benefits.sip.startDate': new Date(),
      }
    });

    return NextResponse.json({ 
      message: 'SIP investment plan activated successfully',
      success: true 
    });
  } catch (error) {
    console.error('SIP activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate SIP plan' },
      { status: 500 }
    );
  }
}

export async function GET(request: NextRequest) {
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

    const user = await User.findById(decoded.userId).select('benefits.sip');
    
    return NextResponse.json({ 
      sip: user?.benefits?.sip || null
    });
  } catch (error) {
    console.error('SIP fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch SIP information' },
      { status: 500 }
    );
  }
}
