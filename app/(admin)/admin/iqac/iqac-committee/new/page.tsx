import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Committee Member | Admin | Port City International University",
};

export default function NewIQACCommitteeMemberPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-committee" cancelHref="/admin" />
    </div>
  );
}
