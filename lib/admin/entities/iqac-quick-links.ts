import { z } from "zod";
import { Link2 } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const iqacQuickLinksSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  url: z.string().url("Must be a valid URL"),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.boolean().default(true),
});

export const iqacQuickLinksEntity: EntitySchema<typeof iqacQuickLinksSchema> = {
  slug: "iqac-quick-links",
  title: "IQAC Quick Link",
  description: "Add a quick link shown on the IQAC page.",
  icon: Link2,
  group: "IQAC",
  zodSchema: iqacQuickLinksSchema,
  defaultValues: { status: true },
  sections: [
    {
      title: "Quick Link",
      fields: [
        { name: "name", label: "Label", type: "text", required: true, colSpan: 2, placeholder: "UGC Bangladesh" },
        { name: "url", label: "URL", type: "url", required: true, colSpan: 2 },
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
