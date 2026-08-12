import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Programs | Admin | Port City International University",
};

export default function ProgramListPage() {
  return <EntityListClient slug="program" />;
}
