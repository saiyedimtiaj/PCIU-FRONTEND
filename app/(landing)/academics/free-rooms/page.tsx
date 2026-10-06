import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { getClassTimeSlotOptions, getFreeRoomsWeek } from "@/lib/academics/live";
import { CLASS_DAYS } from "@/lib/academics/routine-grid";
import FreeRoomsSection from "../_ui/FreeRoomSection";

export default function FreeRoomsPage() {
  return (
    <Suspense
      fallback={
        <div className="space-y-6">
          <Skeleton className="h-12 w-1/3" />
          <Skeleton className="h-100 w-full" />
        </div>
      }
    >
      <FreeRoomsData />
    </Suspense>
  );
}

async function FreeRoomsData() {
  const timeSlots = await getClassTimeSlotOptions();
  const rooms = await getFreeRoomsWeek(
    CLASS_DAYS.map((d) => d.key.toUpperCase()),
    timeSlots,
  );
  return <FreeRoomsSection timeSlots={timeSlots} rooms={rooms} />;
}
