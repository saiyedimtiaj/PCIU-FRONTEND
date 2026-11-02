import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Clubs | Admin | Port City International University",
};

export default function ClubsListPage() {
  return <EntityListClient slug="clubs" />;
}
