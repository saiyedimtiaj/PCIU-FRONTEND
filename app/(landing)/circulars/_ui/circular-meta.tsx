import {
  BriefcaseBusiness,
  Clock,
  Download,
  ExternalLink,
  FileText,
  Gavel,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Circular, CircularStatus } from "@/types/circulars";

export function CircularTypeIcon({ type, className }: { type: string; className?: string }) {
  if (type === "JOB") return <BriefcaseBusiness aria-hidden className={className} />;
  if (type === "TENDER") return <Gavel aria-hidden className={className} />;
  return <FileText aria-hidden className={className} />;
}

export function CircularTypeBadge({ circular }: { circular: Circular }) {
  return (
    <Badge variant="info" className="gap-1">
      <CircularTypeIcon type={circular.type} />
      {circular.typeLabel}
    </Badge>
  );
}

export const STATUS_META: Record<
  CircularStatus,
  {
    label: string;
    variant: "success" | "info" | "muted" | "outline";
    dot: string;
    /** Top accent strip on cards. */
    bar: string;
  }
> = {
  active: { label: "Active", variant: "success", dot: "bg-success", bar: "bg-success" },
  upcoming: { label: "Upcoming", variant: "info", dot: "bg-info", bar: "bg-info" },
  expired: {
    label: "Expired",
    variant: "muted",
    dot: "bg-muted-foreground",
    bar: "bg-muted-foreground/30",
  },
  inactive: {
    label: "Inactive",
    variant: "outline",
    dot: "bg-muted-foreground/60",
    bar: "bg-border",
  },
};

export function CircularStatusBadge({ status }: { status: CircularStatus }) {
  const meta = STATUS_META[status];
  return (
    <Badge variant={meta.variant} className="gap-1.5">
      <span
        aria-hidden
        className={cn("size-1.5 rounded-full", meta.dot, status === "active" && "animate-pulse")}
      />
      {meta.label}
    </Badge>
  );
}

/** Published → deadline, with how much of the window has elapsed. */
export function CircularTimeline({
  circular,
  className,
}: {
  circular: Circular;
  className?: string;
}) {
  const noteTone =
    circular.status === "active"
      ? circular.urgent
        ? "text-destructive"
        : "text-success"
      : circular.status === "upcoming"
        ? "text-info"
        : "text-muted-foreground";

  return (
    <div className={cn("rounded-xl border border-border/70 bg-muted/40 p-3.5", className)}>
      <dl className="flex items-start justify-between gap-3 text-sm">
        <div className="min-w-0">
          <dt className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
            Published
          </dt>
          <dd className="mt-0.5 font-semibold text-foreground">
            {circular.startDateLabel ?? "Not specified"}
          </dd>
        </div>
        <div className="min-w-0 text-right">
          <dt className="text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
            Deadline
          </dt>
          <dd className="mt-0.5 font-semibold text-foreground">
            {circular.endDateLabel ?? "Not specified"}
          </dd>
        </div>
      </dl>

      {circular.progress !== null && (
        <div
          role="progressbar"
          aria-label="Time elapsed before the deadline"
          aria-valuenow={circular.progress}
          aria-valuemin={0}
          aria-valuemax={100}
          className="mt-3 h-1.5 overflow-hidden rounded-full bg-border"
        >
          <div
            className={cn(
              "h-full rounded-full transition-[width]",
              circular.urgent ? "bg-destructive" : "bg-success",
            )}
            style={{ width: `${Math.max(circular.progress, 4)}%` }}
          />
        </div>
      )}

      {circular.deadlineNote && (
        <p className={cn("mt-2.5 flex items-center gap-1.5 text-xs font-semibold", noteTone)}>
          <Clock aria-hidden className="size-3.5" />
          {circular.deadlineNote}
        </p>
      )}
    </div>
  );
}

export function CircularPdfActions({
  circular,
  className,
}: {
  circular: Circular;
  className?: string;
}) {
  if (!circular.pdfUrl) return null;

  return (
    <div className={cn("flex gap-2", className)}>
      <a
        href={circular.pdfUrl}
        target="_blank"
        rel="noopener noreferrer"
        className={cn(buttonVariants({ variant: "default" }), "flex-1")}
        aria-label={`View PDF for ${circular.title} (opens in a new tab)`}
      >
        <ExternalLink aria-hidden />
        View PDF
      </a>
      <a
        href={circular.pdfUrl}
        download={circular.pdfFileName ?? true}
        className={buttonVariants({ variant: "outline", size: "icon-lg", className: "size-10" })}
        aria-label={`Download PDF for ${circular.title}`}
        title="Download PDF"
      >
        <Download aria-hidden />
      </a>
    </div>
  );
}
