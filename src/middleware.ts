import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

// Routes that require authentication
const protectedRoutes = [
  '/dashboard',
  '/company',
  '/onboarding', // Re-enabled after fixing component issues
  '/api/users',
  '/api/jobs',
  '/api/payments',
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
  
  console.log(`🔧 Middleware called for: ${pathname}`);
  
  // Skip middleware for static files, API auth routes, debug routes, and our troubleshooting pages
  if (pathname.startsWith('/api/auth/') || 
      pathname.startsWith('/api/debug/') ||
      pathname.startsWith('/api/portfolio') ||
      pathname.startsWith('/api/chat') ||
      pathname.startsWith('/_next/') || 
      pathname.startsWith('/favicon.ico') ||
      pathname.startsWith('/debug-') ||
      pathname.includes('simple-fix') ||
      pathname.includes('test')) {
    console.log(`🔧 Skipping middleware for: ${pathname}`);
    return NextResponse.next();
  }
  
  try {
    // Check if the current path is a protected route
    const isProtectedRoute = protectedRoutes.some(route => pathname.startsWith(route));
    const isAuthRoute = authRoutes.some(route => pathname.startsWith(route));
    
    // Get token from NextAuth - wrap in try-catch
    let token = null;
    try {
      token = await getToken({ 
        req: request, 
        secret: process.env.NEXTAUTH_SECRET 
      });
      console.log('Middleware - Token found for path:', pathname, '- Token present:', !!token);
    } catch (error) {
      console.error('Error getting token in middleware:', error);
      // If token fetch fails, treat as unauthenticated
      token = null;
    }
    
    // Additional debug: Check for session cookies
    const sessionToken = request.cookies.get('next-auth.session-token');
    const csrfToken = request.cookies.get('next-auth.csrf-token');
    console.log('Middleware - Session cookie present:', !!sessionToken);
    console.log('Middleware - CSRF cookie present:', !!csrfToken);
    
    const isOnboardingRoute = pathname.startsWith('/onboarding');
    const isPublicRoute = publicRoutes.some(route => pathname === route);
    
    // If accessing protected route without valid token
    if (isProtectedRoute && !token) {
      console.log('Middleware - Redirecting to login for protected route:', pathname);
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
  } catch (error) {
    console.error('Middleware error:', error);
    // If middleware fails entirely, let the request through
    return NextResponse.next();
  }
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
