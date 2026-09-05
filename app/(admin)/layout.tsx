import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import QueryProvider from "@/components/providers/QueryProvider";
import { requireRole } from "@/lib/auth-guards";

export default async function AdminRouteLayout({ children }: { children: ReactNode }) {
  // Authoritative role gate. proxy.ts only confirms a session cookie
  // exists — it can't tell an admin from a teacher, since that requires
  // an API call it deliberately avoids making on every request. A
  // TEACHER cookie satisfies the proxy today; this is what actually keeps
  // them out of the admin dashboard and sends them to their own portal.
  await requireRole("admin");

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
