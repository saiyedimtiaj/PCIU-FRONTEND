import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Committee Members | Admin | Port City International University",
};

export default function IqacCommitteeListPage() {
  return <EntityListClient slug="iqac-committee" />;
}
