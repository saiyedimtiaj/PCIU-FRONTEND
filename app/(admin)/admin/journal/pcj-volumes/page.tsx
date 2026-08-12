import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "PCJ Volumes | Admin | Port City International University",
};

export default function PcjVolumesListPage() {
  return <EntityListClient slug="pcj-volumes" />;
}
