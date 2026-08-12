import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Departments | Admin | Port City International University",
};

export default function DepartmentListPage() {
  return <EntityListClient slug="department" />;
}
