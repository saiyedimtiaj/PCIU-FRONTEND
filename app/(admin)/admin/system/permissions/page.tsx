import type { Metadata } from "next";
import { getSession } from "@/app/(auth)/actions";
import AccessDenied from "@/components/admin/AccessDenied";
import { SUPER_ADMIN } from "@/lib/admin/permissions";
import PermissionsMatrix from "./_ui/PermissionsMatrix";

export const metadata: Metadata = {
  title: "Permissions | Admin | Port City International University",
};

export default async function PermissionsPage() {
  // Only a Super Admin manages roles; ADMIN and MODERATOR don't see this
  // page in the sidebar, and reaching it by URL shows the access screen.
  const user = await getSession();
  if (user?.role !== SUPER_ADMIN) {
    return (
      <AccessDenied
        title="Permissions are managed by Super Admins"
        description="Only a Super Admin can view or change what each role is allowed to do."
      />
    );
  }

  return <PermissionsMatrix />;
}
