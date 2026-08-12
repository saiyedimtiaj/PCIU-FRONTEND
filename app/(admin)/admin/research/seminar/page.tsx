import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Seminar / Workshops | Admin | Port City International University",
};

export default function SeminarListPage() {
  return <EntityListClient slug="seminar" />;
}
