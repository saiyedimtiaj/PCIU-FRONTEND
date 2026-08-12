import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add FAQ | Admin | Port City International University",
};

export default function NewFAQPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="faqs" cancelHref="/admin" />
    </div>
  );
}
