import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    return NextResponse.json({
      session: session,
      hasSession: !!session,
      user: session?.user || null,
      sessionStatus: session ? 'authenticated' : 'unauthenticated',
      timestamp: new Date().toISOString(),
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
        nextauthSecretPresent: !!process.env.NEXTAUTH_SECRET,
        mongodbUriPresent: !!process.env.MONGODB_URI,
      }
    });
  } catch (error) {
    console.error('Debug session error:', error);
    return NextResponse.json({
      error: 'Failed to get session',
      details: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString(),
    }, { status: 500 });
  }
}
