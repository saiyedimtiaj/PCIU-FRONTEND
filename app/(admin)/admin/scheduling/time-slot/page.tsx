import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Time Slots | Admin | Port City International University",
};

export default function TimeSlotListPage() {
  return <EntityListClient slug="time-slot" />;
}
