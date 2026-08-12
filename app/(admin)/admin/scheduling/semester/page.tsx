import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Semesters | Admin | Port City International University",
};

export default function SemesterListPage() {
  return <EntityListClient slug="semester" />;
}
