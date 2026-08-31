import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Section | Admin | Port City International University",
};

export default async function EditSectionPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("section")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="section" recordId={id} cancelHref="/admin/scheduling/section" />
    </div>
  );
}
