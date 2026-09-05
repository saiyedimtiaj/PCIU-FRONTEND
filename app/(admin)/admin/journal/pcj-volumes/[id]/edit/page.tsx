import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit PCJ Volume | Admin | Port City International University",
};

export default async function EditPcjVolumesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("pcj-volumes")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pcj-volumes" recordId={id} cancelHref="/admin/journal/pcj-volumes" />
    </div>
  );
}
