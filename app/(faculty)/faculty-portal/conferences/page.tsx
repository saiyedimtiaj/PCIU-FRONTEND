import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Conferences | Faculty Portal | Port City International University",
};

export default function FacultyPortalConferencesPage() {
  return (
    <div className="w-full p-6">
      <FacultySectionList section="conferences" />
    </div>
  );
}
