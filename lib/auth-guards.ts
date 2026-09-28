import { redirect } from "next/navigation";
import { getSessionOrThrow } from "@/app/(auth)/actions";
import { SessionCheckError } from "@/lib/session-check-error";
import type { SessionUser } from "@/types/auth";

export type Role = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "TEACHER";

export function isAdminRole(role: string): boolean {
  return role !== "TEACHER";
}

export function homeFor(role: string): string {
  return role === "TEACHER" ? "/faculty-portal" : "/admin";
}


export async function requireRole(kind: "admin" | "teacher"): Promise<SessionUser> {
  let user: SessionUser | null;
  try {
    user = await getSessionOrThrow();
  } catch (error) {
    if (error instanceof SessionCheckError) {
      const params = new URLSearchParams({ reason: error.message });
      redirect(`/signin?${params.toString()}`);
    }
    throw error;
  }

  if (!user) {
    redirect("/signin");
  }

  const wantsAdmin = kind === "admin";
  if (wantsAdmin !== isAdminRole(user.role)) {
    redirect(homeFor(user.role));
  }

  return user;
}
