import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

// Sent as JSON numbers (`"admissionFeeBDT": 18000`), as the API's POST takes them.
// A blank input arrives as "", which z.coerce would turn into 0 — treat it
// as missing so the field is genuinely required.
const amount = z.preprocess(
  (value) => (value === "" || value === null ? undefined : value),
  z.coerce.number({ error: "Amount is required" }).nonnegative("Amount can't be negative"),
);

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
