import { z } from "zod";
import { requiredUpload } from "./_upload";
import { Image as ImageIcon } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const gallerySchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  image_url: requiredUpload,
  department_id: z.string().optional().or(z.literal("")),
  event_id: z.string().optional().or(z.literal("")),
  page_id: z.string().optional().or(z.literal("")),
  types: z.string().min(1, "Type is required"),
  status: z.boolean().default(true),
});

export const galleryEntity: EntitySchema<typeof gallerySchema> = {
  slug: "gallery",
  title: "Gallery Item",
  description: "Add a photo to a gallery collection.",
  icon: ImageIcon,
  group: "Content",
  zodSchema: gallerySchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Photo",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "subtitle", label: "Subtitle / Story", type: "text", colSpan: 2 },
        { name: "image_url", label: "Image URL", type: "image", required: true, colSpan: 2 },
        {
          name: "types",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { label: "Campus", value: "campus" },
            { label: "Academic", value: "academic" },
            { label: "Cultural", value: "cultural" },
            { label: "Sports", value: "sports" },
          ],
        },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "event_id", label: "Related Event", type: "relation", relationTo: "events", options: [] },
        { name: "page_id", label: "Related Page", type: "relation", relationTo: "pages", options: [{ label: "About Port City International University", value: "1" }] },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
