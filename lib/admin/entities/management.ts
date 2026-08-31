import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const managementSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  designation: z.string().min(2, "Designation is required").max(100),
  management_role: z.string().max(100).optional().or(z.literal("")),
  types: z.enum(["SYNDICATE", "ACADEMIC_COUNCIL", "PROCTORIAL_BODIES"]),
  status: z.boolean().default(true),
  iqac_order: z.coerce.number().int().nonnegative().default(0),
});

export const managementEntity: EntitySchema<typeof managementSchema> = {
  slug: "management",
  title: "Management Member",
  description: "Add a member of the Syndicate, Academic Council, or Proctorial Bodies.",
  icon: Users,
  group: "IQAC",
  zodSchema: managementSchema,
  defaultValues: { types: "SYNDICATE", status: true, iqac_order: 0 },
  sections: [
    {
      title: "Member",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "designation", label: "Designation", type: "text", required: true, placeholder: "Vice Chancellor, PCIU" },
        { name: "management_role", label: "Role", type: "text", placeholder: "Chairman" },
        {
          name: "types",
          label: "Body",
          type: "enum",
          required: true,
          options: [
            { label: "Syndicate", value: "SYNDICATE" },
            { label: "Academic Council", value: "ACADEMIC_COUNCIL" },
            { label: "Proctorial Bodies", value: "PROCTORIAL_BODIES" },
          ],
        },
        { name: "iqac_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
