import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Department | Admin | Port City International University",
};

export default function NewDepartmentPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="department" cancelHref="/admin" />
    </div>
  );
}
