import { z } from "zod";
import { requiredUpload } from "./_upload";
import { GalleryVerticalEnd } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const heroSlidesSchema = z.object({
  heading: z.string().min(2, "Heading is required").max(255),
  subheading: z.string().max(255).optional().or(z.literal("")),
  image: requiredUpload,
  cta_label: z.string().max(255).optional().or(z.literal("")),
  cta_url: z.string().max(255).optional().or(z.literal("")),
  sort_order: z.coerce.number().int().nonnegative().default(0),
  is_active: z.boolean().default(true),
});

export const heroSlidesEntity: EntitySchema<typeof heroSlidesSchema> = {
  slug: "hero-slides",
  title: "Hero Slide",
  description: "Add a slide to the homepage hero carousel.",
  icon: GalleryVerticalEnd,
  group: "Content",
  zodSchema: heroSlidesSchema,
  defaultValues: { sort_order: 0, is_active: true },
  sections: [
    {
      title: "Slide",
      fields: [
        { name: "heading", label: "Heading", type: "text", required: true, colSpan: 2 },
        { name: "subheading", label: "Subheading", type: "text", colSpan: 2 },
        { name: "image", label: "Slide Image URL", type: "image", required: true, colSpan: 2 },
        { name: "cta_label", label: "Button Label", type: "text", placeholder: "Apply Now" },
        { name: "cta_url", label: "Button URL", type: "url", placeholder: "/admission" },
        { name: "sort_order", label: "Display Order", type: "number" },
        { name: "is_active", label: "Active", type: "switch" },
      ],
    },
  ],
};
