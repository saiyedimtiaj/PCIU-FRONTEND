import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Batch | Admin | Port City International University",
};

export default function NewBatchPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="batch" cancelHref="/admin" />
    </div>
  );
}
