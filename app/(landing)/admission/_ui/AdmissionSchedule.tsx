import {
  CalendarDays,
  CircleCheck,
  CircleX,
  Clock3,
  GraduationCap,
  Hourglass,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import {
  getAdmissionSchedules,
  type AdmissionProgramLevel,
  type AdmissionScheduleData,
} from "@/lib/api/admission";

const SCHEDULE_STAGES = [
  {
    title: "Applications",
    description: "Application opening and submission deadlines",
    items: [
      { key: "applicationStartDate", label: "Applications open" },
      { key: "directAdmissionDeadline", label: "Direct admission deadline" },
      {
        key: "writtenApplicationDeadline",
        label: "Written application deadline",
      },
    ],
  },
  {
    title: "Admission test",
    description: "Test date and result publication",
    items: [
      { key: "writtenTestDate", label: "Written admission test" },
      { key: "testResultDate", label: "Test results announced" },
    ],
  },
  {
    title: "Admission & registration",
    description: "Complete admission and register for courses",
    items: [
      { key: "admissionWindowStart", label: "Admission window opens" },
      { key: "admissionWindowEnd", label: "Admission window closes" },
      { key: "courseRegistrationStart", label: "Course registration opens" },
      { key: "courseRegistrationEnd", label: "Course registration closes" },
    ],
  },
  {
    title: "Starting at PCIU",
    description: "Meet your classmates and begin classes",
    items: [
      { key: "orientationDate", label: "Orientation" },
      { key: "classStartDate", label: "Classes begin" },
    ],
  },
] as const satisfies ReadonlyArray<{
  title: string;
  description: string;
  items: ReadonlyArray<{
    key: keyof AdmissionScheduleData;
    label: string;
  }>;
}>;

const LEVELS = ["Undergraduate", "Graduate"] as const;
const DAY_MS = 24 * 60 * 60 * 1000;

const DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

const DATE_ONLY_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "UTC",
});

const TIME_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  hour: "numeric",
  minute: "2-digit",
  hour12: true,
  timeZone: "Asia/Dhaka",
});

type FormattedDate = {
  date: string;
  time: string | null;
  dateTime: string | null;
  invalid: boolean;
  // Moment the milestone counts as passed: the exact time, or the end of
  // the day for date-only values.
  endsAt: number | null;
};

type MilestoneStatus = "done" | "next" | "upcoming" | "tba";

function formatScheduleDate(value: string | null): FormattedDate {
  if (!value) {
    return {
      date: "To be announced",
      time: null,
      dateTime: null,
      invalid: false,
      endsAt: null,
    };
  }

  const datePart = value.slice(0, 10);
  if (
    !/^\d{4}-\d{2}-\d{2}(?:T\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:\d{2})?)?$/.test(
      value,
    ) ||
    !isValidCalendarDate(datePart)
  ) {
    return {
      date: "Invalid date",
      time: null,
      dateTime: null,
      invalid: true,
      endsAt: null,
    };
  }

  const hasTime = value.includes("T");
  const hasTimezone = /(?:Z|[+-]\d{2}:\d{2})$/.test(value);
  const normalizedValue = hasTime && !hasTimezone ? `${value}Z` : value;
  const timestamp = Date.parse(normalizedValue);
  if (!Number.isFinite(timestamp)) {
    return {
      date: "Invalid date",
      time: null,
      dateTime: null,
      invalid: true,
      endsAt: null,
    };
  }

  const date = new Date(timestamp);
  return {
    date: (hasTime ? DATE_FORMATTER : DATE_ONLY_FORMATTER).format(date),
    time: hasTime ? TIME_FORMATTER.format(date) : null,
    dateTime: normalizedValue,
    invalid: false,
    endsAt: hasTime ? timestamp : timestamp + DAY_MS,
  };
}

function isValidCalendarDate(value: string) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return false;

  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return (
    date.getUTCFullYear() === Number(year) &&
    date.getUTCMonth() === Number(month) - 1 &&
    date.getUTCDate() === Number(day)
  );
}

function buildTimeline(schedule: AdmissionScheduleData, now: number) {
  let nextAssigned = false;
  const stages = SCHEDULE_STAGES.map((stage) => ({
    ...stage,
    items: stage.items.map(({ key, label }) => {
      const formatted = formatScheduleDate(schedule[key]);
      let status: MilestoneStatus;
      if (formatted.endsAt === null) status = "tba";
      else if (formatted.endsAt <= now) status = "done";
      else if (!nextAssigned) {
        status = "next";
        nextAssigned = true;
      } else status = "upcoming";
      return { key, label, formatted, status };
    }),
  }));

  const dated = stages
    .flatMap((s) => s.items)
    .filter((i) => i.status !== "tba");
  const done = dated.filter((i) => i.status === "done").length;
  const next = stages.flatMap((s) => s.items).find((i) => i.status === "next");

  return { stages, done, total: dated.length, next };
}

export default async function AdmissionSchedule() {
  const result = await getAdmissionSchedules();
  const now = new Date().getTime();

  return (
    <section aria-labelledby="admission-schedule-title" className="space-y-6">
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <CalendarDays aria-hidden="true" className="size-3.5" />
          Important dates
        </div>
        <h2
          id="admission-schedule-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Admission Schedule
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Admission timeline and important dates for each semester.
        </p>
      </header>

      {result.status === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8"
        >
          <h3 className="font-semibold text-foreground">
            Admission schedule is temporarily unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please try again later. We are unable to load the latest schedule
            right now.
          </p>
        </div>
      ) : result.status === "empty" ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10"
        >
          <CalendarDays
            aria-hidden="true"
            className="mx-auto size-9 text-primary/60"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No admission schedules available
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            There are no admission dates to display at the moment. Please check
            back soon.
          </p>
        </div>
      ) : (
        <Tabs
          defaultValue={
            LEVELS.find((level) => result.data[level].length) ?? LEVELS[0]
          }
          className="w-full"
        >
          <TabsList
            aria-label="Filter admission schedules by program level"
            className="grid w-full grid-cols-2 gap-1 rounded-xl border border-border bg-card p-1 shadow-sm"
          >
            {LEVELS.map((level) => (
              <TabsTrigger
                key={level}
                value={level}
                className="min-w-0 justify-center rounded-lg px-2 py-2.5 text-xs text-muted-foreground transition hover:text-primary data-active:bg-primary data-active:text-primary-foreground data-active:shadow-md data-active:shadow-primary/20 sm:gap-2 sm:px-4 sm:text-sm"
              >
                <GraduationCap
                  aria-hidden="true"
                  className="hidden size-4 sm:block"
                />
                <span className="truncate">{level}</span>
                <span className="rounded-full bg-background/20 px-1.5 py-0.5 text-[10px] tabular-nums sm:text-xs">
                  {result.data[level].length}
                </span>
              </TabsTrigger>
            ))}
          </TabsList>

          {LEVELS.map((level) => (
            <TabsContent
              key={level}
              value={level}
              className="mt-5 space-y-5 outline-none"
            >
              {result.data[level].length ? (
                result.data[level].map((schedule) => (
                  <ScheduleCard
                    key={schedule.id}
                    schedule={schedule}
                    now={now}
                  />
                ))
              ) : (
                <EmptyLevel level={level} />
              )}
            </TabsContent>
          ))}
        </Tabs>
      )}
    </section>
  );
}

function EmptyLevel({ level }: { level: AdmissionProgramLevel }) {
  return (
    <div
      role="status"
      className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center"
    >
      <p className="font-medium text-foreground">
        No {level.toLowerCase()} schedule available
      </p>
      <p className="mt-1 text-sm text-muted-foreground">
        Please check back later for updated admission dates.
      </p>
    </div>
  );
}

function ScheduleCard({
  schedule,
  now,
}: {
  schedule: AdmissionScheduleData;
  now: number;
}) {
  const { stages, done, total, next } = buildTimeline(schedule, now);
  const progress = total ? Math.round((done / total) * 100) : 0;

  return (
    <article className="overflow-hidden rounded-3xl border border-border bg-card shadow-sm transition duration-300 hover:border-primary/20 hover:shadow-xl">
      {/* Banner */}
      <header className="relative overflow-hidden bg-linear-to-br from-primary via-primary/95 to-accent p-5 text-white sm:p-7">
        <div
          aria-hidden="true"
          className="absolute inset-0 opacity-20"
          style={{
            backgroundImage:
              "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
            backgroundSize: "20px 20px",
          }}
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-white/15 px-2.5 py-0.5 text-xs font-semibold ring-1 ring-white/20">
                {schedule.programLevel}
              </span>
              <Badge
                variant={schedule.isActive ? "success" : "muted"}
                className={schedule.isActive ? "bg-success text-white" : ""}
              >
                {schedule.isActive ? (
                  <CircleCheck aria-hidden="true" className="mr-1 size-3" />
                ) : (
                  <CircleX aria-hidden="true" className="mr-1 size-3" />
                )}
                {schedule.isActive ? "Active" : "Inactive"}
              </Badge>
            </div>
            <h3 className="mt-3 wrap-break-word font-heading text-2xl font-bold sm:text-3xl">
              {schedule.semesterName}
            </h3>
          </div>
          <div className="flex shrink-0 items-center gap-3 self-start rounded-2xl bg-white/10 px-4 py-3 ring-1 ring-white/15 backdrop-blur-sm">
            <CalendarDays aria-hidden="true" className="size-5 text-white/80" />
            <div>
              <p className="text-[10px] font-medium uppercase tracking-wide text-white/70">
                Year
              </p>
              <p className="font-heading text-xl font-bold tabular-nums">
                {schedule.year}
              </p>
            </div>
          </div>
        </div>

        {total > 0 && (
          <div className="relative mt-6 space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
              <span className="font-medium text-white/85">
                {done} of {total} milestones completed
              </span>
              {next && (
                <span className="inline-flex items-center gap-1.5 rounded-full bg-highlight px-2.5 py-1 font-semibold text-black">
                  <Hourglass aria-hidden="true" className="size-3" />
                  Next: {next.label} · {next.formatted.date}
                </span>
              )}
            </div>
            <div
              role="progressbar"
              aria-label="Admission timeline progress"
              aria-valuenow={progress}
              aria-valuemin={0}
              aria-valuemax={100}
              className="h-2 overflow-hidden rounded-full bg-white/20"
            >
              <div
                className="h-full rounded-full bg-highlight transition-all duration-700"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Timeline */}
      <ol className="p-4 sm:p-7">
        {stages.map((stage, stageIndex) => {
          const stageDone = stage.items.every((i) => i.status === "done");
          const stageActive = stage.items.some((i) => i.status === "next");
          const last = stageIndex === stages.length - 1;
          return (
            <li
              key={stage.title}
              aria-labelledby={`schedule-stage-${schedule.id}-${stageIndex}`}
              className="relative flex gap-3 sm:gap-5"
            >
              {!last && (
                <span
                  aria-hidden="true"
                  className={cn(
                    "absolute left-4 top-10 bottom-0 w-0.5 sm:left-5 sm:top-12",
                    stageDone ? "bg-primary" : "bg-border",
                  )}
                />
              )}
              <span
                aria-hidden="true"
                className={cn(
                  "relative z-10 flex size-8 shrink-0 items-center justify-center rounded-full text-sm font-bold tabular-nums ring-4 ring-card sm:size-10",
                  stageDone
                    ? "bg-primary text-primary-foreground"
                    : stageActive
                      ? "bg-highlight text-black shadow-lg shadow-highlight/40"
                      : "border-2 border-border bg-card text-muted-foreground",
                )}
              >
                {stageDone ? (
                  <CircleCheck className="size-4 sm:size-5" />
                ) : (
                  stageIndex + 1
                )}
              </span>

              <div className={cn("min-w-0 flex-1", !last && "pb-8")}>
                <div className="flex flex-wrap items-center gap-2 pt-1 sm:pt-2">
                  <h4
                    id={`schedule-stage-${schedule.id}-${stageIndex}`}
                    className="font-heading font-semibold text-foreground sm:text-lg"
                  >
                    {stage.title}
                  </h4>
                  {stageActive && (
                    <span className="rounded-full bg-highlight/20 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-foreground">
                      In progress
                    </span>
                  )}
                </div>
                <p className="mt-0.5 text-xs leading-5 text-muted-foreground sm:text-sm">
                  {stage.description}
                </p>
                <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                  {stage.items.map((item) => (
                    <ScheduleDateCard
                      key={item.key}
                      label={item.label}
                      formatted={item.formatted}
                      status={item.status}
                    />
                  ))}
                </dl>
              </div>
            </li>
          );
        })}
      </ol>

      <p className="flex items-center gap-2 border-t border-border bg-muted/30 px-4 py-3 text-xs text-muted-foreground sm:px-7">
        <Clock3 aria-hidden="true" className="size-3.5 shrink-0" />
        Dates and times are shown in Bangladesh Standard Time (UTC+6).
      </p>
    </article>
  );
}

const STATUS_STYLES: Record<
  MilestoneStatus,
  { card: string; label: string | null }
> = {
  done: {
    card: "border-border/70 bg-muted/30 opacity-75 hover:opacity-100",
    label: "Completed",
  },
  next: {
    card: "border-highlight bg-highlight/10 ring-2 ring-highlight/30 shadow-md",
    label: "Up next",
  },
  upcoming: { card: "border-border bg-card", label: null },
  tba: { card: "border-dashed border-border bg-card", label: null },
};

function ScheduleDateCard({
  label,
  formatted,
  status,
}: {
  label: string;
  formatted: FormattedDate;
  status: MilestoneStatus;
}) {
  const style = STATUS_STYLES[status];

  return (
    <div
      className={cn(
        "group/date min-w-0 rounded-xl border p-3.5 transition duration-200 hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-lg sm:p-4",
        style.card,
      )}
    >
      <dt className="flex items-center justify-between gap-2 text-xs font-medium leading-5 text-muted-foreground sm:text-sm">
        <span className="flex min-w-0 items-center gap-2">
          {status === "done" ? (
            <CircleCheck
              aria-hidden="true"
              className="size-4 shrink-0 text-success"
            />
          ) : (
            <CalendarDays
              aria-hidden="true"
              className="size-4 shrink-0 text-primary/70 transition-colors group-hover/date:text-primary"
            />
          )}
          <span className="truncate">{label}</span>
        </span>
        {style.label && (
          <span
            className={cn(
              "shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide",
              status === "next"
                ? "bg-highlight text-black"
                : "bg-success/15 text-success",
            )}
          >
            {style.label}
          </span>
        )}
      </dt>
      <dd className="mt-2 flex flex-wrap items-center gap-2">
        <time
          dateTime={formatted.dateTime ?? undefined}
          className={cn(
            "text-sm font-semibold tabular-nums sm:text-base",
            formatted.invalid
              ? "text-destructive"
              : status === "tba"
                ? "text-muted-foreground italic"
                : status === "done"
                  ? "text-muted-foreground line-through decoration-muted-foreground/40"
                  : "text-foreground",
          )}
        >
          {formatted.date}
        </time>
        {formatted.time && (
          <span className="inline-flex items-center gap-1 rounded-md bg-primary/8 px-2 py-1 text-xs font-semibold tabular-nums text-primary">
            <Clock3 aria-hidden="true" className="size-3.5" />
            {formatted.time}
            <span className="text-[10px] font-medium text-primary/70">BST</span>
          </span>
        )}
      </dd>
    </div>
  );
}

export function AdmissionScheduleSkeleton() {
  return (
    <section
      aria-label="Loading admission schedule"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="h-6 w-36 animate-pulse rounded-full bg-muted" />
      <div className="h-9 w-64 animate-pulse rounded bg-muted" />
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
      <div className="h-12 w-full animate-pulse rounded-xl bg-muted" />
      <div className="overflow-hidden rounded-3xl border border-border">
        <div className="h-44 animate-pulse bg-muted" />
        <div className="space-y-6 p-6">
          {Array.from({ length: 3 }, (_, i) => (
            <div key={i} className="flex gap-4">
              <div className="size-10 shrink-0 animate-pulse rounded-full bg-muted" />
              <div className="flex-1 space-y-3">
                <div className="h-5 w-40 animate-pulse rounded bg-muted" />
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="h-18 animate-pulse rounded-xl bg-muted" />
                  <div className="h-18 animate-pulse rounded-xl bg-muted" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
