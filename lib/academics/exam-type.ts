/**
 * The exam table has no type column — only a free-text name the admin types
 * ("Mid-Term Exam", "Midterm Examination", "Final Term Exam", ...). The type
 * is read from that name, tolerant of spacing/hyphen variations.
 */
export const EXAM_TYPES = [
  { value: "mid", label: "Mid Term", pattern: /mid\s*-?\s*term|\bmid\b/i },
  { value: "final", label: "Final Term", pattern: /final/i },
] as const;

export type ExamType = (typeof EXAM_TYPES)[number]["value"];

export const ALL_EXAM_TYPES = "all";

export function examTypeOf(name: string): ExamType | undefined {
  return EXAM_TYPES.find((t) => t.pattern.test(name))?.value;
}

export function parseExamType(value: string | undefined): ExamType | undefined {
  return EXAM_TYPES.find((t) => t.value === value)?.value;
}

export function examTypeLabel(type: ExamType): string {
  return EXAM_TYPES.find((t) => t.value === type)!.label;
}
