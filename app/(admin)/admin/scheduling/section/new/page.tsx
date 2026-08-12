import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Section | Admin | Port City International University",
};

export default function NewSectionPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="section" cancelHref="/admin" />
    </div>
  );
}
