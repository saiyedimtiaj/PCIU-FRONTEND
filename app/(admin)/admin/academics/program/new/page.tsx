import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Program | Admin | Port City International University",
};

export default function NewProgramPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="program" cancelHref="/admin/academics/program" />
    </div>
  );
}
