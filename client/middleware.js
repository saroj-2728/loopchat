import { auth } from "@/auth"
 
export default auth((req) => {
  const publicPaths = ['/', '/about', '/contact', '/login', '/register'];
  if (!req.auth && !publicPaths.includes(req.nextUrl.pathname)) {
    const newUrl = new URL("/login?redirected=true", req.nextUrl.origin)
    return Response.redirect(newUrl)
  }
})

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};