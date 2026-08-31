import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Admission Schedule | Admin | Port City International University",
};

export default async function EditAdmissionSchedulesPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("admission-schedules")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="admission-schedules" recordId={id} cancelHref="/admin/admission/admission-schedules" />
    </div>
  );
}
