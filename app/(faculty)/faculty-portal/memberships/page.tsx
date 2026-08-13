import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Memberships | Faculty Portal | Port City International University",
};

export default function FacultyPortalMembershipsPage() {
  return (
    <div className="w-full p-6">
      <FacultySectionList section="memberships" />
    </div>
  );
}
