import type { ReactNode } from "react";
import AdminShell from "@/components/admin/AdminShell";
import QueryProvider from "@/components/providers/QueryProvider";
import { requireRole } from "@/lib/auth-guards";

export default async function AdminRouteLayout({ children }: { children: ReactNode }) {
  await requireRole("admin");

  return (
    <QueryProvider>
      <AdminShell>{children}</AdminShell>
    </QueryProvider>
  );
}
