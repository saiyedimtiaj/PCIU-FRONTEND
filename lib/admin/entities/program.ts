import { z } from "zod";
import { BookOpen } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const programSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  department_id: z.string().min(1, "Department is required"),
  icon: z.string().max(255).optional().or(z.literal("")),
  program_type: z.enum(["undergraduate", "graduate"]),
  duration: z.coerce.number().positive("Duration must be greater than 0"),
  credit: z.coerce.number().positive("Credits must be greater than 0"),
  per_credit_amount: z.coerce.number().nonnegative("Amount can't be negative"),
  status: z.boolean().default(true),
});

export const programEntity: EntitySchema<typeof programSchema> = {
  slug: "program",
  title: "Program",
  description: "Add an academic program offered by a department.",
  icon: BookOpen,
  group: "Academics",
  zodSchema: programSchema,
  defaultValues: {
    program_type: "undergraduate",
    status: true,
  },
  sections: [
    {
      title: "Program Details",
      fields: [
        { name: "title", label: "Program Title", type: "text", required: true, colSpan: 2, placeholder: "BSc in Computer Science & Engineering" },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [
            { label: "Computer Science and Engineering", value: "1" },
            { label: "Electrical and Electronic Engineering", value: "2" },
            { label: "Civil Engineering", value: "3" },
            { label: "Business Administration", value: "4" },
            { label: "English", value: "5" },
            { label: "Law", value: "6" },
          ],
        },
        {
          name: "program_type",
          label: "Program Type",
          type: "enum",
          required: true,
          options: [
            { label: "Undergraduate", value: "undergraduate" },
            { label: "Graduate", value: "graduate" },
          ],
        },
        { name: "icon", label: "Icon Key", type: "text", placeholder: "graduation-cap", helper: "Matches a key in the icon registry." },
      ],
    },
    {
      title: "Duration & Fees",
      fields: [
        { name: "duration", label: "Duration (years)", type: "decimal", required: true, placeholder: "4" },
        { name: "credit", label: "Total Credits", type: "decimal", required: true, placeholder: "160" },
        { name: "per_credit_amount", label: "Per-Credit Amount (BDT)", type: "decimal", required: true, placeholder: "2200" },
        { name: "status", label: "Active", type: "switch", helper: "Visible on the public admissions pages." },
      ],
    },
  ],
};
