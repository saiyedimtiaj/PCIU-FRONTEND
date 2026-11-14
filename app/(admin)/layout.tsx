import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import QueryProvider from "@/components/providers/QueryProvider";
import { requireRole } from "@/lib/auth-guards";

export default async function AdminRouteLayout({ children }: { children: ReactNode }) {
  const user = await requireRole("admin");

  return (
    <QueryProvider>
      <AdminShell user={user}>{children}</AdminShell>
    </QueryProvider>
  );
}
