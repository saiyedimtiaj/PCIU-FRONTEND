import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Gallery Item | Admin | Port City International University",
};

export default function NewGalleryItemPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="gallery" cancelHref="/admin/content/gallery" />
    </div>
  );
}
