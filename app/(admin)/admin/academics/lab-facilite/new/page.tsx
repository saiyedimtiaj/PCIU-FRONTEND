import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Lab Facility | Admin | Port City International University",
};

export default function NewLabFacilityPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="lab-facilite" cancelHref="/admin" />
    </div>
  );
}
