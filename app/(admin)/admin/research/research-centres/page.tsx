import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Research Centres | Admin | Port City International University",
};

export default function ResearchCentresListPage() {
  return <EntityListClient slug="research-centres" />;
}
