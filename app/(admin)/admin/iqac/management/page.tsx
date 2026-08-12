import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Management Members | Admin | Port City International University",
};

export default function ManagementListPage() {
  return <EntityListClient slug="management" />;
}
