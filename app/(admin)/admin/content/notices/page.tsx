import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Notices | Admin | Port City International University",
};

export default function NoticesListPage() {
  return <EntityListClient slug="notices" />;
}
