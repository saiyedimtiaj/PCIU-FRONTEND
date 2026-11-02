import type { Metadata } from "next";
import RoomBookingForm from "@/components/admin/room-booking/RoomBookingForm";

export const metadata: Metadata = {
  title: "Book a Room | Admin | Port City International University",
};

export default function NewRoomBookingPage() {
  return <RoomBookingForm />;
}
