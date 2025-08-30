import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { authOptions } from '@/lib/auth-config';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  try {
    console.log('=== AUTH DEBUG API CALLED ===');
    
    // Get headers
    const headers = Object.fromEntries(request.headers.entries());
    console.log('Request headers:', headers);
    
    // Check cookies
    const cookies = request.cookies.getAll();
    console.log('Request cookies:', cookies);
    
    // Try to get session
    const session = await getServerSession(authOptions);
    console.log('Server session:', session);
    
    // Check specific NextAuth cookies
    const sessionToken = request.cookies.get('next-auth.session-token');
    const csrfToken = request.cookies.get('next-auth.csrf-token');
    
    console.log('NextAuth session token:', sessionToken);
    console.log('NextAuth CSRF token:', csrfToken);
    
    const debugInfo = {
      session: session,
      sessionFound: !!session,
      userId: session?.user?.id,
      userEmail: session?.user?.email,
      headers: {
        authorization: headers.authorization,
        cookie: headers.cookie,
        'user-agent': headers['user-agent'],
        referer: headers.referer,
        origin: headers.origin,
      },
      cookies: {
        all: cookies,
        sessionToken: sessionToken?.value,
        csrfToken: csrfToken?.value,
      },
      environment: {
        nodeEnv: process.env.NODE_ENV,
        nextauthUrl: process.env.NEXTAUTH_URL,
        nextauthSecret: process.env.NEXTAUTH_SECRET ? 'Set' : 'Not set',
        mongoUri: process.env.MONGODB_URI ? 'Set' : 'Not set',
      },
      timestamp: new Date().toISOString(),
    };
    
    console.log('Debug info compiled:', debugInfo);
    
    return NextResponse.json(debugInfo, { status: 200 });
    
  } catch (error) {
    console.error('Auth debug error:', error);
    return NextResponse.json({
      error: 'Debug failed',
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
    }, { status: 500 });
  }
}
