import { z } from "zod";
import { Clock } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const timeSlotSchema = z
  .object({
    type: z.enum(["CLASS", "EXAM"]),
    // Older slots were saved before shifts existed and come back null — the
    // edit form then asks for one.
    shift: z.string().min(1, "Shift is required"),
    start_time: z.string().min(1, "Start time is required"),
    end_time: z.string().min(1, "End time is required"),
    status: z.boolean().default(true),
  })
  .refine((data) => !data.start_time || !data.end_time || data.end_time > data.start_time, {
    message: "End time must be after the start time",
    path: ["end_time"],
  });

export const timeSlotEntity: EntitySchema<typeof timeSlotSchema> = {
  slug: "time-slot",
  title: "Time Slot",
  description: "Add a reusable class or exam time slot.",
  icon: Clock,
  group: "Scheduling",
  zodSchema: timeSlotSchema,
  defaultValues: { type: "CLASS", shift: "DAY", status: true },
  sections: [
    {
      title: "Time Slot",
      fields: [
        {
          name: "type",
          label: "Type",
          type: "enum",
          required: true,
          options: [
            { label: "Class", value: "CLASS" },
            { label: "Exam", value: "EXAM" },
          ],
        },
        {
          name: "shift",
          label: "Shift",
          type: "enum",
          required: true,
          options: [
            { label: "Day", value: "DAY" },
            { label: "Evening", value: "EVENING" },
          ],
        },
        { name: "start_time", label: "Start Time", type: "time", required: true },
        { name: "end_time", label: "End Time", type: "time", required: true },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
