import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Research Area | Admin | Port City International University",
};

export default function NewResearchAreaPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="research-areas" cancelHref="/admin/research/research-areas" />
    </div>
  );
}
