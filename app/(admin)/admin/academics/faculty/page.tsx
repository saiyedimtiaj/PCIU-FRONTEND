import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Faculties | Admin | Port City International University",
};

export default function FacultyListPage() {
  return <EntityListClient slug="faculty" />;
}
