import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Notice | Admin | Port City International University",
};

export default async function EditNoticesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("notices")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="notices" recordId={id} cancelHref="/admin/content/notices" />
    </div>
  );
}
