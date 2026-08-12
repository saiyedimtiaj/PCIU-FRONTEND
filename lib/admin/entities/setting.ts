import { z } from "zod";
import { Settings2 } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const settingSchema = z.object({
  page_id: z.string().optional().or(z.literal("")),
  key: z.string().min(1, "Key is required").max(255),
  value: z.string().min(1, "Value is required"),
  pages: z.string().max(255).optional().or(z.literal("")),
  status: z.boolean().default(true),
});

export const settingEntity: EntitySchema<typeof settingSchema> = {
  slug: "setting",
  title: "Setting",
  description: "Add a key/value site setting, optionally scoped to a page.",
  icon: Settings2,
  group: "System",
  zodSchema: settingSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Setting",
      fields: [
        { name: "key", label: "Key", type: "text", required: true, placeholder: "site_tagline" },
        { name: "pages", label: "Scope (page path)", type: "text", placeholder: "/" },
        { name: "page_id", label: "Related Page", type: "relation", relationTo: "pages", options: [] },
        { name: "value", label: "Value", type: "textarea", required: true, colSpan: 2 },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
