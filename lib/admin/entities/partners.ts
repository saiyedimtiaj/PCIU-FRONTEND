import { z } from "zod";
import { Handshake } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const partnersSchema = z.object({
  department_id: z.string().optional().or(z.literal("")),
  name: z.string().min(2, "Name is required").max(255),
  logo: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  country: z.string().max(255).optional().or(z.literal("")),
  category: z.string().min(1, "Category is required"),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.enum(["draft", "published"]),
});

export const partnersEntity: EntitySchema<typeof partnersSchema> = {
  slug: "partners",
  title: "Partner",
  description: "Add an academic, industry, or cultural partner institution.",
  icon: Handshake,
  group: "Research",
  zodSchema: partnersSchema,
  defaultValues: { status: "published" },
  sections: [
    {
      title: "Partner",
      fields: [
        { name: "name", label: "Partner Name", type: "text", required: true, colSpan: 2 },
        { name: "country", label: "Country", type: "text" },
        {
          name: "category",
          label: "Category",
          type: "select",
          required: true,
          options: [
            { label: "Academic", value: "Academic" },
            { label: "Industry", value: "Industry" },
            { label: "International", value: "International" },
            { label: "Cultural", value: "Cultural" },
          ],
        },
        {
          name: "department_id",
          label: "Related Department",
          type: "relation",
          relationTo: "department",
          options: [{ label: "Computer Science and Engineering", value: "1" }],
        },
        { name: "logo", label: "Logo URL", type: "image" },
        { name: "website_url", label: "Website", type: "url" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
        { name: "display_order", label: "Display Order", type: "number" },
        {
          name: "status",
          label: "Status",
          type: "enum",
          required: true,
          options: [
            { label: "Draft", value: "draft" },
            { label: "Published", value: "published" },
          ],
        },
      ],
    },
  ],
};
