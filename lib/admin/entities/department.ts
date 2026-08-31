import { z } from "zod";
import { optionalUpload } from "./_upload";
import { Building2 } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const departmentSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  short_name: z.string().max(255).optional().or(z.literal("")),
  slug: z.string().min(2, "Slug is required").max(255),
  faculty_id: z.string().min(1, "Faculty is required"),
  chairman_id: z.string().optional().or(z.literal("")),
  title: z.string().max(255).optional().or(z.literal("")),
  subtitle: z.string().max(255).optional().or(z.literal("")),
  phone: z.string().max(255).optional().or(z.literal("")),
  email: z.email("Must be a valid email").optional().or(z.literal("")),
  image: optionalUpload,
  office_location: z.string().max(255).optional().or(z.literal("")),
  graduate: z.coerce.number().int().nonnegative().optional(),
  number_of_research: z.coerce.number().int().nonnegative().optional(),
  number_of_partner: z.coerce.number().int().nonnegative().optional(),
  current_student: z.coerce.number().int().nonnegative().optional(),
  description: z.string().optional().or(z.literal("")),
  quick_link: z.array(z.string()).default([]),
  status: z.boolean().default(true),
});

export const departmentEntity: EntitySchema<typeof departmentSchema> = {
  slug: "department",
  title: "Department",
  description: "Add an academic department under a faculty.",
  icon: Building2,
  group: "Academics",
  zodSchema: departmentSchema,
  defaultValues: { quick_link: [], status: true },
  sections: [
    {
      title: "Identity",
      fields: [
        {
          name: "name",
          label: "Department Name",
          type: "text",
          required: true,
          colSpan: 2,
        },
        {
          name: "short_name",
          label: "Short Name",
          type: "text",
          placeholder: "CSE",
        },
        { name: "slug", label: "Slug", type: "text", required: true },
        {
          name: "faculty_id",
          label: "Faculty",
          type: "relation",
          required: true,
          relationTo: "faculty",
          options: [
            { label: "Faculty of Science and Engineering", value: "1" },
            { label: "Faculty of Business Studies", value: "2" },
            {
              label: "Faculty of Humanities, Social Sciences & Law",
              value: "3",
            },
          ],
        },
        {
          name: "chairman_id",
          label: "Chairman",
          type: "relation",
          relationTo: "teacher",
          options: [],
        },
        { name: "title", label: "Title", type: "text" },
        { name: "subtitle", label: "Subtitle", type: "text" },
      ],
    },
    {
      title: "Contact",
      fields: [
        { name: "phone", label: "Phone", type: "tel" },
        { name: "email", label: "Email", type: "email", immutableOnEdit: true },
        {
          name: "office_location",
          label: "Office Location",
          type: "text",
          colSpan: 2,
        },
        { name: "image", label: "Cover Image URL", type: "image", colSpan: 2 },
      ],
    },
    {
      title: "Content",
      fields: [
        {
          name: "description",
          label: "Description",
          type: "richtext",
          colSpan: 2,
        },
        {
          name: "quick_link",
          label: "Quick Links",
          type: "json-list",
          colSpan: 2,
          placeholder: "Course Curriculum",
        },
      ],
    },
    {
      title: "Statistics",
      fields: [
        { name: "graduate", label: "Graduates", type: "number" },
        {
          name: "number_of_research",
          label: "Number of Research",
          type: "number",
        },
        {
          name: "number_of_partner",
          label: "Number of Partners",
          type: "number",
        },
        { name: "current_student", label: "Current Students", type: "number" },
      ],
    },
    {
      title: "Status",
      fields: [{ name: "status", label: "Active", type: "switch" }],
    },
  ],
};
