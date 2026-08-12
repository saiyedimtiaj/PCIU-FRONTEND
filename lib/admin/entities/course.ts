import { z } from "zod";
import { BookOpenCheck } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const courseSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  code: z.string().min(2, "Course code is required").max(100),
  department_id: z.string().min(1, "Department is required"),
  status: z.boolean().default(true),
});

export const courseEntity: EntitySchema<typeof courseSchema> = {
  slug: "course",
  title: "Course",
  description: "Add a course offered by a department.",
  icon: BookOpenCheck,
  group: "Academics",
  zodSchema: courseSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Course Details",
      fields: [
        { name: "name", label: "Course Name", type: "text", required: true, colSpan: 2, placeholder: "Data Structures" },
        { name: "code", label: "Course Code", type: "text", required: true, placeholder: "CSE 203" },
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
          ],
        },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
