import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  
  // Skip redirection for login, register, and home page
  if (pathname === '/login' || pathname === '/register' || pathname === '/') {
    return NextResponse.next();
  }

  // Check if user is logged in via cookies
  const hasUserCookie = request.cookies.get('user');

  if (hasUserCookie) {
    return NextResponse.next();
  }

  // If user is not logged in, redirect to login page
  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: '/((?!api|_next/static|_next/image|favicon.ico).*)',  // Protect all routes except static and api files
};
