import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "MoUs | Admin | Port City International University",
};

export default function MousListPage() {
  return <EntityListClient slug="mous" />;
}
