import { z } from "zod";
import { GraduationCap } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const educationSchema = z.object({
  teacher_id: z.string().min(1, "Teacher is required"),
  degree: z.string().min(2, "Degree is required").max(255),
  institution: z.string().min(2, "Institution is required").max(255),
  education_year: z.string().min(1, "Year is required"),
  edu_order: z.coerce.number().int().nonnegative().default(0),
});

export const educationEntity: EntitySchema<typeof educationSchema> = {
  slug: "education",
  title: "Education Entry",
  description: "Add a degree/education record to a teacher's profile.",
  icon: GraduationCap,
  group: "People",
  zodSchema: educationSchema,
  defaultValues: { edu_order: 0 },
  sections: [
    {
      title: "Education",
      fields: [
        { name: "teacher_id", label: "Teacher", type: "relation", required: true, relationTo: "teacher", options: [] },
        { name: "degree", label: "Degree", type: "text", required: true, placeholder: "PhD" },
        { name: "institution", label: "Institution", type: "text", required: true, colSpan: 2 },
        { name: "education_year", label: "Year", type: "date", required: true },
        { name: "edu_order", label: "Display Order", type: "number" },
      ],
    },
  ],
};
