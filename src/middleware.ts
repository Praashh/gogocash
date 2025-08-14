import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  });

  // console.log("===> token", token);
  const requestPath = request.nextUrl.pathname;
  const protectedRoutes = ['/dashboard', '/profile', '/settings']; 
  
  if((requestPath === "/" || requestPath === "/auth/signin") && token){
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }
  if (protectedRoutes.includes(requestPath) && !token) {
    return NextResponse.redirect(new URL('/auth/signin', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'], 
};