import { AlertTriangle, Calendar, CheckCircle } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Badge } from "@/components/ui/badge";
import type { AcademicsPageContent, Semester } from "@/types/academics";
import ExamCardActions from "./ExamCardActions";
import ExamRoutineInteractive from "./ExamRoutineInteractive";
import ExamSemesterFilter from "./ExamSemesterFilter";
import { ALL_SEMESTERS } from "./SemesterSelect";
import {
  ALL_EXAM_TYPES,
  examTypeLabel,
  examTypeOf,
  parseExamType,
} from "@/lib/academics/exam-type";

const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

/** "2026-11-01" -> "1 Nov 2026". Spelling out the month makes a day/month
 *  mix-up in the admin entry obvious; pure string parsing, no timezone shift. */
function formatExamDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  if (!year || !month || !day) return iso;
  return `${day} ${MONTHS[month - 1]} ${year}`;
}

export default async function ExamScheduleSection({
  content,
  semesters,
  searchParams,
}: {
  content: AcademicsPageContent["examSchedule"];
  semesters: Semester[];
  searchParams: Promise<{ examId?: string; semesterId?: string; type?: string }>;
}) {
  const { routines, guidelines } = content;
  const { examId, semesterId, type } = await searchParams;

  // An unknown/stale ?semesterId= or ?type= falls back to "all" rather than an empty page.
  const activeSemester = semesters.find((s) => String(s.id) === semesterId);
  const examType = parseExamType(type);
  const exams = content.exams.filter(
    (e) =>
      (!activeSemester || e.semesterId === activeSemester.id) &&
      (!examType || examTypeOf(e.name) === examType),
  );
  const emptyLabel = [examType && examTypeLabel(examType), activeSemester?.title]
    .filter(Boolean)
    .join(" — ");

  // Determine active exam: the one in the URL, else the first card — getLiveExams
  // already orders them Ongoing → Upcoming → most recently Completed.
  const parsedExamId = examId ? parseInt(examId, 10) : NaN;
  const activeExam = exams.find((e) => e.id === parsedExamId) ?? exams[0] ?? null;

  return (
    <div className="space-y-8">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">
          Exam Schedule
        </h2>
        <p className="text-sm text-muted-foreground">
          View current and upcoming examination schedules and routines.
        </p>
      </div>

      <InfoCard className="border-l-4 border-l-destructive shadow-none">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">Important Notice —</strong> Exam
            schedules are subject to change. Students are advised to check their
            departmental notice board and PCIU website regularly for the latest
            updates.
          </span>
        </p>
      </InfoCard>

      <div className="space-y-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <h3 className="font-semibold text-lg">Examinations</h3>
          <ExamSemesterFilter
            semesters={semesters}
            semester={activeSemester ? String(activeSemester.id) : ALL_SEMESTERS}
            examType={examType ?? ALL_EXAM_TYPES}
          />
        </div>
        {exams.length === 0 && (
          <InfoCard className="shadow-none">
            <p className="py-6 text-center text-sm text-muted-foreground">
              {emptyLabel
                ? `${emptyLabel} routine has not been published yet.`
                : "No examinations scheduled yet."}
            </p>
          </InfoCard>
        )}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {exams.map((exam) => {
            const isActive = activeExam?.id === exam.id;
            return (
              <InfoCard
                key={exam.id}
                className={`transition-all duration-200 border-2 ${
                  isActive
                    ? "border-primary shadow-md"
                    : "border-transparent hover:border-border"
                }`}
              >
                <div className="flex flex-col h-full">
                  <div className="flex items-start justify-between mb-3 gap-2">
                    <h4 className="font-semibold text-foreground line-clamp-2">
                      {exam.name}
                    </h4>
                    <Badge
                      variant={
                        exam.status === "Ongoing" ? "default" : "secondary"
                      }
                      className="shrink-0"
                    >
                      {exam.status}
                    </Badge>
                  </div>
                  <div className="space-y-2 mb-6 flex-1">
                    <p className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Calendar className="size-4 shrink-0 text-primary/70" />
                      {formatExamDate(exam.startDate)} – {formatExamDate(exam.endDate)}
                    </p>
                  </div>
                  <ExamCardActions
                    exam={exam}
                    isActive={isActive}
                    routines={routines}
                    semesterId={activeSemester?.id}
                    examType={examType}
                  />
                </div>
              </InfoCard>
            );
          })}
        </div>
      </div>

      {activeExam && (
        <div
          id="exam-routine"
          className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500"
        >
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {activeExam.name} - Routine
            </h3>
          </div>
          <ExamRoutineInteractive
            routines={routines}
            examId={activeExam.id}
            examName={activeExam.name}
          />
        </div>
      )}

      <InfoCard title="General Exam Guidelines" className="shadow-none">
        <ul className="space-y-3">
          {guidelines.map((g, idx) => (
            <li
              key={idx}
              className="flex items-start gap-3 text-sm text-muted-foreground"
            >
              <div className="bg-primary/10 rounded-full p-1 mt-0.5">
                <CheckCircle className="size-3.5 text-primary shrink-0" />
              </div>
              <span className="leading-relaxed">{g}</span>
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}