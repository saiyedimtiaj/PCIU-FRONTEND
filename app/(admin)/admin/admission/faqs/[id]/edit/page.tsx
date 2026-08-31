import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit FAQ | Admin | Port City International University",
};

export default async function EditFaqsPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("faqs")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="faqs" recordId={id} cancelHref="/admin/admission/faqs" />
    </div>
  );
}
