import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const managementTypeSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  description: z.string().optional().or(z.literal("")),
  requires_role: z.boolean().default(false),
  requires_designation: z.boolean().default(true),
  status: z.boolean().default(true),
});

export const managementTypeEntity: EntitySchema<typeof managementTypeSchema> = {
  slug: "management-type",
  title: "Management Type",
  description: "A management body (Syndicate, Academic Council, Office of the Treasurer, ...) that members belong to.",
  icon: Layers,
  group: "IQAC",
  zodSchema: managementTypeSchema,
  defaultValues: { requires_role: false, requires_designation: true, status: true },
  sections: [
    {
      title: "Management Body",
      fields: [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Office of The Treasurer" },
        { name: "slug", label: "Slug", type: "text", required: true, placeholder: "office-of-the-treasurer" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ],
    },
    {
      title: "Member Fields",
      fields: [
        { name: "requires_role", label: "Members require a role", type: "switch" },
        { name: "requires_designation", label: "Members require a designation", type: "switch" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
