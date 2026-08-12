import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Partner | Admin | Port City International University",
};

export default function NewPartnerPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="partners" cancelHref="/admin" />
    </div>
  );
}
