import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Club | Admin | Port City International University",
};

export default function NewClubsPage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="clubs" cancelHref="/admin/content/clubs" />
    </div>
  );
}
