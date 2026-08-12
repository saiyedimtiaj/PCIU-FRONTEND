import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Events | Admin | Port City International University",
};

export default function EventsListPage() {
  return <EntityListClient slug="events" />;
}
