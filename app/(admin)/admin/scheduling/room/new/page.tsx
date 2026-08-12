import type { Metadata } from "next";
import EntityFormClient from "@/components/admin/form/EntityFormClient";

export const metadata: Metadata = {
  title: "Add Room | Admin | Port City International University",
};

export default function NewRoomPage() {
  return (
    <div className="w-full p-6">
      <EntityFormClient slug="room" cancelHref="/admin/scheduling/room" />
    </div>
  );
}
