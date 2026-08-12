import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const membershipSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  name: z.string().min(2, "Organization name is required").max(255),
  role: z.string().max(255).optional().or(z.literal("")),
  membership_order: z.coerce.number().int().nonnegative().default(0),
});

export const membershipEntity: EntitySchema<typeof membershipSchema> = {
  slug: "membership",
  title: "Membership Entry",
  description: "Add a professional membership/affiliation to a teacher's profile.",
  icon: Users,
  group: "People",
  zodSchema: membershipSchema,
  defaultValues: { membership_order: 0 },
  sections: [
    {
      title: "Membership",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "name", label: "Organization", type: "text", required: true, colSpan: 2 },
        { name: "role", label: "Role", type: "text" },
        { name: "membership_order", label: "Display Order", type: "number" },
      ],
    },
  ],
};
