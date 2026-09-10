import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { AUTH_COOKIE_BASE_NAME, isAuthCookieName } from "./auth-cookie";

export { AUTH_COOKIE_BASE_NAME };

/**
 * The session cookie as we hold it: the backend's own cookie name is kept
 * alongside the value, since that is the name it expects on the way back.
 */
export const getCookies = async () => {
  const cookieStore = await cookies();
  const sessionCookie = cookieStore
    .getAll()
    .find((cookie) => isAuthCookieName(cookie.name) && cookie.value);

  return {
    betterAuthToken: sessionCookie?.value || null,
    betterAuthCookieName: sessionCookie?.name || AUTH_COOKIE_BASE_NAME,
  };
};

/**
 * Mirrors the backend's `Set-Cookie` for the session token onto our own
 * domain. The API is a separate origin, so the browser never stores its
 * cookie for us — `serverFetch` replays this value as a `Cookie` header
 * on each server-side call.
 */
export const setCookies = async (cookieHeader: string[]) => {
  if (!cookieHeader?.length) {
    throw new Error("No authentication response from server!");
  }

  const sessionCookie = cookieHeader
    .map((cookieStr) => parseSetCookie(cookieStr))
    .find((parsed) => isAuthCookieName(parsed.name));

  if (!sessionCookie?.value) {
    // Loud on purpose. Silently returning here left the user "signed in"
    // with no cookie, and the only symptom was /admin redirecting back to
    // /signin — see the naming note in lib/auth-cookie.ts.
    throw new Error(
      `Sign-in succeeded but no session cookie was returned (saw: ${
        cookieHeader
          .map((c) => c.split("=")[0]?.trim())
          .filter(Boolean)
          .join(", ") || "none"
      }).`,
    );
  }

  const nextCookie = await cookies();

  // Stored under the backend's own name — a `__Secure-`-prefixed cookie must
  // carry `Secure`, which we set unconditionally below anyway.
  nextCookie.set(sessionCookie.name, sessionCookie.value, {
    httpOnly: true,
    secure: true,
    maxAge: sessionCookie.maxAge,
    expires: sessionCookie.expires,
    path: sessionCookie.path || "/",
    // The backend sends SameSite=Lax; keep whatever it chose so the cookie
    // behaves the same on our domain.
    sameSite: sessionCookie.sameSite ?? "lax",
  });
};

/** Clears the session cookie — used by logout. Removes every prefix variant. */
export const clearAuthCookie = async () => {
  const nextCookie = await cookies();

  for (const cookie of nextCookie.getAll()) {
    if (isAuthCookieName(cookie.name)) {
      nextCookie.delete(cookie.name);
    }
  }
};
