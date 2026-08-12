import { z } from "zod";
import { FileSearch } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const examSchema = z
  .object({
    semester_id: z.string().min(1, "Semester is required"),
    name: z.string().min(2, "Name is required").max(100),
    route_file: z.string().max(200).optional().or(z.literal("")),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    status: z.boolean().default(true),
  })
  .refine((data) => !data.start_date || !data.end_date || data.end_date >= data.start_date, {
    message: "End date must be on or after the start date",
    path: ["end_date"],
  });

export const examEntity: EntitySchema<typeof examSchema> = {
  slug: "exam",
  title: "Exam",
  description: "Add an examination period for a semester.",
  icon: FileSearch,
  group: "Scheduling",
  zodSchema: examSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Exam",
      fields: [
        { name: "name", label: "Exam Name", type: "text", required: true, colSpan: 2, placeholder: "Midterm Examination" },
        {
          name: "semester_id",
          label: "Semester",
          type: "relation",
          required: true,
          relationTo: "semester",
          options: [
            { label: "Spring 2026", value: "1" },
            { label: "Summer 2026", value: "2" },
            { label: "Fall 2026", value: "3" },
          ],
        },
        { name: "start_date", label: "Start Date", type: "date", required: true },
        { name: "end_date", label: "End Date", type: "date", required: true },
        { name: "route_file", label: "Routine File URL", type: "file", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
