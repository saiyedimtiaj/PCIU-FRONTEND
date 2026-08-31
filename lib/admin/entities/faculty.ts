import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const facultySchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  teacher_id: z.string().optional().or(z.literal("")),
  about: z.string().optional().or(z.literal("")),
  mission: z.string().optional().or(z.literal("")),
  vision: z.string().optional().or(z.literal("")),
  key_point: z.array(z.string()).default([]),
  status: z.boolean().default(true),
});

export const facultyEntity: EntitySchema<typeof facultySchema> = {
  slug: "faculty",
  title: "Faculty",
  description: "Add a top-level faculty (e.g. Faculty of Science and Engineering).",
  icon: Layers,
  group: "Academics",
  zodSchema: facultySchema,
  defaultValues: { key_point: [], status: true },
  sections: [
    {
      title: "Identity",
      fields: [
        { name: "name", label: "Faculty Name", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "teacher_id", label: "Dean", type: "relation", relationTo: "teacher", options: [] },
      ],
    },
    {
      title: "Content",
      fields: [
        { name: "about", label: "About", type: "richtext", colSpan: 2 },
        { name: "mission", label: "Mission", type: "textarea", colSpan: 2 },
        { name: "vision", label: "Vision", type: "textarea", colSpan: 2 },
        { name: "key_point", label: "Key Points", type: "json-list", colSpan: 2, placeholder: "Industry-aligned curriculum" },
      ],
    },
    {
      title: "Status",
      fields: [{ name: "status", label: "Active", type: "switch" }],
    },
  ],
};
