import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Section | Admin | Port City International University",
};

export default function NewIQACSectionPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-sections" cancelHref="/admin/iqac/iqac-sections" />
    </div>
  );
}
