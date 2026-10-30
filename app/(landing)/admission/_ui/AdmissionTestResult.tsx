import {
  CalendarDays,
  CheckCircle2,
  Download,
  ExternalLink,
  FileText,
  GraduationCap,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  getAdmissionTestResult,
  type AdmissionTestResultData,
} from "@/lib/api/admission";
import { resolveUploadUrl } from "@/lib/upload-url";

const PUBLISHED_DATE_FORMATTER = new Intl.DateTimeFormat("en-GB", {
  day: "numeric",
  month: "long",
  year: "numeric",
  timeZone: "Asia/Dhaka",
});

function formatPublishedDate(value: string | null) {
  if (!value) return null;
  const timestamp = Date.parse(value);
  if (!Number.isFinite(timestamp)) return null;
  return PUBLISHED_DATE_FORMATTER.format(new Date(timestamp));
}

export default async function AdmissionTestResult() {
  const result = await getAdmissionTestResult();

  return (
    <section
      aria-labelledby="admission-test-result-title"
      className="space-y-6"
    >
      <header className="space-y-2">
        <div className="inline-flex items-center gap-2 rounded-full border border-primary/15 bg-primary/5 px-3 py-1 text-xs font-semibold text-primary">
          <GraduationCap aria-hidden="true" className="size-3.5" />
          Examination update
        </div>
        <h2
          id="admission-test-result-title"
          className="font-heading text-2xl font-bold text-foreground sm:text-3xl"
        >
          Admission Test Result
        </h2>
        <p className="max-w-2xl text-sm leading-6 text-muted-foreground sm:text-base">
          Check your admission test results here.
        </p>
      </header>

      {result.status === "error" ? (
        <div
          role="alert"
          className="rounded-2xl border border-destructive/20 bg-destructive/5 p-6 sm:p-8"
        >
          <h3 className="font-semibold text-foreground">
            Admission test result is temporarily unavailable
          </h3>
          <p className="mt-2 text-sm leading-6 text-muted-foreground">
            Please try again later. We are unable to load the latest result
            right now.
          </p>
        </div>
      ) : result.status === "empty" ? (
        <div
          role="status"
          className="rounded-2xl border border-border bg-card px-6 py-10 text-center shadow-sm sm:px-10"
        >
          <FileText
            aria-hidden="true"
            className="mx-auto size-10 text-primary/60"
          />
          <h3 className="mt-4 font-heading text-lg font-semibold text-foreground">
            No test result published yet
          </h3>
          <p className="mx-auto mt-2 max-w-md text-sm leading-6 text-muted-foreground">
            The latest admission test result will appear here once it is
            published.
          </p>
        </div>
      ) : (
        <ResultCard result={result.data} />
      )}
    </section>
  );
}

function ResultCard({ result }: { result: AdmissionTestResultData }) {
  const pdfUrl = resolveUploadUrl(result.pdfUrl);
  const publishedDate = formatPublishedDate(result.publishedAt);

  return (
    <article className="overflow-hidden rounded-2xl border border-border bg-card shadow-sm transition duration-200 hover:-translate-y-0.5 hover:border-primary/20 hover:shadow-lg">
      <div className="relative overflow-hidden bg-linear-to-br from-primary/[0.07] via-card to-secondary/10 p-5 sm:p-7">
        <div
          aria-hidden="true"
          className="pointer-events-none absolute -right-12 -top-16 size-48 rounded-full bg-primary/5 blur-3xl"
        />
        <div className="relative flex flex-col gap-5 sm:flex-row sm:items-start sm:justify-between">
          <div className="flex min-w-0 items-start gap-4">
            <span className="flex size-12 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-sm">
              <FileText aria-hidden="true" className="size-6" />
            </span>
            <div className="min-w-0">
              <div className="flex min-w-0 flex-wrap items-center gap-2">
                <Badge variant={result.isActive ? "success" : "muted"}>
                  <CheckCircle2
                    aria-hidden="true"
                    className="mr-1 size-3.5"
                  />
                  {result.isActive ? "Published" : "Inactive"}
                </Badge>
                <h3 className="min-w-0 truncate font-heading text-xl font-bold text-primary sm:text-2xl">
                  {result.semesterName}
                </h3>
              </div>
              <p className="mt-2 flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays
                  aria-hidden="true"
                  className="size-4 shrink-0 text-primary/70"
                />
                <span>Admission test results · {result.year}</span>
              </p>
            </div>
          </div>

          <div className="flex shrink-0 items-center gap-3 rounded-xl border border-border/80 bg-card/80 px-4 py-3 sm:min-w-36">
            <span className="flex size-9 items-center justify-center rounded-lg bg-primary/8 text-primary">
              <CalendarDays aria-hidden="true" className="size-4" />
            </span>
            <div>
              <p className="text-[11px] font-medium uppercase tracking-wide text-muted-foreground">
                Published
              </p>
              <p className="mt-0.5 text-sm font-semibold text-foreground">
                {publishedDate ?? "Date unavailable"}
              </p>
            </div>
          </div>
        </div>
      </div>

      {pdfUrl ? (
        <>
          <div className="flex flex-col gap-3 border-t border-border p-4 sm:flex-row sm:items-center sm:justify-between sm:px-6">
            <div className="flex min-w-0 items-center gap-3">
              <span className="flex size-10 shrink-0 items-center justify-center rounded-lg bg-primary/5 text-primary">
                <FileText aria-hidden="true" className="size-5" />
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-foreground">
                  Official admission test result
                </p>
                <p className="text-xs text-muted-foreground">
                  PDF document
                </p>
              </div>
            </div>
            <div className="flex shrink-0 flex-wrap gap-2">
              <a
                href={pdfUrl}
                target="_blank"
                rel="noopener noreferrer"
                aria-label={`Preview ${result.semesterName} admission test result PDF`}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg border border-primary/20 bg-card px-4 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary/5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary sm:flex-none"
              >
                <ExternalLink aria-hidden="true" className="size-4" />
                Preview PDF
              </a>
              <a
                href={pdfUrl}
                download
                aria-label={`Download ${result.semesterName} admission test result PDF`}
                className="inline-flex min-h-10 flex-1 items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground shadow-sm transition duration-200 hover:-translate-y-0.5 hover:bg-primary/90 hover:shadow-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 sm:flex-none"
              >
                <Download aria-hidden="true" className="size-4" />
                Download PDF
              </a>
            </div>
          </div>
          <div className="border-t border-border bg-muted/20 p-3 sm:p-5">
            <iframe
              src={`${pdfUrl}#view=FitH`}
              title={`${result.semesterName} admission test result PDF preview`}
              className="h-[420px] w-full rounded-lg border border-border bg-card sm:h-[560px] lg:h-[680px]"
            />
          </div>
        </>
      ) : (
        <div
          role="status"
          className="border-t border-border px-5 py-8 text-center"
        >
          <FileText
            aria-hidden="true"
            className="mx-auto size-8 text-muted-foreground"
          />
          <p className="mt-3 font-medium text-foreground">
            Result PDF is not available
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Please check back later for the downloadable result.
          </p>
        </div>
      )}
    </article>
  );
}

export function AdmissionTestResultSkeleton() {
  return (
    <section
      aria-label="Loading admission test result"
      aria-busy="true"
      className="space-y-5"
    >
      <div className="h-6 w-40 animate-pulse rounded-full bg-muted" />
      <div className="h-9 w-72 animate-pulse rounded bg-muted" />
      <div className="h-5 w-full max-w-lg animate-pulse rounded bg-muted" />
      <div className="h-40 w-full animate-pulse rounded-2xl bg-muted" />
      <div className="h-[420px] w-full animate-pulse rounded-xl bg-muted sm:h-[560px]" />
    </section>
  );
}
