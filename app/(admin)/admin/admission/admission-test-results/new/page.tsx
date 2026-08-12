import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Admission Test Result | Admin | Port City International University",
};

export default function NewAdmissionTestResultPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="admission-test-results" cancelHref="/admin/admission/admission-test-results" />
    </div>
  );
}
