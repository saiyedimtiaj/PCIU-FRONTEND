import type { Metadata } from "next";
import RoomBookingsList from "@/components/admin/room-booking/RoomBookingsList";

export const metadata: Metadata = {
  title: "Room Bookings | Admin | Port City International University",
};

export default function RoomBookingsPage() {
  return <RoomBookingsList />;
}
