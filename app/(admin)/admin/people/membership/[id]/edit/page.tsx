import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Membership Entry | Admin | Port City International University",
};

export default async function EditMembershipPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("membership")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="membership" recordId={id} cancelHref="/admin/people/membership" />
    </div>
  );
}
