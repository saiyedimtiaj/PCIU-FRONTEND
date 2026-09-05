import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit Event | Admin | Port City International University",
};

export function generateStaticParams() {
  const schema = getEntitySchema("events");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditEventsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("events")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="events" recordId={id} cancelHref="/admin/content/events" />
    </div>
  );
}
