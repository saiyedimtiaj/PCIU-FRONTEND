import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Fee Structures | Admin | Port City International University",
};

export default function FeeStructuresListPage() {
  return <EntityListClient slug="fee-structures" />;
}
