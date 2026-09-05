import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit IQAC Committee Member | Admin | Port City International University",
};

export default async function EditIqacCommitteePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("iqac-committee")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-committee" recordId={id} cancelHref="/admin/iqac/iqac-committee" />
    </div>
  );
}
