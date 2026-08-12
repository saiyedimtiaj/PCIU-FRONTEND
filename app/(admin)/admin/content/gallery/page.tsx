import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Gallery Items | Admin | Port City International University",
};

export default function GalleryListPage() {
  return <EntityListClient slug="gallery" />;
}
