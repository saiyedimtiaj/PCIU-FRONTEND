export interface Exam {
  id: number;
  name: string;
  routeFile: string | null;
  startDate: string;
  endDate: string;
  status: string;
}

export interface ExamRoutine {
  id: number;
  examId: number;
  department: string;
  course: string;
  building: string;
  room: string;
  timeSlot: string;
  batch: string;
  section: string;
  date: string;
  studentRange: string;
}

export interface ClassTimeSlot {
  time: string;
  slot: string;
}

export interface ClassRoutineItem {
  id: number;
  department: string;
  course: string;
  teacher: string;
  building: string;
  room: string;
  timeSlot: string;
  batch: string;
  section: string;
  day: string;
  studentRange: string;
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
    exams: Exam[];
    routines: ExamRoutine[];
    guidelines: string[];
  };
  classSchedule: {
    timeSlots: ClassTimeSlot[];
    routines: ClassRoutineItem[];
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
