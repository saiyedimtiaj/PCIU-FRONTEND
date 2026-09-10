import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Popup | Admin | Port City International University",
};

export default function PopupListPage() {
  return <EntityListClient slug="popup" />;
}
