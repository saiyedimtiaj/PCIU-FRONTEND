import { z } from "zod";

export const BOARD_OPTIONS = [
  "Dhaka",
  "Chittagong",
  "Rajshahi",
  "Comilla",
  "Jessore",
  "Barisal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah",
  "Technical",
] as const;

export const TITLE_OPTIONS = ["Mr.", "Mrs.", "Ms."] as const;

const currentYear = new Date().getFullYear();

const gpaSchema = z
  .string()
  .min(1, "GPA is required")
  .refine((value) => {
    const num = Number(value);
    return !Number.isNaN(num) && num >= 0 && num <= 5;
  }, "GPA must be between 0 and 5");

const passingYearSchema = z
  .string()
  .min(1, "Passing year is required")
  .refine((value) => {
    const num = Number(value);
    return !Number.isNaN(num) && num >= 1980 && num <= currentYear + 1;
  }, `Enter a year between 1980 and ${currentYear + 1}`);

export const requiredEducationRowSchema = z.object({
  board: z.string().min(1, "Board is required"),
  group: z.string().min(1, "Group is required"),
  passingYear: passingYearSchema,
  rollNumber: z.string().min(1, "Roll number is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  gpa: gpaSchema,
});

const optionalEducationRowSchema = z.object({
  program: z.string().optional().or(z.literal("")),
  university: z.string().optional().or(z.literal("")),
  subject: z.string().optional().or(z.literal("")),
  passingYear: z.string().optional().or(z.literal("")),
  rollNumber: z.string().optional().or(z.literal("")),
  regNumber: z.string().optional().or(z.literal("")),
  gpa: z.string().optional().or(z.literal("")),
});

export const requiredDegreeRowSchema = z.object({
  program: z.string().min(1, "Program is required"),
  university: z.string().min(1, "University is required"),
  subject: z.string().min(1, "Subject is required"),
  passingYear: passingYearSchema,
  rollNumber: z.string().min(1, "Roll number is required"),
  regNumber: z.string().min(1, "Registration number is required"),
  gpa: gpaSchema,
});

const bangladeshMobile = z
  .string()
  .min(1, "Mobile number is required")
  .regex(/^8801[3-9]\d{8}$/, "Enter a valid number, e.g. 8801XXXXXXXXX");

export const personalInfoSchema = z.object({
  title: z.enum(TITLE_OPTIONS),
  firstName: z.string().min(1, "First name is required").max(100),
  middleName: z.string().max(100).optional().or(z.literal("")),
  lastName: z.string().min(1, "Last name is required").max(100),
  fatherName: z.string().min(1, "Father's name is required").max(150),
  motherName: z.string().min(1, "Mother's name is required").max(150),
  mobileNumber: bangladeshMobile,
  dateOfBirth: z.string().min(1, "Date of birth is required"),
  email: z.email("Must be a valid email"),
});

export const programSelectionSchema = z.object({
  programId: z.string().min(1, "Please select a program"),
});

export const bachelorApplicationSchema = z.object({
  ...programSelectionSchema.shape,
  ...personalInfoSchema.shape,
  ssc: requiredEducationRowSchema,
  hsc: requiredEducationRowSchema,
});

const isRowFilled = (row: z.infer<typeof optionalEducationRowSchema>) =>
  Object.values(row).some((value) => value && value.trim().length > 0);

export const masterApplicationSchema = z
  .object({
    ...programSelectionSchema.shape,
    ...personalInfoSchema.shape,
    ssc: requiredEducationRowSchema,
    hsc: requiredEducationRowSchema,
    bachelor: requiredDegreeRowSchema,
    master: optionalEducationRowSchema,
  })
  .refine(
    (data) => {
      if (!isRowFilled(data.master)) return true;
      return (
        !!data.master.program &&
        !!data.master.university &&
        !!data.master.subject &&
        !!data.master.passingYear &&
        !!data.master.rollNumber &&
        !!data.master.regNumber &&
        !!data.master.gpa
      );
    },
    {
      message: "Fill every master's field, or leave the whole section blank",
      path: ["master", "program"],
    },
  );

export type BachelorApplicationValues = z.infer<typeof bachelorApplicationSchema>;
export type MasterApplicationValues = z.infer<typeof masterApplicationSchema>;
export type EducationRowValues = z.infer<typeof requiredEducationRowSchema>;
export type DegreeRowValues = z.infer<typeof requiredDegreeRowSchema>;
