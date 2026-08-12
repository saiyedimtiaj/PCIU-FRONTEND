import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Education Entries | Admin | Port City International University",
};

export default function EducationListPage() {
  return <EntityListClient slug="education" />;
}
