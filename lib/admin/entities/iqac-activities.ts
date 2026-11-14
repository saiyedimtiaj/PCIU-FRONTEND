import { z } from "zod";
import { optionalUpload, optionalUploadList } from "./_upload";
import { CalendarCheck } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

/**
 * IQAC has no activity table of its own — an activity is an Event whose
 * category starts with "IQAC " (see lib/api/iqac.ts). This entity is the
 * same `/events` resource, listed filtered to those rows (services/endpoints.ts)
 * with the category picked from IQAC kinds, so admins never type the prefix.
 */
export const IQAC_ACTIVITY_KINDS = [
  "Workshop",
  "Seminar",
  "Training",
  "Meeting",
  "Conference",
  "Self-Assessment",
  "Other",
] as const;

const iqacActivitiesSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  category: z.string().min(1, "Activity type is required"),
  description: z.string().optional().or(z.literal("")),
  start_date_time: z.string().min(1, "Date is required"),
  end_date_time: z.string().optional().or(z.literal("")),
  all_day: z.boolean().default(false),
  location: z.string().max(255).optional().or(z.literal("")),
  cover_image_url: optionalUpload,
  multiple_image: optionalUploadList,
  is_active: z.boolean().default(true),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

export const iqacActivitiesEntity: EntitySchema<typeof iqacActivitiesSchema> = {
  slug: "iqac-activities",
  title: "IQAC Activity",
  pluralTitle: "IQAC Activities",
  description: "Add an activity to the IQAC page's \"Our Activities\" section.",
  icon: CalendarCheck,
  group: "IQAC",
  zodSchema: iqacActivitiesSchema,
  defaultValues: { multiple_image: [], all_day: false, is_active: true, sort_order: 0 },
  sections: [
    {
      title: "Activity",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug", type: "text", required: true },
        {
          name: "category",
          label: "Activity Type",
          type: "select",
          required: true,
          options: IQAC_ACTIVITY_KINDS.map((kind) => ({ label: kind, value: `IQAC ${kind}` })),
          helper: "Becomes the tab this activity is listed under on the IQAC page.",
        },
        { name: "location", label: "Location", type: "text" },
        { name: "description", label: "Description", type: "richtext", colSpan: 2 },
      ],
    },
    {
      title: "Schedule",
      fields: [
        { name: "start_date_time", label: "Start Date & Time", type: "datetime", required: true },
        { name: "end_date_time", label: "End Date & Time", type: "datetime" },
        { name: "all_day", label: "All Day", type: "switch" },
      ],
    },
    {
      title: "Media",
      fields: [
        { name: "cover_image_url", label: "Cover Image", type: "image", colSpan: 2 },
        { name: "multiple_image", label: "More Photos", type: "image-list", colSpan: 2 },
        { name: "sort_order", label: "Display Order", type: "number" },
        { name: "is_active", label: "Active", type: "switch" },
      ],
    },
  ],
};
