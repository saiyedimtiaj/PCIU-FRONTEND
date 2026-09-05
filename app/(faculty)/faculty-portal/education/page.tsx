import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Education | Faculty Portal | Port City International University",
};

export default function FacultyPortalEducationPage() {
  return (
    <div className="w-full p-6">
      <FacultySectionList section="education" source="live" />
    </div>
  );
}
