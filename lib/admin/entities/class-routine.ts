import { z } from "zod";
import { CalendarClock } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const classRoutineSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  course_id: z.string().min(1, "Course is required"),
  teacher_id: z.string().min(1, "Teacher is required"),
  building_id: z.string().min(1, "Building is required"),
  room_id: z.string().min(1, "Room is required"),
  time_slot_id: z.string().min(1, "Time slot is required"),
  batch_id: z.string().min(1, "Batch is required"),
  section_id: z.string().min(1, "Section is required"),
  day: z.string().min(1, "Day is required"),
  shift: z.enum(["DAY", "EVENING"], { message: "Shift is required" }),
  student_range: z.string().max(100).optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const classRoutineEntity: EntitySchema<typeof classRoutineSchema> = {
  slug: "class-routine",
  title: "Class Routine",
  description: "Schedule a class: course, teacher, room, and time slot.",
  icon: CalendarClock,
  group: "Scheduling",
  zodSchema: classRoutineSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Assignment",
      fields: [
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "course_id", label: "Course", type: "relation", required: true, relationTo: "course", options: [] },
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "batch_id", label: "Batch", type: "relation", required: true, relationTo: "batch", options: [] },
        { name: "section_id", label: "Section", type: "relation", required: true, relationTo: "section", options: [] },
      ],
    },
    {
      title: "Location & Time",
      fields: [
        { name: "building_id", label: "Building", type: "relation", required: true, relationTo: "building", options: [] },
        { name: "room_id", label: "Room", type: "relation", required: true, relationTo: "room", options: [] },
        { name: "time_slot_id", label: "Time Slot", type: "relation", required: true, relationTo: "time-slot", options: [] },
        {
          name: "day",
          label: "Day",
          type: "select",
          required: true,
          options: [
            { label: "Saturday", value: "SATURDAY" },
            { label: "Sunday", value: "SUNDAY" },
            { label: "Monday", value: "MONDAY" },
            { label: "Tuesday", value: "TUESDAY" },
            { label: "Wednesday", value: "WEDNESDAY" },
            { label: "Thursday", value: "THURSDAY" },
          ],
        },
        {
          name: "shift",
          label: "Shift",
          type: "select",
          required: true,
          options: [
            { label: "Day", value: "DAY" },
            { label: "Evening", value: "EVENING" },
          ],
        },
        { name: "student_range", label: "Student Range", type: "text", placeholder: "1–40" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
