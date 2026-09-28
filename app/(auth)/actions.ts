"use server";

import { serverFetch } from "@/lib/server-fetch";
import { setCookies, clearAuthCookie } from "@/lib/cookie";
import { SessionCheckError } from "@/lib/session-check-error";
import type { SessionUser } from "@/types/auth";

interface LoginResult {
  error?: string;
  success?: boolean;
  message?: string;
  data?: { role?: string } & Record<string, unknown>;
}

export const loginAction = async (formData: FormData): Promise<LoginResult> => {
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

    const raw = await res.text();
    let response: LoginResult | undefined;
    try {
      response = raw ? JSON.parse(raw) : undefined;
    } catch {
      const trimmed = raw.trim();
      const looksLikeMessage = trimmed.length > 0 && trimmed.length < 200 && !trimmed.startsWith("<");
      throw new Error(looksLikeMessage ? trimmed : "The server returned an unexpected response. Please try again.");
    }

    if (!res.ok) {
      throw new Error(response?.message || "Unable to sign in. Please try again.");
    }

    const setCookieHeader = res.headers.getSetCookie();
    if (setCookieHeader && setCookieHeader.length > 0) {
      await setCookies(setCookieHeader);
    }

    return response ?? {};
  } catch (error) {
    return {
      error:
        error instanceof Error ? error.message : "An unexpected error occurred",
    };
  }
};



export const logoutAction = async () => {
  try {
    await serverFetch.post("/auth/logout", { body: JSON.stringify({}) });
  } catch {
    // Ignored on purpose — see above.
  }

  await clearAuthCookie();
  return { success: true };
};


function isFrameworkControlFlowError(error: unknown): boolean {
  return (
    typeof error === "object" &&
    error !== null &&
    "digest" in error &&
    typeof (error as { digest: unknown }).digest === "string"
  );
}

export const getSession = async (): Promise<SessionUser | null> => {
  try {
    return await getSessionOrThrow();
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;
    return null;
  }
};

export const getSessionOrThrow = async (): Promise<SessionUser | null> => {
  let res: Response;
  try {
    res = await serverFetch.get("/auth/me", { cache: "no-store" });
  } catch (error) {
    if (isFrameworkControlFlowError(error)) throw error;
    throw new SessionCheckError(
      error instanceof Error ? error.message : "Could not reach the server",
    );
  }

  if (res.status === 401) return null;

  const raw = await res.text();
  let response: { success?: boolean; message?: string; data?: unknown } | undefined;
  try {
    response = raw ? JSON.parse(raw) : undefined;
  } catch {
    const trimmed = raw.trim();
    const looksLikeMessage = trimmed.length > 0 && trimmed.length < 200 && !trimmed.startsWith("<");
    throw new SessionCheckError(looksLikeMessage ? trimmed : "The server returned an unexpected response");
  }

  if (!res.ok) {
    throw new SessionCheckError(response?.message || `Session check failed (${res.status})`);
  }

  return response?.success ? (response.data as SessionUser) : null;
};
