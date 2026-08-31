import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit Research Area | Admin | Port City International University",
};

export function generateStaticParams() {
  const schema = getEntitySchema("research-areas");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditResearchAreasPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("research-areas")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="research-areas" recordId={id} cancelHref="/admin/research/research-areas" />
    </div>
  );
}
