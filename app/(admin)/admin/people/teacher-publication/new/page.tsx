import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Publication | Admin | Port City International University",
};

export default function NewTeacherPublicationPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="teacher-publication" cancelHref="/admin/people/teacher-publication" />
    </div>
  );
}
