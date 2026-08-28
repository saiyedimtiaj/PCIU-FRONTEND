"use server";

import { serverFetch } from "@/lib/server-fetch";
import { setCookies } from "@/lib/cookie";

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
