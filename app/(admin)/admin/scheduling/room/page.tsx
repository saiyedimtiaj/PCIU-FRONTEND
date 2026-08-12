import type { Metadata } from "next";
import EntityListClient from "@/components/admin/list/EntityListClient";

export const metadata: Metadata = {
  title: "Rooms | Admin | Port City International University",
};

export default function RoomListPage() {
  return <EntityListClient slug="room" />;
}
