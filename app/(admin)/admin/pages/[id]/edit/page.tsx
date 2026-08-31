import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Page | Admin | Port City International University",
};

export default async function EditAdminPagePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("pages")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="pages" recordId={id} cancelHref="/admin/pages" />
    </div>
  );
}
