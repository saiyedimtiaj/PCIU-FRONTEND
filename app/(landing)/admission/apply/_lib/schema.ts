import { z } from "zod";

// Field names mirror the POST /admissionapplication body; submit-action.ts
// flattens them into the API's `sscBoardName`, `bachelorGpa`, … keys.

export const BOARD_OPTIONS = [
  "Dhaka",
  "Chattogram",
  "Rajshahi",
  "Cumilla",
  "Jashore",
  "Barishal",
  "Sylhet",
  "Dinajpur",
  "Mymensingh",
  "Madrasah",
  "Technical",
] as const;

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
    return Number.isInteger(num) && num >= 1980 && num <= currentYear + 1;
  }, `Enter a year between 1980 and ${currentYear + 1}`);

/** SSC / HSC: board, group, passing year, roll, registration. */
export const sscHscRowSchema = z.object({
  board: z.string().min(1, "Board is required"),
  group: z.string().min(1, "Group is required"),
  passingYear: passingYearSchema,
  rollNumber: z.string().min(1, "Roll number is required"),
  registrationNumber: z.string().min(1, "Registration number is required"),
});

/** Bachelor / Master: degree, university, subject, passing year, GPA. */
export const degreeRowSchema = z.object({
  degreeName: z.string().min(1, "Degree name is required"),
  university: z.string().min(1, "University is required"),
  subject: z.string().min(1, "Subject is required"),
  passingYear: passingYearSchema,
  gpa: gpaSchema,
});

const optionalDegreeRowSchema = z.object({
  degreeName: z.string().optional().or(z.literal("")),
  university: z.string().optional().or(z.literal("")),
  subject: z.string().optional().or(z.literal("")),
  passingYear: z.string().optional().or(z.literal("")),
  gpa: z.string().optional().or(z.literal("")),
});

/** 01XXXXXXXXX, 8801XXXXXXXXX or +8801XXXXXXXXX — sent as +8801XXXXXXXXX. */
const bangladeshMobile = z
  .string()
  .min(1, "Mobile number is required")
  .regex(/^(?:\+?88)?01[3-9]\d{8}$/, "Enter a valid number, e.g. +8801XXXXXXXXX");

export const personalInfoSchema = z.object({
  name: z.string().min(2, "Full name is required").max(150),
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
  ssc: sscHscRowSchema,
  hsc: sscHscRowSchema,
});

const isRowFilled = (row: z.infer<typeof optionalDegreeRowSchema>) =>
  Object.values(row).some((value) => value && value.trim().length > 0);

export const masterApplicationSchema = z
  .object({
    ...programSelectionSchema.shape,
    ...personalInfoSchema.shape,
    ssc: sscHscRowSchema,
    hsc: sscHscRowSchema,
    bachelor: degreeRowSchema,
    master: optionalDegreeRowSchema,
  })
  .refine((data) => !isRowFilled(data.master) || degreeRowSchema.safeParse(data.master).success, {
    message: "Fill every master's field correctly, or leave the whole section blank",
    path: ["master", "degreeName"],
  });

export type BachelorApplicationValues = z.infer<typeof bachelorApplicationSchema>;
export type MasterApplicationValues = z.infer<typeof masterApplicationSchema>;

export { isRowFilled };
