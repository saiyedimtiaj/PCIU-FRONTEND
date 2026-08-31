import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Course | Admin | Port City International University",
};

export default async function EditCoursePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("course")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="course" recordId={id} cancelHref="/admin/academics/course" />
    </div>
  );
}
