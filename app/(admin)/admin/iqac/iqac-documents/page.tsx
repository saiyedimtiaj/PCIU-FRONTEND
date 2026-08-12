import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Documents | Admin | Port City International University",
};

export default function IqacDocumentsListPage() {
  return <EntityListClient slug="iqac-documents" />;
}
