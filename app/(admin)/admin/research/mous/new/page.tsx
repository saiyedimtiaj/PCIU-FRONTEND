import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add MoU | Admin | Port City International University",
};

export default function NewMoUPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="mous" cancelHref="/admin" />
    </div>
  );
}
