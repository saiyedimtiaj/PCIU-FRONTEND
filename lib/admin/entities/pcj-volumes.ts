import { z } from "zod";
import { optionalUpload } from "./_upload";
import { BookMarked } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const pcjVolumesSchema = z.object({
  volume_number: z.coerce.number().int().positive("Volume number is required"),
  issue_number: z.coerce.number().int().positive("Issue number is required"),
  publication_date: z.string().min(1, "Publication date is required"),
  cover_image: optionalUpload,
  description: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const pcjVolumesEntity: EntitySchema<typeof pcjVolumesSchema> = {
  slug: "pcj-volumes",
  title: "PCJ Volume",
  description: "Add a Port City Journal volume/issue.",
  icon: BookMarked,
  group: "Journal",
  zodSchema: pcjVolumesSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Volume",
      fields: [
        { name: "volume_number", label: "Volume Number", type: "number", required: true },
        { name: "issue_number", label: "Issue Number", type: "number", required: true },
        { name: "publication_date", label: "Publication Date", type: "date", required: true },
        { name: "cover_image", label: "Cover Image URL", type: "image" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
