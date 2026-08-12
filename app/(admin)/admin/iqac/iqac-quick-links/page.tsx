import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Quick Links | Admin | Port City International University",
};

export default function IqacQuickLinksListPage() {
  return <EntityListClient slug="iqac-quick-links" />;
}
