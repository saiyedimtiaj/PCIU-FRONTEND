import { z } from "zod";
import { FileText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const iqacDocumentsSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  file_url: z.string().url("Must be a valid URL"),
  file_type: z.string().min(1, "File type is required"),
  file_size: z.string().max(255).optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.boolean().default(true),
});

export const iqacDocumentsEntity: EntitySchema<typeof iqacDocumentsSchema> = {
  slug: "iqac-documents",
  title: "IQAC Document",
  description: "Add a downloadable IQAC document.",
  icon: FileText,
  group: "IQAC",
  zodSchema: iqacDocumentsSchema,
  defaultValues: { file_type: "PDF", status: true },
  sections: [
    {
      title: "Document",
      fields: [
        { name: "name", label: "Document Name", type: "text", required: true, colSpan: 2 },
        { name: "file_url", label: "File URL", type: "file", required: true, colSpan: 2 },
        {
          name: "file_type",
          label: "File Type",
          type: "select",
          required: true,
          options: [{ label: "PDF", value: "PDF" }],
        },
        { name: "file_size", label: "File Size", type: "text", placeholder: "2.5 MB" },
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
