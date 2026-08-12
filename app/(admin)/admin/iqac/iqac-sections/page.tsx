import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Sections | Admin | Port City International University",
};

export default function IqacSectionsListPage() {
  return <EntityListClient slug="iqac-sections" />;
}
