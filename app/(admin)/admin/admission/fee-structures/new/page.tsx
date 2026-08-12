import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Fee Structure | Admin | Port City International University",
};

export default function NewFeeStructurePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="fee-structures" cancelHref="/admin" />
    </div>
  );
}
