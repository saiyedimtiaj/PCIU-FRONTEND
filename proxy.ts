import { NextResponse, type NextRequest } from "next/server";

const AUTH_COOKIE_NAME = "better-auth.session_token";

/**
 * Gate for the admin dashboard. (Next 16 renamed Middleware to Proxy; the
 * behaviour is unchanged.)
 *
 * This is an optimistic check only — it verifies a session cookie is
 * present, and deliberately makes no API call, since it runs on every
 * matched request. The API still authorises each individual request, and
 * `serverFetch` surfaces a 401 if the session has expired server-side.
 */
export function proxy(request: NextRequest) {
  const token = request.cookies.get(AUTH_COOKIE_NAME)?.value;

  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    // Preserve where they were headed so sign-in can bounce them back.
    signInUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*"],
};
