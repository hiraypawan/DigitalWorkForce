import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/company',
  '/api/users',
  '/api/jobs',
  '/api/payments',
];

// Routes that should redirect authenticated users
const authRoutes = [
  '/auth/login',
  '/auth/register',
];

// Routes that don't require full profile completion
const onboardingExemptRoutes = [
  '/onboarding',
  '/auth/login',
  '/auth/register',
  '/api/auth',
  '/api/users/chatbot',
  '/api/chat',
];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Skip middleware for static files and API auth routes
  if (pathname.startsWith('/api/auth/') || 
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico')) {
    return NextResponse.next();
  }
  
  // Check if the current path is a protected route
  const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
  
  // Get token from NextAuth
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });
  
  // If accessing protected route without valid token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing auth routes while authenticated
  if (isAuthRoute && token) {
    // Redirect to onboarding if profile is not complete, otherwise to dashboard
    const redirectUrl = '/onboarding';
    return NextResponse.redirect(new URL(redirectUrl, request.url));
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
