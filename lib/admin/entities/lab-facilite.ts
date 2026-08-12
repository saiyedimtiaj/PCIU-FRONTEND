import { z } from "zod";
import { FlaskConical } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const labFaciliteSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  department_id: z.string().min(1, "Department is required"),
  icon: z.string().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const labFaciliteEntity: EntitySchema<typeof labFaciliteSchema> = {
  slug: "lab-facilite",
  title: "Lab Facility",
  description: "Add a lab or facility listed under a department.",
  icon: FlaskConical,
  group: "Academics",
  zodSchema: labFaciliteSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Facility Details",
      fields: [
        { name: "name", label: "Facility Name", type: "text", required: true, colSpan: 2, placeholder: "Programming Lab" },
        { name: "slug", label: "Slug", type: "text", required: true },
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
        { name: "icon", label: "Icon Key", type: "text", placeholder: "code" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
