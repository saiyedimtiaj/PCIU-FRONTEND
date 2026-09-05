import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Fee Structure | Admin | Port City International University",
};

export default function FeeStructurePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="fee-structures" recordId="1" cancelHref="/admin" />
    </div>
  );
}
