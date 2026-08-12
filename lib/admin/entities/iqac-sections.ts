import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const iqacSectionsSchema = z.object({
  section_key: z.enum(["hero", "about", "vision", "mission", "quality_policy", "director_message"]),
  title: z.string().min(2, "Title is required").max(255),
  content: z.string().min(2, "Content is required"),
  background_image: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const iqacSectionsEntity: EntitySchema<typeof iqacSectionsSchema> = {
  slug: "iqac-sections",
  title: "IQAC Section",
  description: "Add a reusable content block for the IQAC page.",
  icon: Layers,
  group: "IQAC",
  zodSchema: iqacSectionsSchema,
  defaultValues: { section_key: "hero", status: true },
  sections: [
    {
      title: "Section",
      fields: [
        {
          name: "section_key",
          label: "Section Key",
          type: "enum",
          required: true,
          options: [
            { label: "Hero", value: "hero" },
            { label: "About", value: "about" },
            { label: "Vision", value: "vision" },
            { label: "Mission", value: "mission" },
            { label: "Quality Policy", value: "quality_policy" },
            { label: "Director Message", value: "director_message" },
          ],
        },
        { name: "title", label: "Title", type: "text", required: true },
        { name: "background_image", label: "Background Image URL", type: "image", colSpan: 2 },
        { name: "content", label: "Content", type: "richtext", required: true, colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
