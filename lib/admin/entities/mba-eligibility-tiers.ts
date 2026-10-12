import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

/** The API takes these as strings (`"creditsRequired": "40"`). */
const numericText = (label: string) =>
  z.coerce
    .string()
    .trim()
    .min(1, `${label} is required`)
    .regex(/^\d+(\.\d{1,2})?$/, `${label} must be a number`);

const mbaEligibilityTiersSchema = z.object({
  academicBackground: z.string().min(2, "Background is required").max(255),
  creditsRequired: numericText("Credits"),
  perCreditFeeBDT: numericText("Per-credit fee"),
  totalFeeBDT: numericText("Total fee"),
});

export const mbaEligibilityTiersEntity: EntitySchema<typeof mbaEligibilityTiersSchema> = {
  slug: "mba-eligibility-tiers",
  title: "MBA Eligibility Tier",
  description: "Add an MBA credit-requirement tier based on academic background.",
  icon: Layers,
  group: "Admission",
  zodSchema: mbaEligibilityTiersSchema,
  defaultValues: {},
  sections: [
    {
      title: "Tier",
      fields: [
        { name: "academicBackground", label: "Academic Background", type: "text", required: true, colSpan: 2, placeholder: "BSc in EEE" },
        { name: "creditsRequired", label: "Credits Required", type: "decimal", required: true, placeholder: "40" },
        { name: "perCreditFeeBDT", label: "Per-Credit Fee (BDT)", type: "decimal", required: true, placeholder: "2000" },
        { name: "totalFeeBDT", label: "Total Fee (BDT)", type: "decimal", required: true, placeholder: "160000" },
      ],
    },
  ],
};
