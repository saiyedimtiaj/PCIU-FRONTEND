import { z } from "zod";
import { MessageSquare } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const popupSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  button_text: z.string().max(100).optional().or(z.literal("")),
  link: z.url("Must be a valid URL").optional().or(z.literal("")),
  type: z.string().min(1, "Type is required"),
  status: z.boolean().default(true),
});

export const popupEntity: EntitySchema<typeof popupSchema> = {
  slug: "popup",
  title: "Popup",
  pluralTitle: "Popup",
  description: "The promotional popup shown to visitors on the public site.",
  icon: MessageSquare,
  group: "System",
  zodSchema: popupSchema,
  defaultValues: { status: true, type: "TEXT" },
  sections: [
    {
      title: "Content",
      description: "Only one popup is active at a time.",
      fields: [
        { name: "title", label: "Title", type: "text", required: true, colSpan: 2 },
        { name: "subtitle", label: "Subtitle", type: "text", colSpan: 2 },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ],
    },
    {
      title: "Call to Action",
      fields: [
        { name: "button_text", label: "Button Text", type: "text", placeholder: "Apply Now" },
        { name: "link", label: "Button Link", type: "url", placeholder: "https://..." },
        {
          name: "type",
          label: "Type",
          type: "select",
          required: true,
          options: [
            { label: "Text", value: "TEXT" },
            { label: "Image", value: "IMAGE" },
          ],
        },
        { name: "status", label: "Active", type: "switch", helper: "Show this popup on the public site." },
      ],
    },
  ],
};
