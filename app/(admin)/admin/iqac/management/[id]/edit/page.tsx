import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Management Member | Admin | Port City International University",
};

export default async function EditManagementPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("management")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="management" recordId={id} cancelHref="/admin/iqac/management" />
    </div>
  );
}
