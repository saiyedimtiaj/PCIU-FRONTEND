import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit Experience Entry | Admin | Port City International University",
};

export function generateStaticParams() {
  const schema = getEntitySchema("experience");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditExperiencePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("experience")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="experience" recordId={id} cancelHref="/admin/people/experience" />
    </div>
  );
}
