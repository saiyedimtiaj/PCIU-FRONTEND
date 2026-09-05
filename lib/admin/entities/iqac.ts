import { z } from "zod";
import { ScrollText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const iqacSchema = z.object({
  director_id: z.string().min(1, "Director is required"),
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  about: z.string().optional().or(z.literal("")),
  mission: z.string().optional().or(z.literal("")),
  vision: z.string().optional().or(z.literal("")),
  director_message: z.string().optional().or(z.literal("")),
  objectives: z.array(z.string()).default([]),
});

export const iqacEntity: EntitySchema<typeof iqacSchema> = {
  slug: "iqac",
  title: "IQAC Page",
  description: "Set the IQAC page's core content — about, mission, vision, and director message.",
  icon: ScrollText,
  group: "IQAC",
  zodSchema: iqacSchema,
  defaultValues: { objectives: [] },
  sections: [
    {
      title: "Overview",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
        { name: "director_id", label: "Director", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ],
    },
    {
      title: "Content",
      fields: [
        { name: "about", label: "About IQAC", type: "richtext", colSpan: 2 },
        { name: "mission", label: "Mission", type: "textarea", colSpan: 2 },
        { name: "vision", label: "Vision", type: "textarea", colSpan: 2 },
        { name: "director_message", label: "Director's Message", type: "richtext", colSpan: 2 },
        { name: "objectives", label: "Objectives", type: "json-list", colSpan: 2, placeholder: "Develop a quality culture" },
      ],
    },
  ],
};
