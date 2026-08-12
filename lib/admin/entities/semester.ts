import { z } from "zod";
import { CalendarDays } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const semesterSchema = z.object({
  title: z.string().min(2, "Title is required").max(100),
  status: z.boolean().default(true),
});

export const semesterEntity: EntitySchema<typeof semesterSchema> = {
  slug: "semester",
  title: "Semester",
  description: "Add an academic semester/trimester.",
  icon: CalendarDays,
  group: "Scheduling",
  zodSchema: semesterSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Semester",
      fields: [
        { name: "title", label: "Semester Title", type: "text", required: true, colSpan: 2, placeholder: "Spring 2026" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
