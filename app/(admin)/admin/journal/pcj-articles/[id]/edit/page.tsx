import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit PCJ Article | Admin | Port City International University",
};

export default async function EditPcjArticlesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("pcj-articles")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pcj-articles" recordId={id} cancelHref="/admin/journal/pcj-articles" />
    </div>
  );
}
