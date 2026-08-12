import { z } from "zod";
import { Bell } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const admissionAdvertisementsSchema = z.object({
  semesterName: z.string().min(2, "Semester is required").max(255),
  year: z.coerce.number().int().min(2000).max(2100),
  imageUrl: z.string().url("Must be a valid URL"),
  isActive: z.boolean().default(true),
});

export const admissionAdvertisementsEntity: EntitySchema<typeof admissionAdvertisementsSchema> = {
  slug: "admission-advertisements",
  title: "Admission Advertisement",
  description: "Add an admission circular/advertisement image.",
  icon: Bell,
  group: "Admission",
  zodSchema: admissionAdvertisementsSchema,
  defaultValues: { isActive: true },
  sections: [
    {
      title: "Advertisement",
      fields: [
        { name: "semesterName", label: "Semester", type: "text", required: true, placeholder: "Spring" },
        { name: "year", label: "Year", type: "number", required: true },
        { name: "imageUrl", label: "Advertisement Image URL", type: "image", required: true, colSpan: 2 },
        { name: "isActive", label: "Active", type: "switch" },
      ],
    },
  ],
};
