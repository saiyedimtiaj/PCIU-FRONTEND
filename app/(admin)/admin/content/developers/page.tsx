import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Developers | Admin | Port City International University",
};

export default function DevelopersListPage() {
  return <EntityListClient slug="developers" />;
}
