import Link from "next/link";
import { CalendarX2 } from "lucide-react";
import { Button } from "@/components/ui/button";

/** Shown instead of the form when no admission cycle is open right now. */
export default function ApplicationsClosed() {
  return (
    <div className="mx-auto max-w-lg animate-fade-in-up rounded-2xl border border-border bg-card p-8 text-center sm:p-10">
      <span className="mx-auto flex size-16 items-center justify-center rounded-full bg-accent/15 text-accent">
        <CalendarX2 className="size-8" />
      </span>
      <h2 className="mt-6 font-heading text-2xl font-bold text-foreground">Applications Are Closed</h2>
      <p className="mt-2 text-sm text-muted-foreground">
        Online applications aren&apos;t open right now. Please check the admission schedule for the next intake.
      </p>
      <Button
        variant="highlight"
        size="cta"
        className="mt-8 w-full"
        render={<Link href="/admission?section=admission-schedule" />}
        nativeButton={false}
      >
        View Admission Schedule
      </Button>
    </div>
  );
}
