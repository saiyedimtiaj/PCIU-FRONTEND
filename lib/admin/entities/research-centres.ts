import { z } from "zod";
import { Microscope } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const hexColor = z
  .string()
  .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Use a hex color like #00A86B")
  .optional()
  .or(z.literal(""));

const researchCentresSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  name: z.string().min(2, "Name is required").max(255),
  description: z.string().optional().or(z.literal("")),
  tags: z.array(z.string()).default([]),
  accent_color: hexColor,
  coordinator_name: z.string().max(255).optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  is_featured: z.boolean().default(false),
  status: z.boolean().default(true),
});

export const researchCentresEntity: EntitySchema<typeof researchCentresSchema> = {
  slug: "research-centres",
  title: "Research Centre",
  description: "Add a research centre, lab or cell.",
  icon: Microscope,
  group: "Research",
  zodSchema: researchCentresSchema,
  defaultValues: { tags: [], is_featured: false, status: true, display_order: 0 },
  sections: [
    {
      title: "Centre",
      fields: [
        { name: "name", label: "Centre Name", type: "text", required: true, colSpan: 2, placeholder: "TeleCommunication Lab" },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [],
        },
        { name: "coordinator_name", label: "Coordinator", type: "text", placeholder: "Dr. Aris Thorne" },
        { name: "accent_color", label: "Accent Color", type: "text", placeholder: "#00A86B" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "tags", label: "Tags", type: "json-list", colSpan: 2, placeholder: "Networking" },
      ],
    },
    {
      title: "Display",
      fields: [
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "is_featured", label: "Featured", type: "switch" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
