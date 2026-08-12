import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Class Routine | Admin | Port City International University",
};

export default function NewClassRoutinePage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="class-routine" cancelHref="/admin/scheduling/class-routine" />
    </div>
  );
}
