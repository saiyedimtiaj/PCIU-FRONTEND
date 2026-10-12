import { z } from "zod";
import { CalendarDays } from "lucide-react";
import type { EntitySchema } from "@/components/admin/form/form-types";

// Every milestone is a full datetime — the API stores e.g. the written test
// at "2026-11-15T09:00:00.000Z" — so these are `datetime` inputs, converted
// to/from ISO in services/entity.ts (ISO_DATETIME_FIELDS).
const required = z.string().min(1, "Required");
const optional = z.string().optional().or(z.literal(""));

const admissionSchedulesSchema = z.object({
  semesterName: z.string().min(2, "Semester is required").max(255),
  year: z.coerce.number().int().min(2000).max(2100),
  programLevel: z.string().min(1, "Program level is required"),
  applicationStartDate: required,
  directAdmissionDeadline: optional,
  writtenApplicationDeadline: optional,
  writtenTestDate: optional,
  testResultDate: optional,
  admissionWindowStart: required,
  admissionWindowEnd: required,
  courseRegistrationStart: optional,
  courseRegistrationEnd: optional,
  classStartDate: required,
  orientationDate: optional,
});

export const admissionSchedulesEntity: EntitySchema<typeof admissionSchedulesSchema> = {
  slug: "admission-schedules",
  title: "Admission Schedule",
  description: "Add the full admission timeline for a semester.",
  icon: CalendarDays,
  group: "Admission",
  zodSchema: admissionSchedulesSchema,
  defaultValues: {},
  sections: [
    {
      title: "Semester",
      fields: [
        { name: "semesterName", label: "Semester", type: "text", required: true, placeholder: "Fall" },
        { name: "year", label: "Year", type: "number", required: true, placeholder: "2026" },
        {
          name: "programLevel",
          label: "Program Level",
          type: "select",
          required: true,
          options: [
            { label: "Undergraduate", value: "Undergraduate" },
            { label: "Graduate", value: "Graduate" },
          ],
        },
      ],
    },
    {
      title: "Application & Test",
      fields: [
        { name: "applicationStartDate", label: "Application Start", type: "datetime", required: true },
        { name: "directAdmissionDeadline", label: "Direct Admission Deadline", type: "datetime" },
        { name: "writtenApplicationDeadline", label: "Written Application Deadline", type: "datetime" },
        { name: "writtenTestDate", label: "Written Test", type: "datetime" },
        { name: "testResultDate", label: "Test Result", type: "datetime" },
      ],
    },
    {
      title: "Admission & Classes",
      fields: [
        { name: "admissionWindowStart", label: "Admission Window Start", type: "datetime", required: true },
        { name: "admissionWindowEnd", label: "Admission Window End", type: "datetime", required: true },
        { name: "courseRegistrationStart", label: "Course Registration Start", type: "datetime" },
        { name: "courseRegistrationEnd", label: "Course Registration End", type: "datetime" },
        { name: "orientationDate", label: "Orientation", type: "datetime" },
        { name: "classStartDate", label: "Class Start", type: "datetime", required: true },
      ],
    },
  ],
};
