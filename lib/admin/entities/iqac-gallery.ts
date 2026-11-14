import { z } from "zod";
import { requiredUpload } from "./_upload";
import { Images } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

/**
 * IQAC has no gallery table of its own — a photo is a Gallery item whose
 * type starts with "iqac-" (see lib/api/iqac.ts). This entity is the same
 * `/galleries` resource, listed filtered to those rows (services/endpoints.ts)
 * with the type picked from IQAC categories, so admins never type the key.
 */
export const IQAC_GALLERY_KINDS = [
  "Workshop",
  "Seminar",
  "Training",
  "Meeting",
  "Conference",
  "Event",
  "Other",
] as const;

const iqacGallerySchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  image_url: requiredUpload,
  types: z.string().min(1, "Category is required"),
  event_id: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const iqacGalleryEntity: EntitySchema<typeof iqacGallerySchema> = {
  slug: "iqac-gallery",
  title: "IQAC Gallery Photo",
  pluralTitle: "IQAC Gallery",
  description: "Add a photo to the IQAC page's gallery.",
  icon: Images,
  group: "IQAC",
  zodSchema: iqacGallerySchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Photo",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "subtitle", label: "Caption", type: "text", colSpan: 2 },
        { name: "image_url", label: "Image", type: "image", required: true, colSpan: 2 },
        {
          name: "types",
          label: "Category",
          type: "select",
          required: true,
          options: IQAC_GALLERY_KINDS.map((kind) => ({
            label: kind,
            value: `iqac-${kind.toLowerCase()}`,
          })),
          helper: "Becomes the filter this photo is listed under on the IQAC page.",
        },
        {
          name: "event_id",
          label: "Related Activity",
          type: "relation",
          relationTo: "iqac-activities",
          options: [],
          helper: "Optional. Link this photo to an IQAC activity.",
        },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
