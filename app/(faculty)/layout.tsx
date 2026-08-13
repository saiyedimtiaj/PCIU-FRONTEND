import type { ReactNode } from "react";
import { ToastProvider, Toaster } from "@/components/ui/toast";
import { FacultyProfileProvider } from "@/components/faculty/FacultyProfileProvider";
import FacultyPortalShell from "./_ui/FacultyPortalShell";
import profiles from "@/content/faculty-directory/profiles.json";
import type { FacultyProfile as DirectoryProfile } from "@/types/faculty-directory";
import { buildWorkspaceProfile } from "@/components/faculty/faculty-profile-data";

// Design-only: this project has no auth provider, so there is no real
// "logged-in teacher" to load — every /faculty-portal/* route shows the
// same representative profile. See the notice banner in the dashboard.
const DEMO_PROFILE = profiles[1] as DirectoryProfile;

export default function FacultyRouteLayout({ children }: { children: ReactNode }) {
  const profile = buildWorkspaceProfile(DEMO_PROFILE);

  return (
    <ToastProvider>
      <div className="admin-theme text-foreground">
        <FacultyProfileProvider initialProfile={profile}>
          <FacultyPortalShell>{children}</FacultyPortalShell>
        </FacultyProfileProvider>
      </div>
      <Toaster />
    </ToastProvider>
  );
}
