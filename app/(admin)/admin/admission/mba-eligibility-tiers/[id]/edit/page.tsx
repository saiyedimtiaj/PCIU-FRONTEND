import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit MBA Eligibility Tier | Admin | Port City International University",
};

export default async function EditMbaEligibilityTiersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("mba-eligibility-tiers")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="mba-eligibility-tiers" recordId={id} cancelHref="/admin/admission/mba-eligibility-tiers" />
    </div>
  );
}
