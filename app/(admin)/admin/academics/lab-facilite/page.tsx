import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Lab Facilities | Admin | Port City International University",
};

export default function LabFaciliteListPage() {
  return <EntityListClient slug="lab-facilite" />;
}
