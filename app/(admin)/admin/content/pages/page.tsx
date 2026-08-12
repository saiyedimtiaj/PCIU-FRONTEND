import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Pages | Admin | Port City International University",
};

export default function PagesListPage() {
  return <EntityListClient slug="pages" />;
}
