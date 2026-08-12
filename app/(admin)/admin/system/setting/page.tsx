import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Settings | Admin | Port City International University",
};

export default function SettingListPage() {
  return <EntityListClient slug="setting" />;
}
