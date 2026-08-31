import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Class Routine | Admin | Port City International University",
};

export default async function EditClassRoutinePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("class-routine")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="class-routine" recordId={id} cancelHref="/admin/scheduling/class-routine" />
    </div>
  );
}
