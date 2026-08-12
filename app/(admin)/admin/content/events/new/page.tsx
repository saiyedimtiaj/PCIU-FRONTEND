import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Event | Admin | Port City International University",
};

export default function NewEventPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="events" cancelHref="/admin" />
    </div>
  );
}
