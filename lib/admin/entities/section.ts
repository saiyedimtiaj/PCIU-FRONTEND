import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const sectionSchema = z.object({
  batch_id: z.string().min(1, "Batch is required"),
  name: z.string().min(1, "Name is required").max(100),
  status: z.boolean().default(true),
});

export const sectionEntity: EntitySchema<typeof sectionSchema> = {
  slug: "section",
  title: "Section",
  description: "Add a section within a batch.",
  icon: Layers,
  group: "Scheduling",
  zodSchema: sectionSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Section",
      fields: [
        { name: "name", label: "Section Name", type: "text", required: true, placeholder: "A" },
        { name: "batch_id", label: "Batch", type: "relation", required: true, relationTo: "batch", options: [] },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
