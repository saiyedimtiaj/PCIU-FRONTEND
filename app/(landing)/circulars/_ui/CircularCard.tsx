import { Building2, Eye, FileText, FileX } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { Circular } from "@/types/circulars";
import {
  CircularPdfActions,
  CircularStatusBadge,
  CircularTimeline,
  CircularTypeIcon,
  STATUS_META,
} from "./circular-meta";

export default function CircularCard({
  circular,
  onViewDetails,
}: {
  circular: Circular;
  onViewDetails: (circular: Circular) => void;
}) {
  const closed = circular.status === "expired" || circular.status === "inactive";

  return (
    <article
      aria-labelledby={`circular-${circular.id}-title`}
      className="@container group relative flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition-[border-color,box-shadow,transform] duration-200 hover:-translate-y-0.5 hover:border-primary/25 hover:shadow-lg motion-reduce:transition-none motion-reduce:hover:translate-y-0"
    >
      <span aria-hidden className={cn("absolute inset-x-0 top-0 h-1", STATUS_META[circular.status].bar)} />

      <div className="flex flex-1 flex-col p-5 pt-6">
        <div className="flex items-start justify-between gap-3">
          <div className="flex min-w-0 items-center gap-3">
            <span
              className={cn(
                "flex size-11 shrink-0 items-center justify-center rounded-xl",
                closed ? "bg-muted text-muted-foreground" : "bg-primary/10 text-primary",
              )}
            >
              <CircularTypeIcon type={circular.type} className="size-5" />
            </span>
            <div className="min-w-0">
              <p className="text-xs font-semibold tracking-wider text-primary uppercase">
                {circular.typeLabel} circular
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {circular.department?.shortName || (circular.department ? "Department" : "University-wide")}
              </p>
            </div>
          </div>
          <CircularStatusBadge status={circular.status} />
        </div>

        <h3 id={`circular-${circular.id}-title`} className="mt-4">
          <button
            type="button"
            onClick={() => onViewDetails(circular)}
            className={cn(
              "line-clamp-2 text-left font-heading text-lg leading-snug font-bold text-foreground transition-colors first-letter:uppercase hover:text-primary focus-visible:rounded-sm focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none",
              closed && "text-foreground/70",
            )}
          >
            {circular.title}
          </button>
        </h3>

        {circular.department && (
          <p className="mt-1.5 flex items-start gap-1.5 text-sm text-muted-foreground">
            <Building2 aria-hidden className="mt-0.5 size-4 shrink-0" />
            <span className="line-clamp-1">{circular.department.name}</span>
          </p>
        )}

        <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-foreground/75">
          {circular.description || (
            <span className="text-muted-foreground italic">No description provided.</span>
          )}
        </p>

        <CircularTimeline circular={circular} className="mt-auto" />

        <div className="mt-4 flex min-w-0 items-center gap-2.5 text-sm">
          {circular.pdfUrl ? (
            <>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <FileText aria-hidden className="size-4" />
              </span>
              <span className="min-w-0">
                <span className="block text-[0.7rem] font-medium tracking-wide text-muted-foreground uppercase">
                  PDF document
                </span>
                <span
                  className="block truncate text-xs font-medium text-foreground"
                  title={circular.pdfFileName ?? undefined}
                >
                  {circular.pdfFileName ?? "Attached document"}
                </span>
              </span>
            </>
          ) : (
            <>
              <span className="flex size-8 shrink-0 items-center justify-center rounded-lg bg-muted text-muted-foreground">
                <FileX aria-hidden className="size-4" />
              </span>
              <span className="text-xs text-muted-foreground">No document attached</span>
            </>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-2 border-t border-border/70 bg-muted/25 px-5 py-4 @sm:flex-row">
        <Button
          variant="outline"
          className="h-10 @sm:flex-1"
          onClick={() => onViewDetails(circular)}
          aria-label={`View details for ${circular.title}`}
        >
          <Eye aria-hidden />
          View Details
        </Button>
        <CircularPdfActions circular={circular} className="@sm:flex-1" />
      </div>
    </article>
  );
}
