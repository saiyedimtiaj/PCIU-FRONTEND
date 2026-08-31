import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";
import { generateSampleRows } from "@/components/admin/list/sample-data";

export const metadata: Metadata = {
  title: "Edit News Article | Admin | Port City International University",
};

export function generateStaticParams() {
  const schema = getEntitySchema("news-articles");
  if (!schema) return [];
  return generateSampleRows(schema).map((row) => ({ id: row.__id }));
}

export const dynamicParams = false;

export default async function EditNewsArticlesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("news-articles")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="news-articles" recordId={id} cancelHref="/admin/content/news-articles" />
    </div>
  );
}
