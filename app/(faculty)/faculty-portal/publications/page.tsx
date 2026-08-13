import type { Metadata } from "next";
import FacultySectionList from "@/components/faculty/FacultySectionList";

export const metadata: Metadata = {
  title: "Publications | Faculty Portal | Port City International University",
};

export default function FacultyPortalPublicationsPage() {
  return (
    <div className="w-full p-6">
      <FacultySectionList section="publications" />
    </div>
  );
}
