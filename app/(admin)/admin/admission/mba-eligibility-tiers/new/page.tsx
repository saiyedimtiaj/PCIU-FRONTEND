import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add MBA Eligibility Tier | Admin | Port City International University",
};

export default function NewMBAEligibilityTierPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="mba-eligibility-tiers" cancelHref="/admin" />
    </div>
  );
}
