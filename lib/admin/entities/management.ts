import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";
import { optionalUpload } from "./_upload";

const managementSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  img: optionalUpload,
  designation: z.string().max(5000).optional().or(z.literal("")),
  management_role: z.string().max(100).optional().or(z.literal("")),
  type_id: z.string().min(1, "Management type is required"),
  status: z.boolean().default(true),
});

export const managementEntity: EntitySchema<typeof managementSchema> = {
  slug: "management",
  title: "Management Member",
  description: "Add a member to a management body (Syndicate, Academic Council, ...).",
  icon: Users,
  group: "IQAC",
  zodSchema: managementSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Member",
      fields: [
        { name: "name", label: "Name", type: "text", required: true, placeholder: "Mr. Zahirul Islam" },
        {
          name: "type_id",
          label: "Management Type",
          type: "relation",
          required: true,
          relationTo: "management-type",
          options: [],
        },
        {
          name: "designation",
          label: "Designation / Short Bio",
          type: "textarea",
          colSpan: 2,
          placeholder: "Govt Nominated — or a short bio",
        },
        { name: "management_role", label: "Role", type: "text", placeholder: "Member" },
        { name: "img", label: "Photo", type: "image", colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
