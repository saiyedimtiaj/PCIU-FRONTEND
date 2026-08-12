import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Faculty | Admin | Port City International University",
};

export default function NewFacultyPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="faculty" cancelHref="/admin" />
    </div>
  );
}
