import { NextResponse, type NextRequest } from "next/server";
import { isAuthCookieName } from "@/lib/auth-cookie";

/**
 * Gate for the admin dashboard and the teacher-facing faculty portal.
 * (Next 16 renamed Middleware to Proxy; the behaviour is unchanged.)
 *
 * This is an optimistic check only — it verifies a session cookie is
 * present, and deliberately makes no API call, since it runs on every
 * matched request. It therefore can't tell an admin from a teacher; that
 * role split is the authoritative check each route group's layout makes
 * via `requireRole()` (see lib/auth-guards.ts). The API still authorises
 * each individual request, and `serverFetch` surfaces a 401 if the
 * session has expired server-side.
 */
export function proxy(request: NextRequest) {
  // Matched by name pattern rather than an exact string: the backend decides
  // whether the cookie carries a `__Secure-` prefix. See lib/auth-cookie.ts.
  const token = request.cookies
    .getAll()
    .find((cookie) => isAuthCookieName(cookie.name) && cookie.value)?.value;

  if (!token) {
    const signInUrl = new URL("/signin", request.url);
    // Preserve where they were headed so sign-in can bounce them back.
    signInUrl.searchParams.set("from", request.nextUrl.pathname);
    return NextResponse.redirect(signInUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/admin/:path*", "/faculty-portal/:path*"],
};
