import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Research Centre | Admin | Port City International University",
};

export default function NewResearchCentrePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="research-centres" cancelHref="/admin" />
    </div>
  );
}
