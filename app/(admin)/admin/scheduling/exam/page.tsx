import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Exams | Admin | Port City International University",
};

export default function ExamListPage() {
  return <EntityListClient slug="exam" />;
}
