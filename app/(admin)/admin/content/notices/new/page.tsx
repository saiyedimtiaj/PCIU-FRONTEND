import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Notice | Admin | Port City International University",
};

export default function NewNoticePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="notices" cancelHref="/admin" />
    </div>
  );
}
