import { z } from "zod";
import { optionalUpload } from "./_upload";
import { Newspaper } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const newsArticleSchema = z.object({
  title: z.string().min(3, "Title is required").max(255),
  slug: z.string().min(3, "Slug is required").max(255),
  excerpt: z.string().max(500).optional().or(z.literal("")),
  body: z.string().min(10, "Body is required"),
  department_id: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required").max(255),
  badge_label: z.string().max(255).optional().or(z.literal("")),
  locale: z.string().max(10).default("en"),
  author: z.string().max(255).optional().or(z.literal("")),
  cover_image_url: optionalUpload,
  multiple_image: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  status: z.boolean().default(true),
  published_at: z.string().optional().or(z.literal("")),
  sort_order: z.coerce.number().int().nonnegative().optional(),
});

export const newsArticlesEntity: EntitySchema<typeof newsArticleSchema> = {
  slug: "news-articles",
  title: "News Article",
  description: "Publish a news story to the public news feed.",
  icon: Newspaper,
  group: "Content",
  zodSchema: newsArticleSchema,
  defaultValues: {
    multiple_image: [],
    is_featured: false,
    status: true,
    locale: "en",
  },
  sections: [
    {
      title: "Article",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug", type: "text", required: true, helper: "Used in the article URL." },
        {
          name: "category",
          label: "Category",
          type: "text",
          required: true,
          placeholder: "Campus News",
          helper: "A short category label, e.g. Campus News, Admission, Research.",
        },
        {
          name: "department_id",
          label: "Related Department",
          type: "relation",
          relationTo: "department",
          options: [
            { label: "Computer Science and Engineering", value: "1" },
            { label: "Electrical and Electronic Engineering", value: "2" },
            { label: "Civil Engineering", value: "3" },
            { label: "Business Administration", value: "4" },
          ],
          helper: "Optional.",
        },
        { name: "badge_label", label: "Badge Label", type: "text", placeholder: "Featured" },
        { name: "author", label: "Author", type: "text", placeholder: "WRC Team" },
        { name: "locale", label: "Locale", type: "text", placeholder: "en", helper: "Language code for this article." },
        { name: "excerpt", label: "Excerpt", type: "textarea", colSpan: 2, helper: "Short summary shown in listings." },
      ],
    },
    {
      title: "Content",
      fields: [{ name: "body", label: "Body", type: "richtext", required: true, colSpan: 2 }],
    },
    {
      title: "Media",
      fields: [
        { name: "cover_image_url", label: "Cover Image", type: "image", colSpan: 2 },
        {
          name: "multiple_image",
          label: "Gallery Images",
          type: "json-list",
          colSpan: 2,
          placeholder: "https://example.com/photo.jpg",
          helper: "Additional image URLs shown in the article gallery.",
        },
      ],
    },
    {
      title: "Publishing",
      fields: [
        { name: "status", label: "Published", type: "switch", helper: "Off keeps this as a draft, hidden from the public feed." },
        { name: "is_featured", label: "Feature on Homepage", type: "switch" },
        { name: "published_at", label: "Publish Date", type: "date" },
        { name: "sort_order", label: "Sort Order", type: "number", helper: "Lower numbers appear first." },
      ],
    },
  ],
};
