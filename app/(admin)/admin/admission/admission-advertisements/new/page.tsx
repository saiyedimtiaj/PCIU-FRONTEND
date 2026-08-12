import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Admission Advertisement | Admin | Port City International University",
};

export default function NewAdmissionAdvertisementPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="admission-advertisements" cancelHref="/admin" />
    </div>
  );
}
