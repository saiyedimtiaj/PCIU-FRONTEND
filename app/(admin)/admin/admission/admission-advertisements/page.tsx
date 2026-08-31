import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Admission Advertisement | Admin | Port City International University",
};

export default function AdmissionAdvertisementPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="admission-advertisements" recordId="1" cancelHref="/admin" />
    </div>
  );
}
