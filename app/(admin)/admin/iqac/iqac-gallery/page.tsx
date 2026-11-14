import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "IQAC Gallery | Admin | Port City International University",
};

export default function IqacGalleryListPage() {
  return <EntityListClient slug="iqac-gallery" />;
}
