export interface ExamScheduleEntry {
  semester: string;
  midterm: string;
  final: string;
  status: string;
}

export interface RoutineEntry {
  date: string;
  time: string;
  course: string;
  room: string;
}

export interface ClassTimeSlot {
  time: string;
  slot: string;
}

export interface ClassRoutineRow {
  day: string;
  slotA: string;
  slotB: string;
  slotC: string;
  slotD: string;
  slotE: string;
  slotF: string;
}

export interface GradeRow {
  range: string;
  letter: string;
  point: string;
  meaning: string;
}

export interface AttendanceMarkRow {
  range: string;
  marks: string;
}

export interface PolicyEntry {
  title: string;
  content: string;
}

export interface ResultStep {
  step: string;
  title: string;
  desc: string;
}

export interface AcademicsPageContent {
  examSchedule: {
    schedules: ExamScheduleEntry[];
    routine: RoutineEntry[];
    guidelines: string[];
  };
  classSchedule: {
    timeSlots: ClassTimeSlot[];
    routine: ClassRoutineRow[];
  };
  resultGrading: {
    dressCodeViolations: string[];
    libraryCode: string[];
    majorOffenses: string[];
    minorOffenses: string[];
    grades: GradeRow[];
    attendanceMarks: AttendanceMarkRow[];
  };
  examinationPolicies: {
    policies: PolicyEntry[];
  };
  academicResults: {
    steps: ResultStep[];
  };
}

export const ACADEMICS_SECTION_IDS = [
  "exam-schedule",
  "class-schedule",
  "result-grading",
  "examination-policies",
  "academic-results",
  "certification-verification",
] as const;

export type AcademicsSectionId = (typeof ACADEMICS_SECTION_IDS)[number];
