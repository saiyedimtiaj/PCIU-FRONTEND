import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Document | Admin | Port City International University",
};

export default function NewIQACDocumentPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-documents" cancelHref="/admin" />
    </div>
  );
}
