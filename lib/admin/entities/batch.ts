import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const batchSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  name: z.string().min(1, "Name is required").max(100),
  status: z.boolean().default(true),
});

export const batchEntity: EntitySchema<typeof batchSchema> = {
  slug: "batch",
  title: "Batch",
  description: "Add a student batch/intake for a department.",
  icon: Layers,
  group: "Scheduling",
  zodSchema: batchSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Batch",
      fields: [
        { name: "name", label: "Batch Name", type: "text", required: true, placeholder: "CSE 51" },
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
          ],
        },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
