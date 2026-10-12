import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Management Types | Admin | Port City International University",
};

export default function ManagementTypeListPage() {
  return <EntityListClient slug="management-type" />;
}
