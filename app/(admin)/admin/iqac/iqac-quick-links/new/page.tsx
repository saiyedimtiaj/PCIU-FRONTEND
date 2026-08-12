import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Quick Link | Admin | Port City International University",
};

export default function NewIQACQuickLinkPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-quick-links" cancelHref="/admin" />
    </div>
  );
}
