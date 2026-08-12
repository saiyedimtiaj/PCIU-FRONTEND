import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Building | Admin | Port City International University",
};

export default function NewBuildingPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="building" cancelHref="/admin/scheduling/building" />
    </div>
  );
}
