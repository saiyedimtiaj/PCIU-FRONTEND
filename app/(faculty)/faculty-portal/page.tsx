import type { Metadata } from "next";
import FacultyDashboard from "@/components/faculty/FacultyDashboard";

export const metadata: Metadata = {
  title: "Faculty Portal | Port City International University",
};

export default function FacultyPortalDashboardPage() {
  return (
    <div className="w-full p-6">
      <FacultyDashboard
        basePath="/faculty-portal"
        demoNotice="This is a design preview — there is no sign-in yet, so this shows a representative profile rather than your own."
      />
    </div>
  );
}
