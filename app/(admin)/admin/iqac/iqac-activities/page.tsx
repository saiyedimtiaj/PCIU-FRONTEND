import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Activities | Admin | Port City International University",
};

export default function IqacActivitiesListPage() {
  return <EntityListClient slug="iqac-activities" />;
}
