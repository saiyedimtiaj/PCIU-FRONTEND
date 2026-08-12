import { z } from "zod";
import { Microscope } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const researchCentresSchema = z.object({
  department_id: z.string().optional().or(z.literal("")),
  name: z.string().min(2, "Name is required").max(255),
  description: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  accent_color: z.string().max(255).optional().or(z.literal("")),
  coordinator_name: z.string().max(255).optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published"]),
});

export const researchCentresEntity: EntitySchema<typeof researchCentresSchema> = {
  slug: "research-centres",
  title: "Research Centre",
  description: "Add a research centre or cell.",
  icon: Microscope,
  group: "Research",
  zodSchema: researchCentresSchema,
  defaultValues: { tags: [], is_featured: false, status: "published" },
  sections: [
    {
      title: "Centre",
      fields: [
        { name: "name", label: "Centre Name", type: "text", required: true, colSpan: 2 },
        {
          name: "department_id",
          label: "Lead Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "coordinator_name", label: "Coordinator", type: "text" },
        { name: "accent_color", label: "Accent Color", type: "text", placeholder: "from-blue-500 to-indigo-600" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "tags", label: "Focus Tags", type: "json-list", colSpan: 2, placeholder: "Policy" },
      ],
    },
    {
      title: "Display",
      fields: [
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "is_featured", label: "Featured", type: "switch" },
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
        },
      ],
    },
  ],
};
