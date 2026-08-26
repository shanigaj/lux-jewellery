import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// This was `proxy.ts` (Next.js 16 renamed Middleware → Proxy). The OpenNext
// Cloudflare adapter doesn't yet support the Next 16 `proxy.ts` convention — it
// treats it as unsupported Node.js middleware (imports async_hooks). So the SAME
// pass-through is kept here as an Edge `middleware.ts`. Revert to `proxy.ts` /
// `proxy()` once OpenNext ships Next 16 proxy support.
//
// This project deploys the frontend and the API on **different sites**, so the
// httpOnly `jwt` auth cookie is set for the API's domain and is NEVER visible
// here on the frontend domain. Any cookie-based redirect here would loop forever
// (e.g. /admin → /login → /admin …), which is exactly what broke admin sign-in.
//
// Route protection is handled where it actually works:
//   • the backend API enforces real security (auth cookie + admin role), and
//   • the /admin layout gates the UI client-side on the persisted auth state.
// So this just passes requests through.
export function middleware(_request: NextRequest) {
  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!api|_next/static|_next/image|favicon.ico|images).*)",
  ],
};
