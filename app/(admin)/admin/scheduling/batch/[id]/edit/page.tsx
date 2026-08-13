import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit Batch | Admin | Port City International University",
};

// Same deterministic sample rows the listing renders, so every id the
// listing links to has a matching prerendered edit page.
export function generateStaticParams() {
  const schema = getEntitySchema("batch");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditBatchPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("batch")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="batch" recordId={id} cancelHref="/admin/scheduling/batch" />
    </div>
  );
}
