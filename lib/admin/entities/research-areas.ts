import { z } from "zod";
import { Compass } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const researchAreasSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  background_color: z
    .string()
    .regex(/^#([0-9a-f]{3}|[0-9a-f]{6})$/i, "Use a hex color like #000080")
    .optional()
    .or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.boolean().default(true),
});

export const researchAreasEntity: EntitySchema<typeof researchAreasSchema> = {
  slug: "research-areas",
  title: "Research Area",
  description: "Add a university-wide research focus area.",
  icon: Compass,
  group: "Research",
  zodSchema: researchAreasSchema,
  defaultValues: { status: true, display_order: 0 },
  sections: [
    {
      title: "Research Area",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2, placeholder: "NLP" },
        { name: "background_color", label: "Background Color", type: "text", placeholder: "#000080" },
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
