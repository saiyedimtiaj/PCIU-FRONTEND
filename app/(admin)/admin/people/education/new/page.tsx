import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Education Entry | Admin | Port City International University",
};

export default function NewEducationEntryPage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="education" cancelHref="/admin/people/education" />
    </div>
  );
}
