import { getClassTimeSlotOptions } from "@/lib/academics/live";
import FreeRoomsSection from "../_ui/FreeRoomSection";

export default async function FreeRoomsPage() {
  const timeSlots = await getClassTimeSlotOptions();
  return <FreeRoomsSection timeSlots={timeSlots} />;
}