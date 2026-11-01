"use client";

import { Building2, CalendarDays, FileText, FileX } from "lucide-react";
import { Modal } from "@/components/shared/Modal";
import { Button } from "@/components/ui/button";
import type { Circular } from "@/types/circulars";
import {
  CircularPdfActions,
  CircularStatusBadge,
  CircularTimeline,
  CircularTypeBadge,
} from "./circular-meta";

export default function CircularDetailsModal({
  circular,
  open,
  onClose,
}: {
  circular: Circular | null;
  open: boolean;
  onClose: () => void;
}) {
  if (!circular) return null;

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={circular.title}
      size="xl"
      className="[&_h2]:pr-2 [&_h2]:font-heading [&_h2]:text-xl [&_h2]:leading-snug [&_h2]:first-letter:uppercase"
      footer={
        <>
          <Button variant="outline" className="h-10" onClick={onClose}>
            Close
          </Button>
          <CircularPdfActions circular={circular} className="sm:min-w-56" />
        </>
      }
    >
      <div className="space-y-5">
        <div className="flex flex-wrap items-center gap-2">
          <CircularTypeBadge circular={circular} />
          <CircularStatusBadge status={circular.status} />
          {circular.updatedAtLabel && (
            <span className="ml-auto flex items-center gap-1 text-xs text-muted-foreground">
              <CalendarDays aria-hidden className="size-3.5" />
              Updated {circular.updatedAtLabel}
            </span>
          )}
        </div>

        <section
          aria-label="Department"
          className="flex items-center gap-3 rounded-xl border border-border/70 p-3.5"
        >
          <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Building2 aria-hidden className="size-5" />
          </span>
          {circular.department ? (
            <div className="min-w-0">
              <p className="font-semibold text-foreground">{circular.department.name}</p>
              {circular.department.shortName && (
                <p className="text-sm text-muted-foreground">{circular.department.shortName}</p>
              )}
            </div>
          ) : (
            <p className="text-sm text-muted-foreground">University-wide — not tied to a department.</p>
          )}
        </section>

        <CircularTimeline circular={circular} />

        <section>
          <h3 className="mb-2 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            Description
          </h3>
          {circular.description ? (
            <p className="text-sm leading-relaxed whitespace-pre-line text-foreground/85">
              {circular.description}
            </p>
          ) : (
            <p className="text-sm text-muted-foreground italic">No description provided.</p>
          )}
        </section>

        <section className="flex items-center gap-3 rounded-xl border border-dashed border-border p-3.5 text-sm">
          {circular.pdfUrl ? (
            <>
              <span className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-destructive/10 text-destructive">
                <FileText aria-hidden className="size-4.5" />
              </span>
              <span className="min-w-0">
                <span className="block text-xs text-muted-foreground">Attached PDF</span>
                <span className="block truncate font-medium" title={circular.pdfFileName ?? undefined}>
                  {circular.pdfFileName ?? "Circular document"}
                </span>
              </span>
            </>
          ) : (
            <>
              <FileX aria-hidden className="size-5 shrink-0 text-muted-foreground" />
              <span className="text-muted-foreground">No PDF document is attached to this circular.</span>
            </>
          )}
        </section>
      </div>
    </Modal>
  );
}
