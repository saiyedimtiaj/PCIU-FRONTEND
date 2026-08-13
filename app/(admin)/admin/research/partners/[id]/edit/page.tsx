import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit Partner | Admin | Port City International University",
};

// Same deterministic sample rows the listing renders, so every id the
// listing links to has a matching prerendered edit page.
export function generateStaticParams() {
  const schema = getEntitySchema("partners");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditPartnersPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("partners")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="partners" recordId={id} cancelHref="/admin/research/partners" />
    </div>
  );
}
