import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add PCJ Volume | Admin | Port City International University",
};

export default function NewPCJVolumePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pcj-volumes" cancelHref="/admin" />
    </div>
  );
}
