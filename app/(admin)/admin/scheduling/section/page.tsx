import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Sections | Admin | Port City International University",
};

export default function SectionListPage() {
  return <EntityListClient slug="section" />;
}
