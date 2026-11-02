import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Circular | Admin | Port City International University",
};

export default function NewCircularsPage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="circulars" cancelHref="/admin/content/circulars" />
    </div>
  );
}
