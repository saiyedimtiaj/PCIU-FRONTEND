import { z } from "zod";
import { Users } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";
import { optionalUpload } from "./_upload";

// Field names follow the POST /clubs form-data keys exactly — including the
// all-lowercase `socialmedia` and `sortorder`.
const clubsSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z
    .string()
    .min(2, "Slug is required")
    .max(255)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Use lowercase letters, numbers and hyphens"),
  bannerImage: optionalUpload,
  logo: optionalUpload,
  description: z.string().optional().or(z.literal("")),
  website: z.url("Must be a valid URL").optional().or(z.literal("")),
  // Sent as a JSON string: [{ "title": "Facebook", "url": "https://…" }]
  socialmedia: z.preprocess(
    (value) => value ?? [],
    z.array(
      z.object({
        title: z.string().min(1, "Platform is required"),
        url: z.url("Must be a valid URL"),
      }),
    ),
  ),
  department_id: z.string().optional().or(z.literal("")),
  sortorder: z.coerce.number().int().nonnegative().default(0),
  isActive: z.boolean().default(true),
});

export const clubsEntity: EntitySchema<typeof clubsSchema> = {
  slug: "clubs",
  title: "Club",
  description: "Add a student club or forum shown on the public Clubs page.",
  icon: Users,
  group: "Content",
  zodSchema: clubsSchema,
  defaultValues: { socialmedia: [], sortorder: 0, isActive: true },
  sections: [
    {
      title: "Club",
      fields: [
        { name: "name", label: "Club Name", type: "text", required: true, placeholder: "PCIU Computer Club" },
        { name: "slug", label: "Slug", type: "text", required: true, placeholder: "pciu-computer-club" },
        { name: "department_id", label: "Department", type: "relation", relationTo: "department", options: [] },
        { name: "website", label: "Website", type: "url", placeholder: "https://pciucomputerclub.com" },
        { name: "description", label: "Description", type: "textarea", colSpan: 2 },
      ],
    },
    {
      title: "Images",
      fields: [
        { name: "logo", label: "Logo", type: "image" },
        { name: "bannerImage", label: "Banner Image", type: "image" },
      ],
    },
    {
      title: "Social Media",
      description: "Links shown on the club's public page.",
      fields: [
        { name: "socialmedia", label: "Social Media Links", type: "link-list", colSpan: 2, placeholder: "Facebook" },
      ],
    },
    {
      title: "Display",
      fields: [
        { name: "sortorder", label: "Sort Order", type: "number", placeholder: "1" },
        { name: "isActive", label: "Active", type: "switch" },
      ],
    },
  ],
};
