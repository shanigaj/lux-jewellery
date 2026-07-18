import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes are protected
const protectedRoutes = ["/account", "/checkout", "/admin"];
const authRoutes = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for HttpOnly cookie (we can't read the value, but we can check if it exists)
  // In a real app, you might decode the JWT or verify a signature, but Next.js edge runtime
  // limits Node.js modules like jsonwebtoken. Checking presence is often enough for UI routing,
  // since the backend will enforce actual security.
  const hasToken = request.cookies.has("jwt");

  const isProtectedRoute = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => pathname.startsWith(route));

  if (isProtectedRoute && !hasToken) {
    // Redirect to login if accessing protected route without token
    const url = new URL("/login", request.url);
    url.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(url);
  }

  if (isAuthRoute && hasToken) {
    // Redirect to account if accessing auth routes while logged in
    return NextResponse.redirect(new URL("/account", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
