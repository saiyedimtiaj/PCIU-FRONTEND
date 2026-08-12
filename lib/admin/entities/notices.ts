import { z } from "zod";
import { Bell } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const noticesSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  department_id: z.string().optional().or(z.literal("")),
  page_id: z.string().optional().or(z.literal("")),
  badge_label: z.string().max(255).optional().or(z.literal("")),
  badge_color: z.string().max(255).optional().or(z.literal("")),
  icon: z.string().max(255).optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  notice_date: z.string().min(1, "Date is required"),
  is_active: z.boolean().default(true),
  is_home: z.boolean().default(false),
  sort_order: z.coerce.number().int().nonnegative().default(0),
});

export const noticesEntity: EntitySchema<typeof noticesSchema> = {
  slug: "notices",
  title: "Notice",
  description: "Add a notice to the notice board.",
  icon: Bell,
  group: "Content",
  zodSchema: noticesSchema,
  defaultValues: { is_active: true, is_home: false, sort_order: 0 },
  sections: [
    {
      title: "Notice",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { label: "Academic", value: "Academic" },
            { label: "Admission", value: "Admission" },
            { label: "Examination", value: "Examination" },
            { label: "Administrative", value: "Administrative" },
            { label: "Event", value: "Event" },
            { label: "Scholarship", value: "Scholarship" },
          ],
        },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "page_id", label: "Related Page", type: "relation", relationTo: "pages", options: [] },
        { name: "badge_label", label: "Badge Label", type: "text" },
        { name: "badge_color", label: "Badge Color", type: "text", placeholder: "accent" },
        { name: "icon", label: "Icon Key", type: "text" },
        { name: "notice_date", label: "Notice Date", type: "date", required: true },
        { name: "is_home", label: "Show on Homepage", type: "switch" },
        { name: "is_active", label: "Active", type: "switch" },
        { name: "sort_order", label: "Display Order", type: "number" },
      ],
    },
  ],
};
