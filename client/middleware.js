import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;
  const userCookie = request.cookies.get('user');
  const isLoggedIn = userCookie !== undefined;

  let username;
  if (isLoggedIn) {
    const user = JSON.parse(userCookie.value);
    username = user.username;
  }

  // Allow access to login, register, about, contact and home page for everyone
  if (
    pathname === '/login' ||
    pathname === '/register' ||
    pathname === '/' ||
    pathname === '/about' ||
    pathname === '/contact' ||
    (isLoggedIn && (pathname === '/home'))
  ) {
    return NextResponse.next();
  }

  const userPathname = pathname.split('/')[1];
  if (isLoggedIn && username === userPathname) {
    return NextResponse.next();
  }

  if (isLoggedIn && userPathname) {
    return NextResponse.redirect(new URL('/home', request.url));
  }

  return NextResponse.redirect(new URL('/login', request.url));
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
