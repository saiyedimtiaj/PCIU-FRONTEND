import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Club | Admin | Port City International University",
};

export default async function EditClubsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("clubs")) notFound();

  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="clubs" recordId={id} cancelHref="/admin/content/clubs" />
    </div>
  );
}
