import { z } from "zod";
import { requiredUpload } from "./_upload";
import { ClipboardList } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const admissionTestResultsSchema = z.object({
  semesterName: z.string().min(2, "Semester is required").max(255),
  year: z.coerce.number().int().min(2000).max(2100),
  pdfUrl: requiredUpload,
  publishedAt: z.string().min(1, "Publish date is required"),
  isActive: z.boolean().default(true),
});

export const admissionTestResultsEntity: EntitySchema<typeof admissionTestResultsSchema> = {
  slug: "admission-test-results",
  title: "Admission Test Result",
  description: "Publish an admission test result PDF.",
  icon: ClipboardList,
  group: "Admission",
  zodSchema: admissionTestResultsSchema,
  defaultValues: { isActive: true },
  sections: [
    {
      title: "Result",
      fields: [
        { name: "semesterName", label: "Semester", type: "text", required: true, placeholder: "Spring" },
        { name: "year", label: "Year", type: "number", required: true },
        { name: "publishedAt", label: "Publish Date", type: "date", required: true },
        { name: "pdfUrl", label: "Result PDF URL", type: "file", required: true, colSpan: 2 },
        { name: "isActive", label: "Active", type: "switch" },
      ],
    },
  ],
};
