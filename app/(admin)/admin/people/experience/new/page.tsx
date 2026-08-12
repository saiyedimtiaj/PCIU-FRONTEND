import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Experience Entry | Admin | Port City International University",
};

export default function NewExperienceEntryPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="experience" cancelHref="/admin/people/experience" />
    </div>
  );
}
