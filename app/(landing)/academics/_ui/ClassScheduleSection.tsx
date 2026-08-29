import { AlertTriangle } from "lucide-react";
import InfoCard from "@/components/shared/InfoCard";
import type { AcademicsPageContent } from "@/types/academics";
import ClassRoutineInteractive from "./ClassRoutineInteractive";

export default function ClassScheduleSection({
  content,
}: {
  content: AcademicsPageContent["classSchedule"];
}) {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading font-bold text-2xl text-foreground mb-1">Class Schedule</h2>
        <p className="text-sm text-muted-foreground">Weekly class routine.</p>
      </div>

      <div className="grid sm:grid-cols-2 gap-4">
        <InfoCard title="Day Section">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Classes: Saturday – Thursday</li>
            <li>Time: 8:30 AM – 5:55 PM</li>
            <li>Break: 1:00 PM – 1:30 PM (Jumma Prayer on Friday)</li>
            <li>Weekly Holiday: Friday</li>
          </ul>
        </InfoCard>
        <InfoCard title="Evening Section">
          <ul className="space-y-1.5 text-sm text-muted-foreground">
            <li>Classes: Saturday – Thursday</li>
            <li>Time: 5:00 PM – 9:00 PM</li>
            <li>Designed for working professionals</li>
            <li>Weekly Holiday: Friday</li>
          </ul>
        </InfoCard>
      </div>

      <ClassRoutineInteractive 
        routines={content.routines} 
        timeSlots={content.timeSlots} 
      />

      <InfoCard className="border-l-4 border-l-accent">
        <p className="flex items-start gap-2 text-sm text-muted-foreground">
          <AlertTriangle className="size-4 text-accent shrink-0 mt-0.5" />
          Detailed class schedules for each department and section are available at the
          respective departmental offices and on the student portal. Contact your department for
          the latest schedule.
        </p>
      </InfoCard>
    </div>
  );
}
