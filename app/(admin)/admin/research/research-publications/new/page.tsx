import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Research Publication | Admin | Port City International University",
};

export default function NewResearchPublicationPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="research-publications" cancelHref="/admin" />
    </div>
  );
}
