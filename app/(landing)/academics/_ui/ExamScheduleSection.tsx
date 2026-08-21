import Link from "next/link";
import {
  AlertTriangle,
  Calendar,
  CheckCircle,
  Download,
  FileText,
} from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { AcademicsPageContent } from "@/types/academics";
import ExamRoutineInteractive from "./ExamRoutineInteractive";

export default async function ExamScheduleSection({
  content,
  searchParams,
}: {
  content: AcademicsPageContent["examSchedule"];
  searchParams: Promise<{ examId?: string }>;
}) {
  const { exams, routines, guidelines } = content;
  const { examId } = await searchParams;

  // Determine active exam
  const parsedExamId = examId ? parseInt(examId, 10) : NaN;
  const activeExam =
    exams.find((e) => e.id === parsedExamId) ||
    (exams.length > 0 ? exams[0] : null);

  // Filter routines for the active exam
  const activeRoutines = activeExam
    ? routines.filter((r) => r.examId === activeExam.id)
    : [];

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
        <h3 className="font-semibold text-lg">Examinations</h3>
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
                      {exam.startDate} to {exam.endDate}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
                    <Button
                      variant={isActive ? "default" : "outlineMuted"}
                      size="sm"
                      className="flex-1"
                      render={
                        <Link
                          href={`/academics/exam-schedule?examId=${exam.id}`}
                          scroll={false}
                        />
                      }
                      nativeButton={false}
                    >
                      <FileText className="size-4 mr-1.5" />
                      View Routine
                    </Button>
                    <Button
                      variant="outlineSecondary"
                      size="sm"
                      className="flex-none px-3"
                      disabled={!exam.routeFile}
                      render={
                        exam.routeFile ? (
                          <Link
                            href={exam.routeFile}
                            target="_blank"
                            rel="noopener noreferrer"
                          />
                        ) : undefined
                      }
                      nativeButton={exam.routeFile ? false : true}
                      title={
                        exam.routeFile ? "Download PDF" : "PDF not available"
                      }
                    >
                      <Download className="size-4" />
                      <span className="sr-only">Download</span>
                    </Button>
                  </div>
                </div>
              </InfoCard>
            );
          })}
        </div>
      </div>

      {activeExam && (
        <div className="space-y-4 animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center justify-between">
            <h3 className="font-semibold text-lg">
              {activeExam.name} - Routine
            </h3>
          </div>
          <ExamRoutineInteractive routines={activeRoutines} />
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
