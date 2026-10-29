import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Canonicalise the host: permanently redirect www.sparenza.com → sparenza.com
// so search engines consolidate signals on the apex (which every canonical tag
// and the sitemap already use). No effect on localhost or the bare apex.
export function middleware(req: NextRequest) {
  const host = req.headers.get("host") || "";
  if (host.startsWith("www.")) {
    const url = req.nextUrl.clone();
    url.hostname = host.replace(/^www\./, "").split(":")[0];
    return NextResponse.redirect(url, 301);
  }
  return NextResponse.next();
}

export const config = {
  // Run on page requests only — skip Next internals, the API and static files
  // (anything with a file extension) to keep the middleware cheap.
  matcher: ["/((?!_next/|api/|.*\\.[\\w]+$).*)"],
};
