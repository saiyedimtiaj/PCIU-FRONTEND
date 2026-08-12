import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const managementSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  degination: z.string().min(2, "Designation is required").max(100),
  management_role: z.string().max(100).optional().or(z.literal("")),
  types: z.enum(["syndicate", "Academinc Council", "Proctorial Bodies"]),
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
  defaultValues: { types: "syndicate", status: true, iqac_order: 0 },
  sections: [
    {
      title: "Member",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "degination", label: "Designation", type: "text", required: true, placeholder: "Vice Chancellor, PCIU" },
        { name: "management_role", label: "Role", type: "text", placeholder: "Chairman" },
        {
          name: "types",
          label: "Body",
          type: "enum",
          required: true,
          options: [
            { label: "Syndicate", value: "syndicate" },
            { label: "Academic Council", value: "Academinc Council" },
            { label: "Proctorial Bodies", value: "Proctorial Bodies" },
          ],
        },
        { name: "iqac_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
