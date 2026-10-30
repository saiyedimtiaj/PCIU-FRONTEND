import type { ReactNode } from "react";
import RequirePermission from "@/components/admin/RequirePermission";

/** The faculty directory and every per-teacher workspace are teacher data. */
export default function AdminFacultyLayout({ children }: { children: ReactNode }) {
  return (
    <RequirePermission slug="teacher" action="view" label="the faculty directory">
      {children}
    </RequirePermission>
  );
}
