import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Seminar Workshop | Admin | Port City International University",
};

export default function NewSeminarWorkshopPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="seminar" cancelHref="/admin" />
    </div>
  );
}
