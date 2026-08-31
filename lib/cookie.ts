import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";

export const AUTH_COOKIE_NAME = "better-auth.session_token";

export const getCookies = async () => {
  const cookieStore = await cookies();
  const betterAuthToken = cookieStore.get(AUTH_COOKIE_NAME)?.value || null;
  return { betterAuthToken };
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
    .find((parsed) => parsed.name === AUTH_COOKIE_NAME);

  if (!sessionCookie?.value) return;

  const nextCookie = await cookies();

  nextCookie.set(AUTH_COOKIE_NAME, sessionCookie.value, {
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

/** Clears the session cookie — used by logout. */
export const clearAuthCookie = async () => {
  const nextCookie = await cookies();
  nextCookie.delete(AUTH_COOKIE_NAME);
};
