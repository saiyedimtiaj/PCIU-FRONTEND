import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC | Admin | Port City International University",
};

export default function NewIqacPage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="iqac" cancelHref="/admin/iqac/iqac" />
    </div>
  );
}
