import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Award | Admin | Port City International University",
};

export default function NewAwardPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="awards" cancelHref="/admin/people/awards" />
    </div>
  );
}
