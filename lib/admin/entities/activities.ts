import { z } from "zod";
import { PartyPopper } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const activitiesSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  type: z.string().min(1, "Type is required"),
  title: z.string().min(2, "Title is required").max(255),
  description: z.string().max(255).optional().or(z.literal("")),
  location: z.string().max(255).optional().or(z.literal("")),
  activity_date: z.string().min(1, "Date is required"),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

export const activitiesEntity: EntitySchema<typeof activitiesSchema> = {
  slug: "activities",
  title: "Activity",
  description: "Add a departmental activity or campus-life item.",
  icon: PartyPopper,
  group: "Content",
  zodSchema: activitiesSchema,
  defaultValues: { is_active: true, sort_order: 0 },
  sections: [
    {
      title: "Activity",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { label: "Club", value: "club" },
            { label: "Sports", value: "sports" },
            { label: "Cultural", value: "cultural" },
            { label: "Community Service", value: "community-service" },
          ],
        },
        { name: "location", label: "Location", type: "text" },
        { name: "activity_date", label: "Date", type: "date", required: true },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "cover_image_url", label: "Cover Image URL", type: "image", colSpan: 2 },
        { name: "url", label: "External Link", type: "url" },
        { name: "sort_order", label: "Display Order", type: "number" },
        { name: "is_active", label: "Active", type: "switch" },
      ],
    },
  ],
};
