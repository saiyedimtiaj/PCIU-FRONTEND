import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Publications | Admin | Port City International University",
};

export default function TeacherPublicationListPage() {
  return <EntityListClient slug="teacher-publication" />;
}
