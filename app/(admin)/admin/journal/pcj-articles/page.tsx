import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "PCJ Articles | Admin | Port City International University",
};

export default function PcjArticlesListPage() {
  return <EntityListClient slug="pcj-articles" />;
}
