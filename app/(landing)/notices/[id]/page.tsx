import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  ArrowLeft,
  CalendarDays,
  Download,
  ExternalLink,
  FileText,
} from "lucide-react";
import Breadcrumb from "@/components/shared/Breadcrumb";
import { Badge } from "@/components/ui/badge";
import { buttonVariants } from "@/components/ui/button";
import { getPublicNoticeById, getPublicNotices } from "@/lib/api/notices";
import { formatNoticeDate, getNoticeDateParts } from "@/lib/notice-date";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { NoticeApiRecord } from "@/types/notices";

type NoticeDetailProps = { params: Promise<{ id: string }> };

function parseNoticeId(value: string): number | null {
  if (!/^\d+$/.test(value)) return null;
  const id = Number(value);
  return Number.isSafeInteger(id) && id > 0 ? id : null;
}

function getDepartmentName(notice: NoticeApiRecord): string {
  return (
    notice.department?.name?.trim() ||
    notice.department?.shortName?.trim() ||
    "Port City International University"
  );
}

export async function generateMetadata({
  params,
}: NoticeDetailProps): Promise<Metadata> {
  const id = parseNoticeId((await params).id);
  const notice = id ? await getPublicNoticeById(id) : null;

  if (!notice) {
    return { title: "Notice not found | Port City International University" };
  }

  const category = notice.category?.trim() || "General";
  const title = notice.title?.trim() || "Untitled notice";
  const description = `${category} notice from ${getDepartmentName(notice)}: ${title}`;

  return {
    title: `${title} | PCIU Notice Board`,
    description,
    openGraph: { title, description, type: "article" },
  };
}

export default async function NoticeDetailsPage({ params }: NoticeDetailProps) {
  const id = parseNoticeId((await params).id);
  if (!id) notFound();

  const notice = await getPublicNoticeById(id);
  if (!notice) notFound();

  const allNotices = await getPublicNotices();
  const departmentSlug = notice.department?.slug?.trim() || null;
  const relatedNotices = allNotices
    .filter((item) => item.id !== notice.id)
    .sort((a, b) => {
      const aSame = a.department?.slug === departmentSlug ? 1 : 0;
      const bSame = b.department?.slug === departmentSlug ? 1 : 0;
      return bSame - aSame;
    })
    .slice(0, 4);

  const pdfUrl = resolveUploadUrl(notice.pdfUrl ?? null) || null;
  const dateValue = notice.noticeDate ?? notice.createdAt ?? null;
  const title = notice.title?.trim() || "Untitled notice";
  const category = notice.badgeLabel?.trim() || notice.category || "General";
  const department = notice.department?.shortName?.trim() || null;

  return (
    <div className="min-h-screen bg-background">
      <Breadcrumb
        items={[{ label: "Notices", href: "/notices" }, { label: title }]}
      />

      <main className="container mx-auto max-w-6xl px-4 py-8 sm:px-6 sm:py-12">
        <Link
          href="/notices"
          className="mb-5 inline-flex items-center gap-2 text-sm font-medium text-primary transition-colors hover:text-accent focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
        >
          <ArrowLeft aria-hidden="true" className="h-4 w-4" />
          All notices
        </Link>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
          <article className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
            <header className="border-b border-primary/10 p-5 sm:p-8">
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <Badge variant="outline" className="border-accent/40 text-accent">
                  {category}
                </Badge>
                {notice.department?.slug && (
                  <Link
                    href={`/department/${notice.department.slug}`}
                    className="text-xs font-semibold text-primary hover:text-accent hover:underline"
                  >
                    {getDepartmentName(notice)}
                  </Link>
                )}
              </div>
              <h1 className="font-heading text-2xl font-bold leading-tight text-primary sm:text-3xl lg:text-4xl">
                {title}
              </h1>
              <dl className="mt-5 flex flex-wrap gap-x-8 gap-y-3 text-sm text-muted-foreground">
                <div>
                  <dt className="sr-only">Published date</dt>
                  <dd className="flex items-center gap-2">
                    <CalendarDays
                      aria-hidden="true"
                      className="h-4 w-4 shrink-0 text-accent"
                    />
                    <span>{formatNoticeDate(dateValue)}</span>
                  </dd>
                </div>
                <div>
                  <dt className="sr-only">Department</dt>
                  <dd>
                    <span className="font-semibold text-primary">
                      {getDepartmentName(notice)}
                    </span>
                    {department && (
                      <span className="ml-2 text-muted-foreground">
                        ({department})
                      </span>
                    )}
                  </dd>
                </div>
              </dl>
            </header>

            {pdfUrl ? (
              <section aria-labelledby="notice-document-heading">
                <div className="flex flex-wrap items-center justify-between gap-3 border-b border-primary/10 bg-muted/30 px-4 py-3 sm:px-6">
                  <h2
                    id="notice-document-heading"
                    className="flex items-center gap-2 text-sm font-semibold text-primary"
                  >
                    <FileText
                      aria-hidden="true"
                      className="h-4 w-4 text-accent"
                    />
                    Notice document
                  </h2>
                  <div className="flex items-center gap-2">
                    <a
                      href={pdfUrl}
                      target="_blank"
                      rel="noreferrer"
                      className={buttonVariants({
                        variant: "outline",
                        size: "sm",
                      })}
                    >
                      <ExternalLink aria-hidden="true" className="h-4 w-4" />
                      Open
                    </a>
                    <a
                      href={pdfUrl}
                      download
                      className={buttonVariants({
                        variant: "default",
                        size: "sm",
                      })}
                    >
                      <Download aria-hidden="true" className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                </div>
                <iframe
                  src={`${pdfUrl}#view=FitH`}
                  title={`${title} (PDF preview)`}
                  className="h-[70vh] min-h-[420px] w-full bg-muted"
                />
              </section>
            ) : (
              <div className="p-8 text-center text-sm text-muted-foreground">
                No document has been attached to this notice.
              </div>
            )}
          </article>

          <aside aria-labelledby="more-notices-heading" className="space-y-4">
            <div className="overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm">
              <div className="flex items-center justify-between gap-2 border-b border-primary/10 bg-muted/30 px-4 py-3">
                <h2
                  id="more-notices-heading"
                  className="font-heading text-sm font-bold uppercase tracking-wide text-primary"
                >
                  More notices
                </h2>
                <Link
                  href="/notices"
                  className="text-xs font-semibold text-accent hover:underline"
                >
                  View all
                </Link>
              </div>
              {relatedNotices.length === 0 ? (
                <p className="p-5 text-sm text-muted-foreground">
                  No other notices published yet.
                </p>
              ) : (
                <ul className="divide-y divide-primary/10">
                  {relatedNotices.map((item) => (
                    <li key={item.id}>
                      <RelatedNoticeRow notice={item} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </aside>
        </div>
      </main>
    </div>
  );
}

function RelatedNoticeRow({ notice }: { notice: NoticeApiRecord }) {
  const dateValue = notice.noticeDate ?? notice.createdAt ?? null;
  const dateParts = getNoticeDateParts(dateValue);
  const title = notice.title?.trim() || "Untitled notice";

  return (
    <Link
      href={`/notices/${notice.id}`}
      className="group flex items-start gap-3 px-4 py-3 transition-colors hover:bg-primary/[0.03] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-accent"
    >
      <span
        aria-hidden="true"
        className="flex w-11 shrink-0 flex-col items-center justify-center rounded-md bg-primary/5 py-1.5 text-primary"
      >
        {dateParts ? (
          <>
            <span className="text-[9px] font-bold uppercase tracking-wide text-primary/70">
              {dateParts.month}
            </span>
            <span className="font-heading text-base font-bold leading-none">
              {dateParts.day}
            </span>
          </>
        ) : (
          <FileText className="h-4 w-4" />
        )}
      </span>
      <span className="min-w-0">
        <span className="line-clamp-2 text-sm font-medium text-primary transition-colors group-hover:text-accent">
          {title}
        </span>
        <span className="mt-1 block text-[10px] font-semibold uppercase tracking-wider text-accent">
          {notice.badgeLabel?.trim() || notice.category || "General"}
        </span>
      </span>
    </Link>
  );
}
