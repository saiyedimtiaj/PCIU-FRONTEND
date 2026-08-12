import { z } from "zod";
import { GraduationCap } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const teacherSchema = z.object({
  name: z.string().min(2, "Name is required").max(255),
  slug: z.string().min(2, "Slug is required").max(255),
  designation: z.string().min(2, "Designation is required").max(255),
  faculty_id: z.string().min(1, "Faculty is required"),
  department_id: z.string().min(1, "Department is required"),
  office: z.string().max(255).optional().or(z.literal("")),
  image_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  short_bio: z.string().max(1000).optional().or(z.literal("")),
  bio: z.string().optional().or(z.literal("")),
  teaching_areas: z.array(z.string()).default([]),
  google_scholar_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  researchgate_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  linkedin_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  facebook_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  twitter_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  website_url: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  is_study_leave: z.boolean().default(false),
  leave_period: z.string().max(255).optional().or(z.literal("")),
  is_vc: z.boolean().default(false),
  is_management: z.boolean().default(false),
});

export const teacherEntity: EntitySchema<typeof teacherSchema> = {
  slug: "teacher",
  title: "Teacher",
  description: "Add a faculty/staff profile shown on the public faculty directory.",
  icon: GraduationCap,
  group: "People",
  zodSchema: teacherSchema,
  defaultValues: {
    teaching_areas: [],
    is_study_leave: false,
    is_vc: false,
    is_management: false,
  },
  sections: [
    {
      title: "Identity",
      fields: [
        { name: "name", label: "Full Name", type: "text", required: true, placeholder: "Dr. Jane Doe" },
        { name: "slug", label: "Slug", type: "text", required: true, placeholder: "jane-doe", helper: "Used in the profile URL." },
        { name: "designation", label: "Designation", type: "text", required: true, placeholder: "Associate Professor" },
        { name: "office", label: "Office", type: "text", placeholder: "Room 402, Admin Building" },
        {
          name: "faculty_id",
          label: "Faculty",
          type: "relation",
          required: true,
          relationTo: "faculty",
          options: [
            { label: "Faculty of Science and Engineering", value: "1" },
            { label: "Faculty of Business Studies", value: "2" },
            { label: "Faculty of Humanities, Social Sciences & Law", value: "3" },
          ],
        },
        {
          name: "department_id",
          label: "Department",
          type: "relation",
          required: true,
          relationTo: "department",
          options: [
            { label: "Computer Science and Engineering", value: "1" },
            { label: "Electrical and Electronic Engineering", value: "2" },
            { label: "Civil Engineering", value: "3" },
            { label: "Business Administration", value: "4" },
            { label: "English", value: "5" },
            { label: "Law", value: "6" },
          ],
        },
        { name: "image_url", label: "Photo URL", type: "image", colSpan: 2 },
      ],
    },
    {
      title: "Profile",
      fields: [
        { name: "short_bio", label: "Short Bio", type: "textarea", colSpan: 2, helper: "Brief summary shown on directory cards." },
        { name: "bio", label: "Full Biography", type: "richtext", colSpan: 2 },
        {
          name: "teaching_areas",
          label: "Teaching Areas",
          type: "json-list",
          colSpan: 2,
          placeholder: "e.g. Machine Learning",
          helper: "Add one teaching area per row.",
        },
      ],
    },
    {
      title: "Links",
      fields: [
        { name: "google_scholar_url", label: "Google Scholar", type: "url" },
        { name: "researchgate_url", label: "ResearchGate", type: "url" },
        { name: "linkedin_url", label: "LinkedIn", type: "url" },
        { name: "facebook_url", label: "Facebook", type: "url" },
        { name: "twitter_url", label: "Twitter / X", type: "url" },
        { name: "website_url", label: "Personal Website", type: "url" },
      ],
    },
    {
      title: "Status",
      fields: [
        { name: "is_study_leave", label: "On Study Leave", type: "switch" },
        { name: "leave_period", label: "Leave Period", type: "text", placeholder: "Jan 2026 – Dec 2026" },
        { name: "is_vc", label: "Vice Chancellor", type: "switch", helper: "Marks this profile as the university's VC." },
        { name: "is_management", label: "Management Member", type: "switch", helper: "Also appears on the Management page." },
      ],
    },
  ],
};
