import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Faculty | Admin | Port City International University",
};

export default async function EditFacultyPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("faculty")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="faculty" recordId={id} cancelHref="/admin/academics/faculty" />
    </div>
  );
}
