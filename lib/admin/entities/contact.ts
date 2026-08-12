import { z } from "zod";
import { Phone } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const contactSchema = z.object({
  office_name: z.string().min(2, "Office name is required").max(255),
  address: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().min(2, "Phone is required").max(255),
  email: z.string().email("Must be a valid email").max(255),
  map_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  display_order: z.coerce.number().int().nonnegative().default(0),
  contact_person: z.string().max(255).optional().or(z.literal("")),
  available_hours: z.string().max(255).optional().or(z.literal("")),
  type: z.enum(["department", "Security", "Medical", "Administration", "inquiries", "iqac", "journal"]),
  status: z.boolean().default(true),
});

export const contactEntity: EntitySchema<typeof contactSchema> = {
  slug: "contact",
  title: "Contact",
  description: "Add a contact entry shown on the Contact page.",
  icon: Phone,
  group: "System",
  zodSchema: contactSchema,
  defaultValues: { type: "inquiries", status: true, display_order: 0 },
  sections: [
    {
      title: "Contact",
      fields: [
        { name: "office_name", label: "Office / Contact Name", type: "text", required: true, colSpan: 2 },
        {
          name: "type",
          label: "Type",
          type: "enum",
          required: true,
          options: [
            { label: "Department", value: "department" },
            { label: "Security", value: "Security" },
            { label: "Medical", value: "Medical" },
            { label: "Administration", value: "Administration" },
            { label: "Inquiries", value: "inquiries" },
            { label: "IQAC", value: "iqac" },
            { label: "Journal", value: "journal" },
          ],
        },
        { name: "contact_person", label: "Contact Person", type: "text" },
        { name: "phone", label: "Phone", type: "tel", required: true },
        { name: "email", label: "Email", type: "email", required: true },
        { name: "available_hours", label: "Available Hours", type: "text", placeholder: "Sun - Thu: 9:00 AM - 5:00 PM" },
        { name: "address", label: "Address", type: "textarea", colSpan: 2 },
        { name: "map_url", label: "Map URL", type: "url" },
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
