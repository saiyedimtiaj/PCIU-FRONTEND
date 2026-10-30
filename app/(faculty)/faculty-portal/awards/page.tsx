import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Awards | Faculty Portal | Port City International University",
};

export default function FacultyPortalAwardsPage() {
  return (
    <div className="w-full px-4 pt-6">
      <FacultySectionList section="awards" source="live" />
    </div>
  );
}
