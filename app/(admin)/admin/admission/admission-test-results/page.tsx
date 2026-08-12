import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Admission Test Results | Admin | Port City International University",
};

export default function AdmissionTestResultsListPage() {
  return <EntityListClient slug="admission-test-results" />;
}
