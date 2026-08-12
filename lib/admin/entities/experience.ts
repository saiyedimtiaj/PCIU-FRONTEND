import { z } from "zod";
import { ClipboardList } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const experienceSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  title: z.string().min(2, "Title is required").max(255),
  organization: z.string().min(2, "Organization is required").max(255),
  period: z.string().min(1, "Period is required").max(255),
  ex_order: z.coerce.number().int().nonnegative().default(0),
});

export const experienceEntity: EntitySchema<typeof experienceSchema> = {
  slug: "experience",
  title: "Experience Entry",
  description: "Add a professional experience record to a teacher's profile.",
  icon: ClipboardList,
  group: "People",
  zodSchema: experienceSchema,
  defaultValues: { ex_order: 0 },
  sections: [
    {
      title: "Experience",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "title", label: "Title / Role", type: "text", required: true, colSpan: 2 },
        { name: "organization", label: "Organization", type: "text", required: true },
        { name: "period", label: "Period", type: "text", required: true, placeholder: "2018 – 2022" },
        { name: "ex_order", label: "Display Order", type: "number" },
      ],
    },
  ],
};
