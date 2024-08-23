import { NextResponse } from 'next/server'
import { getToken } from 'next-auth/jwt'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET })

  console.log("TOKEN",)
  if (!token) {
    // Check if the user is already on the register page
    if (req.nextUrl.pathname === '/register') {
      return NextResponse.next()
    }
    
    // Redirect to login page if there's no token
    return NextResponse.redirect(new URL('/register', req.url))
  }

  // If token exists, continue to the requested page
  return NextResponse.next()
}

// Specify which routes to apply this middleware
export const config = {
  matcher: [
    '/((?!api/auth|_next/static|_next/image|favicon.ico|register|$).*)',
  ],
}