import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC | Admin | Port City International University",
};

export default function IqacListPage() {
  return <EntityListClient slug="iqac" />;
}
