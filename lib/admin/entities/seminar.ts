import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const seminarSchema = z.object({
  department_id: z.string().optional().or(z.literal("")),
  page_id: z.string().optional().or(z.literal("")),
  teacher_id: z.string().optional().or(z.literal("")),
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  venue: z.string().max(255).optional().or(z.literal("")),
  types: z.enum(["Seminar", "Workshops", "Conference", "training", "meeting"]),
  image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  multiple_image: z.array(z.string()).default([]),
  date_time: z.string().min(1, "Date & time is required"),
  status: z.boolean().default(true),
});

export const seminarEntity: EntitySchema<typeof seminarSchema> = {
  slug: "seminar",
  title: "Seminar / Workshop",
  description: "Add a seminar, workshop, conference, training, or meeting record.",
  icon: Users,
  group: "Research",
  zodSchema: seminarSchema,
  defaultValues: { multiple_image: [], types: "Seminar", status: true },
  sections: [
    {
      title: "Event",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
        {
          name: "types",
          label: "Type",
          type: "enum",
          required: true,
          options: [
            { label: "Seminar", value: "Seminar" },
            { label: "Workshop", value: "Workshops" },
            { label: "Conference", value: "Conference" },
            { label: "Training", value: "training" },
            { label: "Meeting", value: "meeting" },
          ],
        },
        { name: "venue", label: "Venue", type: "text" },
        { name: "date_time", label: "Date & Time", type: "datetime", required: true },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "teacher_id", label: "Organizer", type: "relation", relationTo: "teacher", options: [] },
      ],
    },
    {
      title: "Content & Media",
      fields: [
        { name: "description", label: "Description", type: "richtext", colSpan: 2 },
        { name: "image", label: "Cover Image URL", type: "image", colSpan: 2 },
        { name: "multiple_image", label: "Gallery Images", type: "json-list", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
