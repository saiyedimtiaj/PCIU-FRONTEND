import { z } from "zod";
import { Compass } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const researchAreasSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  icon: z.string().max(255).optional().or(z.literal("")),
  background_color: z.string().max(255).optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["draft", "published"]),
});

export const researchAreasEntity: EntitySchema<typeof researchAreasSchema> = {
  slug: "research-areas",
  title: "Research Area",
  description: "Add a university-wide research focus area.",
  icon: Compass,
  group: "Research",
  zodSchema: researchAreasSchema,
  defaultValues: { status: "published" },
  sections: [
    {
      title: "Research Area",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2, placeholder: "Artificial Intelligence & Data Science" },
        { name: "icon", label: "Icon Key", type: "text", placeholder: "microscope" },
        { name: "background_color", label: "Background Gradient", type: "text", placeholder: "from-blue-500 to-indigo-600" },
        { name: "display_order", label: "Display Order", type: "number" },
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
