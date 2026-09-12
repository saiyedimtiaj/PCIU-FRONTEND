import { redirect } from "next/navigation";
import { getSession } from "@/app/(auth)/actions";
import type { SessionUser } from "@/types/auth";

/**
 * Role-based routing for the two dashboards.
 *
 * `proxy.ts` only checks that a session cookie exists — it deliberately
 * makes no API call, since it runs on every matched request. That means it
 * cannot tell an ADMIN from a TEACHER, so the authoritative role gate lives
 * here and is called from each route group's layout.
 */

export type Role = "SUPER_ADMIN" | "ADMIN" | "MODERATOR" | "TEACHER";

/** Everyone who is not a teacher administers the site. */
export function isAdminRole(role: string): boolean {
  return role !== "TEACHER";
}

/** The dashboard a given role belongs in. */
export function homeFor(role: string): string {
  return role === "TEACHER" ? "/faculty-portal" : "/admin";
}

/**
 * Guards a dashboard layout. Sends signed-out users to /signin, and anyone
 * who landed on the wrong dashboard to their own — silently, rather than
 * showing a dead end.
 */
export async function requireRole(kind: "admin" | "teacher"): Promise<SessionUser> {
  const user = await getSession();

  if (!user) {
    redirect("/signin");
  }

  const wantsAdmin = kind === "admin";
  if (wantsAdmin !== isAdminRole(user.role)) {
    redirect(homeFor(user.role));
  }

  return user;
}
