import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Contact | Admin | Port City International University",
};

export default async function EditContactPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("contact")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="contact" recordId={id} cancelHref="/admin/system/contact" />
    </div>
  );
}
