import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Activity | Admin | Port City International University",
};

export default function NewActivityPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="activities" cancelHref="/admin/content/activities" />
    </div>
  );
}
