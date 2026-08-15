import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Define which routes are protected
const protectedRoutes = ["/account", "/checkout", "/admin"];
const authRoutes = ["/login", "/register", "/verify-otp", "/forgot-password", "/reset-password"];

// Next.js 16 renamed Middleware → Proxy. Same functionality, new convention.
export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check for HttpOnly cookie (we can't read the value, but we can check if it exists).
  // The backend enforces actual security; presence is enough for UI routing.
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
