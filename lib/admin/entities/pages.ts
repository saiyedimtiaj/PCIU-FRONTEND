import { z } from "zod";
import { FileText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const pagesSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  path: z.string().min(1, "Path is required").max(255),
  page_type: z.string().min(1, "Page type is required"),
  meta_title: z.string().max(255).optional().or(z.literal("")),
  meta_description: z.string().max(255).optional().or(z.literal("")),
  og_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().optional().or(z.literal("")),
});

export const pagesEntity: EntitySchema<typeof pagesSchema> = {
  slug: "pages",
  title: "Page",
  description: "Register a public page for SEO metadata and publishing control.",
  icon: FileText,
  group: "Content",
  zodSchema: pagesSchema,
  defaultValues: { status: "draft" },
  sections: [
    {
      title: "Page",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug", type: "text", required: true },
        { name: "path", label: "URL Path", type: "text", required: true, placeholder: "/about-the-university" },
        {
          name: "page_type",
          label: "Page Type",
          type: "select",
          required: true,
          options: [
            { label: "Static", value: "static" },
            { label: "Landing", value: "landing" },
            { label: "Department", value: "department" },
            { label: "Content", value: "content" },
          ],
        },
      ],
    },
    {
      title: "SEO",
      fields: [
        { name: "meta_title", label: "Meta Title", type: "text", colSpan: 2 },
        { name: "meta_description", label: "Meta Description", type: "textarea", colSpan: 2 },
        { name: "og_image_url", label: "OG Image URL", type: "image", colSpan: 2 },
      ],
    },
    {
      title: "Publishing",
      fields: [
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
            { label: "Archived", value: "archived" },
          ],
        },
        { name: "published_at", label: "Publish Date", type: "date" },
      ],
    },
  ],
};
