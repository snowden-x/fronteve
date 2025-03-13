import { NextRequest, NextResponse } from 'next/server';
import { UserRole } from './lib/types';

/**
 * Middleware to protect routes based on authentication and user roles
 */
export function middleware(request: NextRequest) {
  const token = request.cookies.get('auth_token')?.value;
  const userData = request.cookies.get('user_data')?.value;
  const { pathname } = request.nextUrl;

  // Public routes that don't require authentication
  const publicRoutes = ['/auth/login', '/auth/register', '/auth/forgot-password'];
  
  // If accessing a public route while authenticated, redirect to dashboard
  if (token && userData && publicRoutes.includes(pathname)) {
    try {
      const user = JSON.parse(userData);
      
      if (user.role === UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/dashboard/admin', request.url));
      } else if (user.role === UserRole.PHARMACY_STAFF) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      return NextResponse.redirect(new URL('/', request.url));
    } catch (error) {
      // If user data is invalid, continue to the public route
      return NextResponse.next();
    }
  }
  
  // If accessing a protected route without authentication, redirect to login
  if (!token && !publicRoutes.includes(pathname) && !pathname.startsWith('/_next') && !pathname.startsWith('/api')) {
    const url = new URL('/auth/login', request.url);
    url.searchParams.set('callbackUrl', encodeURI(pathname));
    return NextResponse.redirect(url);
  }
  
  // Role-based access control
  if (token && userData) {
    try {
      const user = JSON.parse(userData);
      
      // Admin-only routes
      if (pathname.startsWith('/dashboard/admin') && user.role !== UserRole.ADMIN) {
        return NextResponse.redirect(new URL('/dashboard', request.url));
      }
      
      // Staff-only routes
      if (pathname.startsWith('/dashboard') && 
          user.role !== UserRole.ADMIN && 
          user.role !== UserRole.PHARMACY_STAFF) {
        return NextResponse.redirect(new URL('/', request.url));
      }
    } catch (error) {
      // If user data is invalid, redirect to login
      const url = new URL('/auth/login', request.url);
      return NextResponse.redirect(url);
    }
  }
  
  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * 1. /_next (Next.js internals)
     * 2. /static (static files)
     * 3. /favicon.ico, /robots.txt (public files)
     */
    '/((?!_next|static|favicon.ico|robots.txt).*)',
  ],
};
