import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Experience | Faculty Portal | Port City International University",
};

export default function FacultyPortalExperiencePage() {
  return (
    <div className="w-full p-6">
      <FacultySectionList section="experience" source="live" />
    </div>
  );
}
