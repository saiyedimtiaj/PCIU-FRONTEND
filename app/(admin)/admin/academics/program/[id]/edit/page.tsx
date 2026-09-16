import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Program | Admin | Port City International University",
};

export default async function EditProgramPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("program")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="program" recordId={id} cancelHref="/admin/academics/program" />
    </div>
  );
}
