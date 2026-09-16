import { z } from "zod";
import { optionalUpload } from "./_upload";
import { BookMarked } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const teacherPublicationSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  department_id: z.string().min(1, "Department is required"),
  title: z.string().min(2, "Title is required").max(255),
  authors: z.string().max(255).optional().or(z.literal("")),
  venue: z.string().max(255).optional().or(z.literal("")),
  year: z.coerce.number().int().min(1950).max(2100).optional(),
  type: z.string().min(1, "Type is required"),
  external_link: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  abstract: z.string().optional().or(z.literal("")),
  status: z.boolean().default(true),
  pdf_file: optionalUpload,
});

export const teacherPublicationEntity: EntitySchema<typeof teacherPublicationSchema> = {
  slug: "teacher-publication",
  title: "Publication",
  pluralTitle: "Publications",
  description: "Add a research publication to a teacher's profile.",
  icon: BookMarked,
  group: "People",
  zodSchema: teacherPublicationSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Publication",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "authors", label: "Authors", type: "text", colSpan: 2, placeholder: "Dr Jane Doe, Dr XYZ" },
        { name: "venue", label: "Venue", type: "text", placeholder: "IEEE ICCIT" },
        { name: "year", label: "Year", type: "number" },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { label: "Journal Article", value: "Journal Article" },
            { label: "Conference Paper", value: "Conference Paper" },
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
        { name: "pdf_file", label: "PDF File", type: "file" },
        { name: "status", label: "Published", type: "switch" },
      ],
    },
  ],
};
