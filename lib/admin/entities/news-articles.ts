import { z } from "zod";
import { Newspaper } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const newsArticleSchema = z.object({
  title: z.string().min(3, "Title is required").max(255),
  slug: z.string().min(3, "Slug is required").max(255),
  excerpt: z.string().max(255).optional().or(z.literal("")),
  body: z.string().min(10, "Body is required"),
  department_id: z.string().optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  badge_label: z.string().max(255).optional().or(z.literal("")),
  author: z.string().max(255).optional().or(z.literal("")),
  cover_image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  multiple_image: z.array(z.string()).default([]),
  is_featured: z.boolean().default(false),
  status: z.enum(["draft", "published", "archived"]),
  published_at: z.string().optional().or(z.literal("")),
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
    status: "draft",
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
          type: "select",
          required: true,
          options: [
            { label: "Academic", value: "academic" },
            { label: "Admission", value: "admission" },
            { label: "Achievement", value: "achievement" },
            { label: "Campus Life", value: "campus-life" },
            { label: "Research", value: "research" },
          ],
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
        },
        { name: "badge_label", label: "Badge Label", type: "text", placeholder: "Breaking" },
        { name: "author", label: "Author", type: "text" },
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
        { name: "cover_image_url", label: "Cover Image URL", type: "image", colSpan: 2 },
        {
          name: "multiple_image",
          label: "Gallery Images",
          type: "json-list",
          colSpan: 2,
          placeholder: "https://example.com/photo.jpg",
        },
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
        { name: "is_featured", label: "Feature on Homepage", type: "switch", colSpan: 2 },
      ],
    },
  ],
};
