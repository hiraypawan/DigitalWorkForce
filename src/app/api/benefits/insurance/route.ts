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

    const { insuranceType, premium, coverage } = await request.json();

    // Update user's insurance preferences
    await User.findByIdAndUpdate(decoded.userId, {
      $set: {
        'benefits.insurance.type': insuranceType,
        'benefits.insurance.premium': premium,
        'benefits.insurance.coverage': coverage,
        'benefits.insurance.isActive': true,
        'benefits.insurance.startDate': new Date(),
      }
    });

    return NextResponse.json({ 
      message: 'Insurance plan activated successfully',
      success: true 
    });
  } catch (error) {
    console.error('Insurance activation error:', error);
    return NextResponse.json(
      { error: 'Failed to activate insurance plan' },
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

    const user = await User.findById(decoded.userId).select('benefits.insurance');
    
    return NextResponse.json({ 
      insurance: user?.benefits?.insurance || null
    });
  } catch (error) {
    console.error('Insurance fetch error:', error);
    return NextResponse.json(
      { error: 'Failed to fetch insurance information' },
      { status: 500 }
    );
  }
}
