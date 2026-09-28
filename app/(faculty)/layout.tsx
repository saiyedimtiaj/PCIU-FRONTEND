import type { ReactNode } from "react";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import QueryProvider from "@/components/providers/QueryProvider";
import { FacultyPortalDataProvider } from "@/components/faculty/FacultyPortalDataProvider";
import FacultyPortalShell from "./_ui/FacultyPortalShell";
import { requireRole } from "@/lib/auth-guards";

export default async function FacultyRouteLayout({ children }: { children: ReactNode }) {
  // Authoritative role gate. proxy.ts only confirms a session cookie
  // exists — it can't tell an admin from a teacher, since that requires
  // an API call it deliberately avoids making on every request.
  const session = await requireRole("teacher");

  return (
    <QueryProvider>
      <ToastProvider timeout={5000} limit={3}>
        <div className="admin-theme text-foreground">
          <FacultyPortalDataProvider fallbackName={session.name}>
            <FacultyPortalShell>{children}</FacultyPortalShell>
          </FacultyPortalDataProvider>
          <Toaster />
        </div>
      </ToastProvider>
    </QueryProvider>
  );
}
