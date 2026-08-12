import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Awards | Admin | Port City International University",
};

export default function AwardsListPage() {
  return <EntityListClient slug="awards" />;
}
