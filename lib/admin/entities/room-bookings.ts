import { z } from "zod";
import { DoorOpen } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

// Body of POST /room-bookings (JSON). The admin pages use a custom flow
// (components/admin/room-booking/) that only offers free room/slot pairs;
// this schema backs validation, decoding and the sidebar entry.
export const roomBookingSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Pick a date"),
  time_slot_id: z.string().min(1, "Pick a time slot"),
  room_id: z.string().min(1, "Pick a free room"),
  purpose: z.string().min(2, "Purpose is required").max(255),
  booked_by: z.string().min(2, "Name is required").max(255),
  contact_email: z.email("Must be a valid email"),
  contact_phone: z
    .string()
    .min(1, "Phone is required")
    .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid number, e.g. 01700000000"),
});

export type RoomBookingValues = z.infer<typeof roomBookingSchema>;

export const roomBookingsEntity: EntitySchema<typeof roomBookingSchema> = {
  slug: "room-bookings",
  title: "Room Booking",
  description: "Book a free room for a time slot on a given date.",
  icon: DoorOpen,
  group: "Scheduling",
  zodSchema: roomBookingSchema,
  defaultValues: {},
  sections: [
    {
      title: "Booking",
      fields: [
        { name: "date", label: "Date", type: "date", required: true },
        { name: "time_slot_id", label: "Time Slot", type: "relation", required: true, relationTo: "time-slot", options: [] },
        { name: "room_id", label: "Room", type: "relation", required: true, relationTo: "room", options: [] },
        { name: "purpose", label: "Purpose", type: "text", required: true },
        { name: "booked_by", label: "Booked By", type: "text", required: true },
        { name: "contact_email", label: "Contact Email", type: "email", required: true },
        { name: "contact_phone", label: "Contact Phone", type: "tel", required: true },
      ],
    },
  ],
};
