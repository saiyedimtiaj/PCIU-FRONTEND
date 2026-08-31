"use server";

import { serverFetch } from "@/lib/server-fetch";
import { setCookies, clearAuthCookie } from "@/lib/cookie";
import type { SessionUser } from "@/types/auth";

export const loginAction = async (formData: FormData) => {
  const email = formData.get("email")?.toString();
  const password = formData.get("password")?.toString();
  const rememberMe = formData.get("rememberMe") === "on";

  if (!email || !password) {
    return { error: "Email and password are required" };
  }

  try {
    const res = await serverFetch.post("/auth/login", {
      body: JSON.stringify({ email, password, rememberMe }),
    });

    const response = await res.json();

    if (!res.ok) {
      throw new Error(response.message);
    }

    const setCookieHeader = res.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      await setCookies(setCookieHeader);
    }

    return response;
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};

/**
 * Ends the session. The cookie is cleared locally even if the API call
 * fails — otherwise a backend hiccup would strand the user in a state
 * where the UI thinks they're signed in but every request 401s.
 */
export const logoutAction = async () => {
  try {
    await serverFetch.post("/auth/logout", { body: JSON.stringify({}) });
  } catch {
    // Ignored on purpose — see above.
  }

  await clearAuthCookie();
  return { success: true };
};

/** Current user, or null when signed out. Never throws. */
export const getSession = async (): Promise<SessionUser | null> => {
  try {
    const res = await serverFetch.get("/auth/me", { cache: "no-store" });
    if (!res.ok) return null;

    const response = await res.json();
    return response?.success ? (response.data as SessionUser) : null;
  } catch {
    return null;
  }
};
