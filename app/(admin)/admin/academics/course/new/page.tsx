import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Course | Admin | Port City International University",
};

export default function NewCoursePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="course" cancelHref="/admin" />
    </div>
  );
}
