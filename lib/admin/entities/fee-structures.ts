import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const feeStructuresSchema = z.object({
  admissionFeeBDT: z.coerce.number().nonnegative("Amount can't be negative"),
  admissionFormFeeBDT: z.coerce.number().nonnegative("Amount can't be negative"),
});

export const feeStructuresEntity: EntitySchema<typeof feeStructuresSchema> = {
  slug: "fee-structures",
  title: "Fee Structure",
  description: "Add the standard admission fee amounts.",
  icon: Layers,
  group: "Admission",
  zodSchema: feeStructuresSchema,
  defaultValues: {},
  sections: [
    {
      title: "Fees",
      fields: [
        { name: "admissionFeeBDT", label: "Admission Fee (BDT)", type: "decimal", required: true },
        { name: "admissionFormFeeBDT", label: "Admission Form Fee (BDT)", type: "decimal", required: true },
      ],
    },
  ],
};
