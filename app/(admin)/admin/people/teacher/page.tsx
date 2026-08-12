import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Teachers | Admin | Port City International University",
};

export default function TeacherListPage() {
  return <EntityListClient slug="teacher" />;
}
