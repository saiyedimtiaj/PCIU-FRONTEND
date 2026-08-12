import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Admission Schedules | Admin | Port City International University",
};

export default function AdmissionSchedulesListPage() {
  return <EntityListClient slug="admission-schedules" />;
}
