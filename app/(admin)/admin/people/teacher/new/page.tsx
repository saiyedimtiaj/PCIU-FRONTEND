import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Teacher | Admin | Port City International University",
};

export default function NewTeacherPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="teacher" cancelHref="/admin/people/teacher" />
    </div>
  );
}
