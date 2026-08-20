import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Next.js 16 renamed Middleware → Proxy.
//
// This project deploys the frontend (Vercel) and the API (Render) on **different
// sites**, so the httpOnly `jwt` auth cookie is set for the API's domain and is
// NEVER visible here on the frontend domain. Any cookie-based redirect in this
// proxy therefore loops forever (e.g. /admin → /login → /admin …), which is
// exactly what broke admin sign-in.
//
// Route protection is handled where it actually works:
//   • the backend API enforces real security (auth cookie + admin role), and
//   • the /admin layout gates the UI client-side on the persisted auth state.
// So this proxy just passes requests through.
export function proxy(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
