import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Popup | Admin | Port City International University",
};

export default async function EditPopupPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("popup")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="popup" recordId={id} cancelHref="/admin/system/popup" />
    </div>
  );
}
