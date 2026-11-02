import { z } from "zod";
import { Megaphone } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";
import { optionalUpload } from "./_upload";

const circularsSchema = z
  .object({
    title: z.string().min(2, "Title is required").max(255),
    type: z.enum(["JOB", "TENDER"], { message: "Type is required" }),
    // Optional — set it when the circular belongs to one department.
    department_id: z.string().optional().or(z.literal("")),
    description: z.string().optional().or(z.literal("")),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    pdf: optionalUpload,
    status: z.boolean().default(true),
  })
  .refine((data) => !data.start_date || !data.end_date || data.end_date >= data.start_date, {
    message: "End date can't be before the start date",
    path: ["end_date"],
  });

export const circularsEntity: EntitySchema<typeof circularsSchema> = {
  slug: "circulars",
  title: "Circular",
  description: "Publish a job or tender circular.",
  icon: Megaphone,
  group: "Content",
  zodSchema: circularsSchema,
  defaultValues: { type: "JOB", status: true },
  sections: [
    {
      title: "Circular",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2, placeholder: "Faculty Recruitment" },
        {
          name: "type",
          label: "Type",
          type: "enum",
          required: true,
          options: [
            { label: "Job", value: "JOB" },
            { label: "Tender", value: "TENDER" },
          ],
        },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          relationTo: "department",
          options: [],
          helper: "Optional — only if the circular is for one department.",
        },
        { name: "start_date", label: "Start Date", type: "date", required: true },
        { name: "end_date", label: "End Date", type: "date", required: true },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "pdf", label: "Circular PDF", type: "file", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
