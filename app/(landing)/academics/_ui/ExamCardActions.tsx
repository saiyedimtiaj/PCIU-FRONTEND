"use client";

import Link from "next/link";
import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Exam, ExamRoutine } from "@/types/academics";
import { downloadExamRoutinePdf } from "@/lib/academics/export-pdf";

/**
 * "View Routine" navigates to this exam's live filterable table below
 * (via ?examId= + #exam-routine scroll anchor). The Download icon
 * triggers the full-routine PDF download via downloadExamRoutinePdf.
 * The two are now separate actions, not the same handler.
 */
export default function ExamCardActions({
  exam,
  isActive,
  /** All exam routines across every exam — downloadExamRoutinePdf filters to `exam.id` itself. */
  routines,
}: {
  exam: Exam;
  isActive: boolean;
  routines: ExamRoutine[];
}) {
  const handleDownload = () => {
    void downloadExamRoutinePdf({ examId: exam.id, examName: exam.name, routines });
  };

  return (
    <div className="flex items-center gap-2 mt-auto pt-4 border-t border-border/50">
      <Button
        variant={isActive ? "default" : "outlineMuted"}
        size="sm"
        className="flex-1"
        render={<Link href={`/academics/exam-schedule?examId=${exam.id}#exam-routine`} />}
        nativeButton={false}
      >
        <FileText className="size-4 mr-1.5" />
        View Routine
      </Button>
      <Button
        variant="outlineSecondary"
        size="sm"
        className="flex-none px-3"
        onClick={handleDownload}
        title="Download PDF"
      >
        <Download className="size-4" />
        <span className="sr-only">Download</span>
      </Button>
    </div>
  );
}