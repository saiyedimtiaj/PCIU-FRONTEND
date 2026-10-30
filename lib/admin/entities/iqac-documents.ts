import { z } from "zod";
import { FileText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";
import { requiredUpload } from "./_upload";

// Mirrors /iqac/documents exactly: { id, title, type, pdfFile }.
const iqacDocumentsSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  type: z.string().min(1, "Type is required").max(255),
  pdfFile: requiredUpload,
});

export const iqacDocumentsEntity: EntitySchema<typeof iqacDocumentsSchema> = {
  slug: "iqac-documents",
  title: "IQAC Document",
  description: "Add a downloadable IQAC document (PDF).",
  icon: FileText,
  group: "IQAC",
  zodSchema: iqacDocumentsSchema,
  defaultValues: {},
  sections: [
    {
      title: "Document",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2, placeholder: "IQAC Annual Report 2026" },
        { name: "type", label: "Type", type: "text", required: true, placeholder: "Annual Report" },
        { name: "pdfFile", label: "PDF File", type: "file", required: true, colSpan: 2 },
      ],
    },
  ],
};
