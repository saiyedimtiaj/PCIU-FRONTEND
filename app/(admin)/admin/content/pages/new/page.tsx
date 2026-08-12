import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Page | Admin | Port City International University",
};

export default function NewPagePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pages" cancelHref="/admin/content/pages" />
    </div>
  );
}
