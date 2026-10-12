import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

/**
 * The API takes these amounts as strings (`"admissionFeeBDT": "18000"`), so
 * they're validated as numeric text rather than coerced to numbers. `coerce`
 * still accepts a number if a GET ever returns one.
 */
const amount = z.coerce
  .string()
  .trim()
  .min(1, "Amount is required")
  .regex(/^\d+(\.\d{1,2})?$/, "Enter an amount like 18000");

const feeStructuresSchema = z.object({
  admissionFeeBDT: amount,
  admissionFormFeeBDT: amount,
});

export const feeStructuresEntity: EntitySchema<typeof feeStructuresSchema> = {
  slug: "fee-structures",
  title: "Fee Structure",
  description: "Set the standard admission fee amounts.",
  icon: Layers,
  group: "Admission",
  zodSchema: feeStructuresSchema,
  defaultValues: {},
  sections: [
    {
      title: "Fees",
      fields: [
        { name: "admissionFeeBDT", label: "Admission Fee (BDT)", type: "decimal", required: true, placeholder: "18000" },
        { name: "admissionFormFeeBDT", label: "Admission Form Fee (BDT)", type: "decimal", required: true, placeholder: "1000" },
      ],
    },
  ],
};
