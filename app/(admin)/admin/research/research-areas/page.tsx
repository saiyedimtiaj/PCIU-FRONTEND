import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Research Areas | Admin | Port City International University",
};

export default function ResearchAreasListPage() {
  return <EntityListClient slug="research-areas" />;
}
