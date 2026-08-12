import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Batches | Admin | Port City International University",
};

export default function BatchListPage() {
  return <EntityListClient slug="batch" />;
}
