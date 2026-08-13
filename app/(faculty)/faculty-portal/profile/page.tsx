import type { Metadata } from "next";
import FacultyProfileForm from "@/components/faculty/FacultyProfileForm";

export const metadata: Metadata = {
  title: "My Profile | Faculty Portal | Port City International University",
};

export default function FacultyPortalProfilePage() {
  return (
    <div className="w-full p-6">
      <FacultyProfileForm />
    </div>
  );
}
