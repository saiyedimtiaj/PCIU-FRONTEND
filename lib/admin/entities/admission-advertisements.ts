import { z } from "zod";
import { requiredUpload } from "./_upload";
import { Bell } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const admissionAdvertisementsSchema = z.object({
  semesterName: z.string().min(2, "Semester is required").max(255),
  year: z.coerce.number().int().min(2000).max(2100),
  imageUrl: requiredUpload,
});

export const admissionAdvertisementsEntity: EntitySchema<typeof admissionAdvertisementsSchema> = {
  slug: "admission-advertisements",
  title: "Admission Advertisement",
  description: "Set the admission circular/advertisement image.",
  icon: Bell,
  group: "Admission",
  zodSchema: admissionAdvertisementsSchema,
  defaultValues: {},
  sections: [
    {
      title: "Advertisement",
      fields: [
        { name: "semesterName", label: "Semester", type: "text", required: true, placeholder: "Fall 26" },
        { name: "year", label: "Year", type: "number", required: true, placeholder: "2026" },
        { name: "imageUrl", label: "Advertisement Image", type: "image", required: true, colSpan: 2 },
      ],
    },
  ],
};
