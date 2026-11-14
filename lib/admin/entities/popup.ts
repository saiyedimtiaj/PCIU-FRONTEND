import { z } from "zod";
import { MessageSquare } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const popupLink = z
  .string()
  .trim()
  .max(2048, "Link is too long")
  .refine((value) => {
    if (value === "") return true;

    // Same-site popup links should be concise (`/admission/apply`) and must
    // not accept protocol-relative URLs (`//example.com`), which look local
    // but navigate to another origin.
    if (value.startsWith("/") && !value.startsWith("//")) return true;

    try {
      const url = new URL(value);
      return url.protocol === "http:" || url.protocol === "https:";
    } catch {
      return false;
    }
  }, "Use a path like /home or a full http(s) URL");

const popupSchema = z.object({
  title: z.string().min(2, "Title is required").max(255),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  description: z.string().optional().or(z.literal("")),
  button_text: z.string().max(100).optional().or(z.literal("")),
  link: popupLink.optional(),
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
        {
          name: "link",
          label: "Button Link",
          type: "url",
          placeholder: "/admission/apply or https://...",
          helper: "Use /path for a page on this website, or enter a full URL for another site.",
        },
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
