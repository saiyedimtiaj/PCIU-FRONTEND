import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Admission Test Result | Admin | Port City International University",
};

export default function AdmissionTestResultPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="admission-test-results" recordId="1" cancelHref="/admin" />
    </div>
  );
}
