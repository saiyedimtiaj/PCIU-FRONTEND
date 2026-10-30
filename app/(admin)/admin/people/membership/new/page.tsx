import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Membership Entry | Admin | Port City International University",
};

export default function NewMembershipEntryPage() {
  return (
    <div className="w-full px-4 pt-6">
      <EntityFormClient slug="membership" cancelHref="/admin/people/membership" />
    </div>
  );
}
