import { z } from "zod";
import { Menu as MenuIcon } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const menusSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  parent_id: z.string().optional().or(z.literal("")),
  location: z.enum(["header", "top_header", "footer"]),
  type: z.enum(["Academics", "Admissions"]).optional().or(z.literal("")),
  is_active: z.boolean().default(true),
});

export const menusEntity: EntitySchema<typeof menusSchema> = {
  slug: "menus",
  title: "Menu Item",
  description: "Add a navigation menu item, optionally nested under a parent.",
  icon: MenuIcon,
  group: "Content",
  zodSchema: menusSchema,
  defaultValues: { location: "header", is_active: true },
  sections: [
    {
      title: "Menu Item",
      fields: [
        { name: "name", label: "Label", type: "text", required: true, colSpan: 2 },
        { name: "slug", label: "Slug / Path", type: "text", required: true },
        { name: "parent_id", label: "Parent Item", type: "relation", relationTo: "menus", options: [] },
        {
          name: "location",
          label: "Location",
          type: "enum",
          required: true,
          options: [
            { label: "Header", value: "header" },
            { label: "Top Header", value: "top_header" },
            { label: "Footer", value: "footer" },
          ],
        },
        {
          name: "type",
          label: "Menu Type",
          type: "select",
          options: [
            { label: "Academics", value: "Academics" },
            { label: "Admissions", value: "Admissions" },
          ],
        },
        { name: "is_active", label: "Active", type: "switch" },
      ],
    },
  ],
};
