import { getMyProfile } from "@/services/teacher-profile";
import { getLiveClassRoutines, getLiveExamRoutines } from "./live";
import type { ClassRoutineItem, ExamRoutine } from "@/types/academics";

/**
 * The signed-in teacher's own routines, for the faculty portal. Server-only:
 * the profile read is session-scoped (the API derives the teacher from the
 * cookie), so its id is the signed-in teacher's — routines are matched on
 * ids, never on display names.
 */
export interface MyRoutines {
  /** null when the profile couldn't be loaded — the caller shows an error. */
  teacherName: string | null;
  classRoutines: ClassRoutineItem[];
  examRoutines: ExamRoutine[];
}

/** One course taught to one batch + section — the unit an exam sitting belongs to. */
function teachingKey(r: { courseId?: number; batchId?: number; sectionId?: number }): string | null {
  return r.courseId && r.batchId && r.sectionId ? `${r.courseId}:${r.batchId}:${r.sectionId}` : null;
}

export async function getMyRoutines(): Promise<MyRoutines> {
  const [profile, allClass, allExam] = await Promise.all([
    getMyProfile().catch(() => null),
    getLiveClassRoutines(),
    getLiveExamRoutines(),
  ]);

  if (!profile) return { teacherName: null, classRoutines: [], examRoutines: [] };

  const teacherId = Number(profile.id);
  const classRoutines = allClass.filter((r) => r.teacherId === teacherId);

  // Exam routines carry no teacher, so a teacher's exams are the sittings
  // for the exact course + batch + section they teach in the class routine.
  const taught = new Set(classRoutines.map(teachingKey).filter((k): k is string => k !== null));
  const examRoutines = allExam.filter((r) => {
    const key = teachingKey(r);
    return key !== null && taught.has(key);
  });

  return {
    teacherName: profile.name ?? profile.user?.name ?? "",
    classRoutines,
    examRoutines,
  };
}
