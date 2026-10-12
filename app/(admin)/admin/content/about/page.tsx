import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "About the University | Admin | Port City International University",
};

export default function AboutUniversityAdminPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="about" recordId="1" cancelHref="/admin" />
    </div>
  );
}
