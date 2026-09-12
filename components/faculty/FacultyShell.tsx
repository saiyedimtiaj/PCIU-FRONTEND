"use client";

import { useState, type ReactNode } from "react";
import { usePathname } from "next/navigation";
import FacultySidebar from "./FacultySidebar";
import FacultyHeader from "./FacultyHeader";

export interface FacultyShellProps {
  children: ReactNode;
  /** Resolves the current pathname to a header title. Differs between the
   * portal (fixed nav labels) and the admin per-teacher workspace (needs
   * the teacher's name + section label). */
  resolveTitle: (pathname: string) => string;
  /** The sidebar's identity-block name. Passed explicitly rather than read
   * from a shared context, since the portal (live query data) and the
   * admin workspace (FacultyProfileProvider's in-memory demo data) get
   * this from two different sources. */
  teacherName: string;
}

/**
 * Mirrors AdminShell's structure (admin-theme wrapper, collapsed/mobileOpen
 * state, sidebar + header + main) but for the faculty-facing routes.
 */
export default function FacultyShell({ children, resolveTitle, teacherName }: FacultyShellProps) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="flex min-h-screen w-full">
      <FacultySidebar
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        onMobileClose={() => setMobileOpen(false)}
        teacherName={teacherName}
      />
      <div className="flex min-w-0 flex-1 flex-col">
        <FacultyHeader
          collapsed={collapsed}
          onToggleCollapse={() => setCollapsed((c) => !c)}
          onOpenMobileNav={() => setMobileOpen(true)}
          title={resolveTitle(pathname)}
        />
        <main className="min-w-0 flex-1 bg-muted/30">{children}</main>
      </div>
    </div>
  );
}
