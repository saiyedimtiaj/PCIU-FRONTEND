import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Building | Admin | Port City International University",
};

export default async function EditBuildingPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("building")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="building" recordId={id} cancelHref="/admin/scheduling/building" />
    </div>
  );
}
