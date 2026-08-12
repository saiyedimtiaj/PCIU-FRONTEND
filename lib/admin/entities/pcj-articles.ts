import { z } from "zod";
import { ScrollText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const pcjArticlesSchema = z.object({
  department_id: z.string().optional().or(z.literal("")),
  volume_id: z.string().min(1, "Volume is required"),
  title: z.string().min(2, "Title is required").max(255),
  authors: z.string().min(2, "Authors are required").max(255),
  abstract: z.string().optional().or(z.literal("")),
  keywords: z.string().max(255).optional().or(z.literal("")),
  pages: z.string().max(255).optional().or(z.literal("")),
  doi: z.string().max(255).optional().or(z.literal("")),
  pdf_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  publication_date: z.string().min(1, "Publication date is required"),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.boolean().default(true),
});

export const pcjArticlesEntity: EntitySchema<typeof pcjArticlesSchema> = {
  slug: "pcj-articles",
  title: "PCJ Article",
  description: "Add an article to a Port City Journal volume.",
  icon: ScrollText,
  group: "Journal",
  zodSchema: pcjArticlesSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Article",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "authors", label: "Authors", type: "text", required: true, colSpan: 2 },
        { name: "volume_id", label: "Volume", type: "relation", required: true, relationTo: "pcj-volumes", options: [] },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "pages", label: "Pages", type: "text", placeholder: "23-45" },
        { name: "doi", label: "DOI", type: "text" },
        { name: "publication_date", label: "Publication Date", type: "date", required: true },
        { name: "display_order", label: "Display Order", type: "number" },
      ],
    },
    {
      title: "Content",
      fields: [
        { name: "keywords", label: "Keywords", type: "text", colSpan: 2, placeholder: "AI, Machine Learning, NLP" },
        { name: "abstract", label: "Abstract", type: "textarea", colSpan: 2 },
        { name: "pdf_url", label: "PDF URL", type: "file", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
