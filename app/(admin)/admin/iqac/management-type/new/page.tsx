import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Management Type | Admin | Port City International University",
};

export default function NewManagementTypePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="management-type" cancelHref="/admin/iqac/management-type" />
    </div>
  );
}
