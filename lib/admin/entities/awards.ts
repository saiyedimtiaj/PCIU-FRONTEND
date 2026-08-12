import { z } from "zod";
import { Award } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const awardsSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  title: z.string().min(2, "Title is required").max(255),
  award_date: z.string().min(1, "Date is required"),
  description: z.string().max(255).optional().or(z.literal("")),
  aw_order: z.coerce.number().int().nonnegative().default(0),
});

export const awardsEntity: EntitySchema<typeof awardsSchema> = {
  slug: "awards",
  title: "Award",
  description: "Add an award or recognition to a teacher's profile.",
  icon: Award,
  group: "People",
  zodSchema: awardsSchema,
  defaultValues: { aw_order: 0 },
  sections: [
    {
      title: "Award",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "title", label: "Award Title", type: "text", required: true, colSpan: 2 },
        { name: "award_date", label: "Date", type: "date", required: true },
        { name: "aw_order", label: "Display Order", type: "number" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ],
    },
  ],
};
