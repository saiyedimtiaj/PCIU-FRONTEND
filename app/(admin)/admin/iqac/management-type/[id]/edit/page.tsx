import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Management Type | Admin | Port City International University",
};

export default async function EditManagementTypePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("management-type")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="management-type" recordId={id} cancelHref="/admin/iqac/management-type" />
    </div>
  );
}
