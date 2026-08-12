import { z } from "zod";
import { BookMarked } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const researchPublicationsSchema = z.object({
  department_id: z.string().min(1, "Department is required"),
  teacher_id: z.string().optional().or(z.literal("")),
  title: z.string().min(2, "Title is required").max(255),
  authors: z.string().min(2, "Authors are required").max(255),
  venue: z.string().max(255).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1950).max(2100),
  type: z.string().min(1, "Type is required"),
  external_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  abstract: z.string().optional().or(z.literal("")),
  pdf_file: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  status: z.enum(["draft", "published"]),
});

export const researchPublicationsEntity: EntitySchema<typeof researchPublicationsSchema> = {
  slug: "research-publications",
  title: "Research Publication",
  description: "Add a published research paper or article.",
  icon: BookMarked,
  group: "Research",
  zodSchema: researchPublicationsSchema,
  defaultValues: { status: "published" },
  sections: [
    {
      title: "Publication",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "authors", label: "Authors", type: "text", required: true, colSpan: 2 },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "teacher_id", label: "Lead Author (Teacher)", type: "relation", relationTo: "teacher", options: [] },
        { name: "venue", label: "Venue", type: "text", placeholder: "IEEE ICCIT" },
        { name: "year", label: "Year", type: "number", required: true },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { label: "Journal", value: "Journal" },
            { label: "Conference", value: "Conference" },
            { label: "Book Chapter", value: "Book Chapter" },
          ],
        },
      ],
    },
    {
      title: "Content",
      fields: [
        { name: "abstract", label: "Abstract", type: "textarea", colSpan: 2 },
        { name: "external_link", label: "External Link", type: "url" },
        { name: "pdf_file", label: "PDF File URL", type: "file" },
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
        },
      ],
    },
  ],
};
