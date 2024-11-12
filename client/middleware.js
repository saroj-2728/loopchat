import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get('user');
  const isLoggedIn = Boolean(userCookie);

  // Public paths that everyone can access
  const publicPaths = ['/', '/about', '/contact', '/login', '/register'];
  if (publicPaths.includes(pathname)) {
    return NextResponse.next();
  }

  // If logged in, allow access to any page
  if (isLoggedIn) {
    return NextResponse.next();
  }

  // If not logged in, redirect to /login with query string for feedback
  if (!isLoggedIn) {
    return NextResponse.redirect(new URL('/login?redirected=true', request.url));
  }
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
