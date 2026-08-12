import { z } from "zod";
import { FileText } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const mousSchema = z.object({
  partner_id: z.string().min(1, "Partner is required"),
  date_signed: z.string().min(1, "Signing date is required"),
  scope_of_collaboration: z.string().min(2, "Scope is required"),
  document_pdf: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  validity_expiry_date: z.string().optional().or(z.literal("")),
  status: z.enum(["active", "expired"]),
});

export const mousEntity: EntitySchema<typeof mousSchema> = {
  slug: "mous",
  title: "MoU",
  description: "Add a Memorandum of Understanding with a partner.",
  icon: FileText,
  group: "Research",
  zodSchema: mousSchema,
  defaultValues: { status: "active" },
  sections: [
    {
      title: "MoU",
      fields: [
        { name: "partner_id", label: "Partner", type: "relation", required: true, relationTo: "partners", options: [] },
        { name: "date_signed", label: "Date Signed", type: "date", required: true },
        { name: "validity_expiry_date", label: "Expiry Date", type: "date" },
        { name: "scope_of_collaboration", label: "Scope of Collaboration", type: "textarea", required: true, colSpan: 2 },
        { name: "document_pdf", label: "Document PDF URL", type: "file", colSpan: 2 },
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          options: [
            { label: "Active", value: "active" },
            { label: "Expired", value: "expired" },
          ],
        },
      ],
    },
  ],
};
