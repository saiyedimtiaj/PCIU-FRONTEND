import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Courses | Admin | Port City International University",
};

export default function CourseListPage() {
  return <EntityListClient slug="course" />;
}
