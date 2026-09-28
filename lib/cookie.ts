import { cookies } from "next/headers";
import { parseSetCookie } from "cookie";
import { AUTH_COOKIE_BASE_NAME, isAuthCookieName, stripCookiePrefix } from "./auth-cookie";

export { AUTH_COOKIE_BASE_NAME };


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


export const setCookies = async (cookieHeader: string[]) => {
  if (!cookieHeader?.length) {
    throw new Error("No authentication response from server!");
  }

  const sessionCookie = cookieHeader
    .map((cookieStr) => parseSetCookie(cookieStr))
    .find((parsed) => isAuthCookieName(parsed.name));

  if (!sessionCookie?.value) {
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


  const isPrefixedSecure = sessionCookie.name !== stripCookiePrefix(sessionCookie.name);
  nextCookie.set(sessionCookie.name, sessionCookie.value, {
    httpOnly: true,
    secure: isPrefixedSecure || process.env.NODE_ENV === "production",
    maxAge: sessionCookie.maxAge,
    expires: sessionCookie.expires,
    path: sessionCookie.path || "/",
    sameSite: sessionCookie.sameSite ?? "lax",
  });
};

export const clearAuthCookie = async () => {
  const nextCookie = await cookies();

  for (const cookie of nextCookie.getAll()) {
    if (isAuthCookieName(cookie.name)) {
      nextCookie.delete(cookie.name);
    }
  }
};
