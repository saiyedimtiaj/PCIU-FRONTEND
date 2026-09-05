"use client";

import type { ReactNode } from "react";
import FacultyShell from "@/components/faculty/FacultyShell";
import { useFacultyPortalData } from "@/components/faculty/FacultyPortalDataProvider";

const PAGE_TITLES: Record<string, string> = {
  "/faculty-portal": "Dashboard",
  "/faculty-portal/profile": "My Profile",
  "/faculty-portal/education": "Education",
  "/faculty-portal/publications": "Publications",
  "/faculty-portal/experience": "Experience",
  "/faculty-portal/awards": "Awards",
  "/faculty-portal/memberships": "Memberships",
};

function resolveTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? "Faculty Portal";
}

export default function FacultyPortalShell({ children }: { children: ReactNode }) {
  const { displayName } = useFacultyPortalData();
  return (
    <FacultyShell resolveTitle={resolveTitle} teacherName={displayName}>
      {children}
    </FacultyShell>
  );
}
