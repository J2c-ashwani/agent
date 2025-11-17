import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"
import { getToken } from "next-auth/jwt"

export default async function proxy(request: NextRequest) {
  const token = await getToken({ 
    req: request, 
    secret: process.env.NEXTAUTH_SECRET 
  })

  // Admin routes - only admins allowed
  if (request.nextUrl.pathname.startsWith("/admin")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (token.role !== "admin") {
      // Agent trying to access admin - redirect to their dashboard
      return NextResponse.redirect(new URL("/dashboard", request.url))
    }
  }

  // Dashboard routes - only agents allowed
  if (request.nextUrl.pathname.startsWith("/dashboard")) {
    if (!token) {
      return NextResponse.redirect(new URL("/login", request.url))
    }
    if (token.role !== "agent") {
      // Admin trying to access agent dashboard - redirect to admin
      return NextResponse.redirect(new URL("/admin", request.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ["/dashboard/:path*", "/admin/:path*"],
}
