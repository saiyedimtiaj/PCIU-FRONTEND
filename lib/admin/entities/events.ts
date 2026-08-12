import { z } from "zod";
import { CalendarPlus } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const eventsSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  department_id: z.string().optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  badge_label: z.string().max(255).optional().or(z.literal("")),
  start_datetime: z.string().min(1, "Start date/time is required"),
  end_datetime: z.string().optional().or(z.literal("")),
  all_day: z.boolean().default(false),
  location: z.string().max(255).optional().or(z.literal("")),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  multiple_image: z.array(z.string()).default([]),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

export const eventsEntity: EntitySchema<typeof eventsSchema> = {
  slug: "events",
  title: "Event",
  description: "Add an event to the public events calendar.",
  icon: CalendarPlus,
  group: "Content",
  zodSchema: eventsSchema,
  defaultValues: { multiple_image: [], all_day: false, is_active: true, sort_order: 0 },
  sections: [
    {
      title: "Event",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug", type: "text", required: true },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { label: "Academic", value: "academic" },
            { label: "Cultural", value: "cultural" },
            { label: "Sports", value: "sports" },
            { label: "Workshop", value: "workshop" },
          ],
        },
        {
          name: "department_id",
          label: "Related Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "badge_label", label: "Badge Label", type: "text" },
        { name: "location", label: "Location", type: "text" },
        { name: "description", label: "Description", type: "richtext", colSpan: 2 },
      ],
    },
    {
      title: "Schedule",
      fields: [
        { name: "start_datetime", label: "Start Date & Time", type: "datetime", required: true },
        { name: "end_datetime", label: "End Date & Time", type: "datetime" },
        { name: "all_day", label: "All Day Event", type: "switch" },
      ],
    },
    {
      title: "Media & Links",
      fields: [
        { name: "cover_image_url", label: "Cover Image URL", type: "image", colSpan: 2 },
        { name: "multiple_image", label: "Gallery Images", type: "json-list", colSpan: 2 },
        { name: "url", label: "External Link", type: "url" },
        { name: "sort_order", label: "Display Order", type: "number" },
        { name: "is_active", label: "Active", type: "switch" },
      ],
    },
  ],
};
