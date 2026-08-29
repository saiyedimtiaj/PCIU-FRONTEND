import { cookies } from "next/headers";
import { parseCookie } from "cookie";

export const getCookies = async () => {
  const cookieStore = await cookies();
  const betterAuthToken =
    cookieStore.get("better-auth.session_token")?.value || null;
  return { betterAuthToken };
};

export const setCookies = async (cookieHeader: string[]) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let betterAuthToken: any;

  if (cookieHeader && cookieHeader.length) {
    cookieHeader.forEach((cookiesStr) => {
      const parsedCookie = parseCookie(cookiesStr);

      if (parsedCookie["better-auth.session_token"]) {
        betterAuthToken = parsedCookie as Record<string, string>;
      }
    });
  } else {
    throw new Error("No authentication response from server!");
  }

  const nextCookie = await cookies();

  if (betterAuthToken) {
    nextCookie.set(
      "better-auth.session_token",
      betterAuthToken["better-auth.session_token"],
      {
        httpOnly: true,
        maxAge: betterAuthToken["Max-Age"]
          ? parseInt(betterAuthToken["Max-Age"])
          : undefined,
        expires: betterAuthToken.Expires
          ? new Date(betterAuthToken.Expires)
          : undefined,
        secure: true,
        path: betterAuthToken.Path || "/",
        sameSite: betterAuthToken.SameSite?.toLowerCase() || "none",
      },
    );
  }
};
