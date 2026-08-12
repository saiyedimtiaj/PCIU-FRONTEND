import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Partners | Admin | Port City International University",
};

export default function PartnersListPage() {
  return <EntityListClient slug="partners" />;
}
