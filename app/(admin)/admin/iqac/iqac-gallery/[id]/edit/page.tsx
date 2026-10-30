import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit IQAC Gallery Photo | Admin | Port City International University",
};

export default async function EditIqacGalleryPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("iqac-gallery")) notFound();

  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="iqac-gallery" recordId={id} cancelHref="/admin/iqac/iqac-gallery" />
    </div>
  );
}
