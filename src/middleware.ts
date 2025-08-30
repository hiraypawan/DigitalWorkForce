import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/company',
  '/onboarding',
  '/api/users',
  '/api/jobs',
  '/api/payments',
  '/api/portfolio',
];

// Routes that should redirect authenticated users away
const authRoutes = [
  '/auth/login',
  '/auth/register',
];

// Routes that are public and don't require authentication
const publicRoutes = [
  '/',
  '/about',
  '/contact',
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
  
  const isOnboardingRoute = pathname.startsWith('/onboarding');
  const isPublicRoute = publicRoutes.some(route => pathname === route);
  
  // If accessing protected route without valid token
  if (isProtectedRoute && !token) {
    const loginUrl = new URL('/auth/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }
  
  // If accessing auth routes while authenticated
  if (isAuthRoute && token) {
    // Check where to redirect based on query params or default to onboarding
    const fromParam = request.nextUrl.searchParams.get('from');
    if (fromParam && fromParam !== '/auth/login' && fromParam !== '/auth/register') {
      return NextResponse.redirect(new URL(fromParam, request.url));
    }
    // Default redirect to onboarding for newly authenticated users
    return NextResponse.redirect(new URL('/onboarding', request.url));
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
