import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Admission Advertisements | Admin | Port City International University",
};

export default function AdmissionAdvertisementsListPage() {
  return <EntityListClient slug="admission-advertisements" />;
}
