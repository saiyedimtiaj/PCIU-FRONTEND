import type { Metadata } from "next";
import { notFound } from "next/navigation";
import EntityFormClient from "@/components/admin/form/EntityFormClient";
import { getEntitySchema } from "@/lib/admin/entities";

export const metadata: Metadata = {
  title: "Edit Time Slot | Admin | Port City International University",
};

export default async function EditTimeSlotPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  if (!getEntitySchema("time-slot")) notFound();

  return (
    <div className="w-full p-6">
      <EntityFormClient slug="time-slot" recordId={id} cancelHref="/admin/scheduling/time-slot" />
    </div>
  );
}
