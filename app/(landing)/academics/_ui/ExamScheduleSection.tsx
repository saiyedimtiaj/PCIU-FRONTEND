import { AlertTriangle, BookOpen, FileText, CheckCircle } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { AcademicsPageContent } from "@/types/academics";

export default function ExamScheduleSection({
  content,
}: {
  content: AcademicsPageContent["examSchedule"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Exam Schedule</h2>
        <p className="text-sm text-muted-foreground">
          Midterm and final examination schedule by semester.
        </p>
      </div>

      <InfoCard className="border-l-4 border-l-destructive">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 text-destructive shrink-0 mt-0.5" />
          <span>
            <strong className="text-foreground">Important Notice —</strong> Exam schedules are
            subject to change. Students are advised to check their departmental notice board and
            PCIU website regularly for the latest updates.
          </span>
        </p>
      </InfoCard>

      <div className="grid sm:grid-cols-3 gap-4">
        {content.schedules.map((s) => (
          <InfoCard key={s.semester}>
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-semibold text-foreground">{s.semester}</h3>
              <Badge variant={s.status === "Ongoing" ? "default" : "secondary"}>{s.status}</Badge>
            </div>
            <p className="flex items-center gap-2 text-sm text-muted-foreground mb-1.5">
              <BookOpen className="size-4 shrink-0" /> Midterm: {s.midterm}
            </p>
            <p className="flex items-center gap-2 text-sm text-muted-foreground">
              <FileText className="size-4 shrink-0" /> Final: {s.final}
            </p>
          </InfoCard>
        ))}
      </div>

      <InfoCard title="Exam Routine – Spring 2026 Midterm">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Time</TableHead>
              <TableHead>Course</TableHead>
              <TableHead>Room</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {content.routine.map((row) => (
              <TableRow key={row.date + row.course}>
                <TableCell className="whitespace-nowrap">{row.date}</TableCell>
                <TableCell className="whitespace-nowrap">{row.time}</TableCell>
                <TableCell>{row.course}</TableCell>
                <TableCell>{row.room}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </InfoCard>

      <InfoCard title="General Exam Guidelines">
        <ul className="space-y-2">
          {content.guidelines.map((g) => (
            <li key={g} className="flex items-start gap-2 text-sm text-muted-foreground">
              <CheckCircle className="size-4 text-primary shrink-0 mt-0.5" />
              {g}
            </li>
          ))}
        </ul>
      </InfoCard>
    </div>
  );
}
