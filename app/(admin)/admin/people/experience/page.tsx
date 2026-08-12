import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Experience Entries | Admin | Port City International University",
};

export default function ExperienceListPage() {
  return <EntityListClient slug="experience" />;
}
