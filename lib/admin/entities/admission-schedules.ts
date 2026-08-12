import { z } from "zod";
import { CalendarDays } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

const admissionSchedulesSchema = z.object({
  semesterName: z.string().min(2, "Semester is required").max(255),
  year: z.coerce.number().int().min(2000).max(2100),
  programLevel: z.string().min(1, "Program level is required"),
  applicationStartDate: z.string().min(1, "Required"),
  directAdmissionDeadline: z.string().optional().or(z.literal("")),
  writtenApplicationDeadline: z.string().optional().or(z.literal("")),
  writtenTestDate: z.string().optional().or(z.literal("")),
  testResultDate: z.string().optional().or(z.literal("")),
  admissionWindowStart: z.string().min(1, "Required"),
  admissionWindowEnd: z.string().min(1, "Required"),
  courseRegistrationStart: z.string().optional().or(z.literal("")),
  courseRegistrationEnd: z.string().optional().or(z.literal("")),
  classStartDate: z.string().min(1, "Required"),
  orientationDate: z.string().max(255).optional().or(z.literal("")),
  isActive: z.boolean().default(true),
});

export const admissionSchedulesEntity: EntitySchema<typeof admissionSchedulesSchema> = {
  slug: "admission-schedules",
  title: "Admission Schedule",
  description: "Add the full admission timeline for a semester.",
  icon: CalendarDays,
  group: "Admission",
  zodSchema: admissionSchedulesSchema,
  defaultValues: { isActive: true },
  sections: [
    {
      title: "Semester",
      fields: [
        { name: "semesterName", label: "Semester", type: "text", required: true, placeholder: "Spring" },
        { name: "year", label: "Year", type: "number", required: true },
        {
          name: "programLevel",
          label: "Program Level",
          type: "select",
          required: true,
          options: [
            { label: "Undergraduate", value: "undergraduate" },
            { label: "Graduate", value: "graduate" },
          ],
        },
      ],
    },
    {
      title: "Application Window",
      fields: [
        { name: "applicationStartDate", label: "Application Start", type: "date", required: true },
        { name: "directAdmissionDeadline", label: "Direct Admission Deadline", type: "date" },
        { name: "writtenApplicationDeadline", label: "Written Application Deadline", type: "date" },
        { name: "writtenTestDate", label: "Written Test Date", type: "date" },
        { name: "testResultDate", label: "Test Result Date", type: "date" },
      ],
    },
    {
      title: "Admission & Classes",
      fields: [
        { name: "admissionWindowStart", label: "Admission Window Start", type: "date", required: true },
        { name: "admissionWindowEnd", label: "Admission Window End", type: "date", required: true },
        { name: "courseRegistrationStart", label: "Course Registration Start", type: "date" },
        { name: "courseRegistrationEnd", label: "Course Registration End", type: "date" },
        { name: "classStartDate", label: "Class Start Date", type: "date", required: true },
        { name: "orientationDate", label: "Orientation Date", type: "text", placeholder: "TBA" },
        { name: "isActive", label: "Active", type: "switch" },
      ],
    },
  ],
};
