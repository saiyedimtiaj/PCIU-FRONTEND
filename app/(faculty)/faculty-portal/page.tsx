import type { Metadata } from "next";
import LiveFacultyDashboard from "@/components/faculty/LiveFacultyDashboard";

export const metadata: Metadata = {
  title: "Faculty Portal | Port City International University",
};

export default function FacultyPortalDashboardPage() {
  return (
    <div className="w-full p-6">
      <LiveFacultyDashboard />
    </div>
  );
}
