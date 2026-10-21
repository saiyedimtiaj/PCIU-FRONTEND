import { z } from "zod";
import { optionalUpload } from "./_upload";
import { CodeXml } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const optionalUrl = z.string().url("Must be a valid URL").optional().or(z.literal(""));

const developersSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  role: z.string().min(2, "Role is required").max(255),
  student_id: z.string().max(50).optional().or(z.literal("")),
  image: optionalUpload,
  about: z.string().optional().or(z.literal("")),
  github: z.string().max(255).optional().or(z.literal("")),
  linkedin: optionalUrl,
  facebook: optionalUrl,
  portfolio: optionalUrl,
  contributions: z.array(z.string()).default([]),
  display_order: z.coerce.number().int().nonnegative().default(0),
  status: z.boolean().default(true),
});

export const developersEntity: EntitySchema<typeof developersSchema> = {
  slug: "developers",
  title: "Developer",
  description: "Add a member of the web development team shown on the public Developers page.",
  icon: CodeXml,
  group: "Content",
  zodSchema: developersSchema,
  defaultValues: { status: true, contributions: [] },
  sections: [
    {
      title: "Developer",
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true },
        { name: "role", label: "Role", type: "text", required: true, placeholder: "Frontend Developer" },
        { name: "student_id", label: "Student ID", type: "text" },
        { name: "image", label: "Photo", type: "image", colSpan: 2 },
        { name: "about", label: "About", type: "textarea", colSpan: 2 },
        { name: "contributions", label: "Contributions", type: "json-list", colSpan: 2, placeholder: "Built the admission application form" },
      ],
    },
    {
      title: "Links",
      fields: [
        { name: "github", label: "GitHub Username or URL", type: "text", placeholder: "octocat" },
        { name: "linkedin", label: "LinkedIn", type: "url" },
        { name: "facebook", label: "Facebook", type: "url" },
        { name: "portfolio", label: "Portfolio", type: "url" },
        { name: "display_order", label: "Display Order", type: "number" },
        { name: "status", label: "Active", type: "switch" },
      ],
    },
  ],
};
