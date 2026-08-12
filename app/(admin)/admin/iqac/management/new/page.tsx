import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Management Member | Admin | Port City International University",
};

export default function NewManagementMemberPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="management" cancelHref="/admin/iqac/management" />
    </div>
  );
}
