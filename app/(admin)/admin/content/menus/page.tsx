import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Menu Items | Admin | Port City International University",
};

export default function MenusListPage() {
  return <EntityListClient slug="menus" />;
}
