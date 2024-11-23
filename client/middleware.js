import { NextResponse } from 'next/server';

export function middleware(request) {
    const publicPaths = ['/', '/about', '/contact', '/login', '/register'];
    const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

    const pathname = request.nextUrl.pathname;

    const userCookie = request.cookies.get('userStatus');

    if (!userCookie && !isPublicPath) {
        return NextResponse.redirect(new URL(`/login?continueTo=${pathname}`, request.nextUrl.origin));
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
