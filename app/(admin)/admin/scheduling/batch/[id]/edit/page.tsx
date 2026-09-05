import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Batch | Admin | Port City International University",
};

export default async function EditBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("batch")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="batch" recordId={id} cancelHref="/admin/scheduling/batch" />
    </div>
  );
}
