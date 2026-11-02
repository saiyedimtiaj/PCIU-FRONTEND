import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Circular | Admin | Port City International University",
};

export default async function EditCircularsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("circulars")) notFound();

  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="circulars" recordId={id} cancelHref="/admin/content/circulars" />
    </div>
  );
}
