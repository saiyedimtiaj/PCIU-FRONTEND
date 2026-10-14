import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add IQAC Gallery Photo | Admin | Port City International University",
};

export default function NewIqacGalleryPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="iqac-gallery" cancelHref="/admin/iqac/iqac-gallery" />
    </div>
  );
}
