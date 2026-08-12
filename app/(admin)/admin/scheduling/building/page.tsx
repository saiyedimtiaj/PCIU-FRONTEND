import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Buildings | Admin | Port City International University",
};

export default function BuildingListPage() {
  return <EntityListClient slug="building" />;
}
