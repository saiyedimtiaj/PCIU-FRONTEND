import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Publication | Admin | Port City International University",
};

export default async function EditTeacherPublicationPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("teacher-publication")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="teacher-publication" recordId={id} cancelHref="/admin/people/teacher-publication" />
    </div>
  );
}
