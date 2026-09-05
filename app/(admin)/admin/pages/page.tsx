import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Pages | Admin | Port City International University",
};

export default function AdminPagesPage() {
  return <EntityListClient slug="pages" basePath="/admin/pages" />;
}
