import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Research Publications | Admin | Port City International University",
};

export default function ResearchPublicationsListPage() {
  return <EntityListClient slug="research-publications" />;
}
