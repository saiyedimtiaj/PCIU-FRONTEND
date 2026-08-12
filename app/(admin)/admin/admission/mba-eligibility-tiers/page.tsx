import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "MBA Eligibility Tiers | Admin | Port City International University",
};

export default function MbaEligibilityTiersListPage() {
  return <EntityListClient slug="mba-eligibility-tiers" />;
}
