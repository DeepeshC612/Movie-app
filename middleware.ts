import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value || 
                request.headers.get('authorization')?.replace('Bearer ', '');
  
  const { pathname } = request.nextUrl;

  // Public routes that don't need authentication
  const publicRoutes = ['/signin', '/register'];
  const apiAuthRoutes = ['/api/auth/login', '/api/auth/register'];
  
  // If user is authenticated and trying to access auth pages, redirect to movies
  if (token && publicRoutes.includes(pathname)) {
    return NextResponse.redirect(new URL('/movies', request.url));
  }

  // Allow API auth routes regardless of authentication status
  if (apiAuthRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Check if current path is public
  if (publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // Redirect to signin if no token and trying to access protected route
  if (!token && (pathname.startsWith('/movies') || pathname === '/')) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|public|uploads).*)',
  ],
};
