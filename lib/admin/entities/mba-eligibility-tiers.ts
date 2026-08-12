import { z } from "zod";
import { Layers } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const mbaEligibilityTiersSchema = z.object({
  academicBackground: z.string().min(2, "Background is required").max(255),
  creditsRequired: z.coerce.number().positive("Credits must be greater than 0"),
  perCreditFeeBDT: z.coerce.number().nonnegative("Amount can't be negative"),
  totalFeeBDT: z.coerce.number().nonnegative("Amount can't be negative"),
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
        { name: "academicBackground", label: "Academic Background", type: "text", required: true, colSpan: 2, placeholder: "BBA" },
        { name: "creditsRequired", label: "Credits Required", type: "decimal", required: true },
        { name: "perCreditFeeBDT", label: "Per-Credit Fee (BDT)", type: "decimal", required: true },
        { name: "totalFeeBDT", label: "Total Fee (BDT)", type: "decimal", required: true },
      ],
    },
  ],
};
