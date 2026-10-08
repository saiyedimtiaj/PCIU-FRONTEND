import { z } from "zod";

/**
 * Bulk routine entry — one POST creates many class/exam routine rows
 * (`/routines/{class|exam}/bulk`). Shared by the client form (validation)
 * and the Server Action (re-validation + payload shaping), so it carries no
 * "use client"/"use server" directive.
 */
export type RoutineKind = "class" | "exam";

export const DAYS = [
  "SATURDAY",
  "SUNDAY",
  "MONDAY",
  "TUESDAY",
  "WEDNESDAY",
  "THURSDAY",
  "FRIDAY",
] as const;

export const SHIFTS = ["DAY", "EVENING"] as const;

const required = (label: string) => z.string().min(1, `${label} is required`);

const baseRow = {
  department_id: required("Department"),
  course_id: required("Course"),
  building_id: required("Building"),
  room_id: required("Room"),
  time_slot_id: required("Time slot"),
  batch_id: required("Batch"),
  section_id: required("Section"),
  shift: z.enum(SHIFTS, { message: "Shift is required" }),
  student_range: z.string().trim().max(100).optional().or(z.literal("")),
};

export const classRowSchema = z.object({
  ...baseRow,
  teacher_id: required("Teacher"),
  day: z.enum(DAYS, { message: "Day is required" }),
});

export const examRowSchema = z.object({
  ...baseRow,
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Date is required"),
});

export const classBulkSchema = z.object({
  semester_id: required("Semester"),
  rows: z.array(classRowSchema).min(1, "Add at least one routine row"),
});

export const examBulkSchema = z.object({
  semester_id: required("Semester"),
  exam_id: required("Exam"),
  rows: z.array(examRowSchema).min(1, "Add at least one routine row"),
});

export type ClassRow = z.infer<typeof classRowSchema>;
export type ExamRow = z.infer<typeof examRowSchema>;
export type ClassBulkValues = z.infer<typeof classBulkSchema>;
export type ExamBulkValues = z.infer<typeof examBulkSchema>;

/** Row fields as the form edits them — every select starts blank. */
export type BulkRowDraft = Record<string, string>;

export const EMPTY_CLASS_ROW: BulkRowDraft = {
  department_id: "",
  course_id: "",
  teacher_id: "",
  building_id: "",
  room_id: "",
  time_slot_id: "",
  batch_id: "",
  section_id: "",
  day: "",
  shift: "",
  student_range: "",
};

export const EMPTY_EXAM_ROW: BulkRowDraft = {
  department_id: "",
  course_id: "",
  building_id: "",
  room_id: "",
  time_slot_id: "",
  batch_id: "",
  section_id: "",
  date: "",
  shift: "",
  student_range: "",
};

function baseRowPayload(row: z.infer<z.ZodObject<typeof baseRow>>, semesterId: number) {
  return {
    departmentId: Number(row.department_id),
    courseId: Number(row.course_id),
    buildingId: Number(row.building_id),
    roomId: Number(row.room_id),
    timeSlotId: Number(row.time_slot_id),
    batchId: Number(row.batch_id),
    sectionId: Number(row.section_id),
    semesterId,
    shift: row.shift,
    studentRange: row.student_range?.trim() ?? "",
  };
}

/** Form values -> the API's `{ routines: [...] }` body (camelCase, numeric ids). */
export function toClassBulkBody(values: ClassBulkValues) {
  const semesterId = Number(values.semester_id);
  return {
    routines: values.rows.map((row) => ({
      ...baseRowPayload(row, semesterId),
      teacherId: Number(row.teacher_id),
      day: row.day,
    })),
  };
}

export function toExamBulkBody(values: ExamBulkValues) {
  const semesterId = Number(values.semester_id);
  const examId = Number(values.exam_id);
  return {
    routines: values.rows.map((row) => ({
      ...baseRowPayload(row, semesterId),
      examId,
      date: row.date,
    })),
  };
}
