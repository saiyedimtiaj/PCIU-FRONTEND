import type { Metadata } from "next";
import LiveFacultyProfileForm from "@/components/faculty/LiveFacultyProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Faculty Portal | Port City International University",
};

export default function FacultyPortalProfilePage() {
  return (
    <div className="w-full px-4 pt-6">
      <LiveFacultyProfileForm />
    </div>
  );
}
