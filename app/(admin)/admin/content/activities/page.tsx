import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Activities | Admin | Port City International University",
};

export default function ActivitiesListPage() {
  return <EntityListClient slug="activities" />;
}
