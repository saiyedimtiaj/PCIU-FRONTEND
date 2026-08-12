import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const iqacCommitteeSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  degination: z.string().min(2, "Designation is required").max(100),
  status: z.boolean().default(true),
  iqac_order: z.coerce.number().int().nonnegative().default(0),
});

export const iqacCommitteeEntity: EntitySchema<typeof iqacCommitteeSchema> = {
  slug: "iqac-committee",
  title: "IQAC Committee Member",
  description: "Add a member to the IQAC committee.",
  icon: Users,
  group: "IQAC",
  zodSchema: iqacCommitteeSchema,
  defaultValues: { status: true, iqac_order: 0 },
  sections: [
    {
      title: "Committee Member",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "degination", label: "Committee Designation", type: "text", required: true, placeholder: "Chairman" },
        { name: "iqac_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
