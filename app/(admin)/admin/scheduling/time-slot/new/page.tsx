import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Time Slot | Admin | Port City International University",
};

export default function NewTimeSlotPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="time-slot" cancelHref="/admin/scheduling/time-slot" />
    </div>
  );
}
