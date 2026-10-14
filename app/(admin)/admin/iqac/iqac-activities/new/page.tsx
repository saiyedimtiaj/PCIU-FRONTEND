import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Activity | Admin | Port City International University",
};

export default function NewIqacActivitiesPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-activities" cancelHref="/admin/iqac/iqac-activities" />
    </div>
  );
}
