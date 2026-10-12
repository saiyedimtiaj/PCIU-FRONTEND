"use client";

import { useState } from "react";
import { ArrowRight, X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icons";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { NoticeItem } from "@/types/home";

function formatNoticeDate(value: string | null | undefined) {
  const date = value?.match(/^(\d{4}-\d{2}-\d{2})/)?.[1];
  if (!date || Number.isNaN(Date.parse(`${date}T00:00:00Z`))) return null;

  return new Intl.DateTimeFormat("en-GB", {
    day: "2-digit",
    month: "short",
    timeZone: "UTC",
  }).format(new Date(`${date}T00:00:00Z`));
}

export default function NoticeMarqueeClient({
  notices,
}: {
  notices: NoticeItem[];
}) {
  const [isDismissed, setIsDismissed] = useState(false);
  const visibleNotices = notices
    .filter(
      (notice): notice is NoticeItem & { title: string } =>
        notice?.isHome === true &&
        notice.isActive === true &&
        typeof notice.title === "string" &&
        notice.title.trim().length > 0,
    )
    .sort((first, second) => {
      const firstOrder =
        typeof first.sortOrder === "number" && Number.isFinite(first.sortOrder)
          ? first.sortOrder
          : 0;
      const secondOrder =
        typeof second.sortOrder === "number" &&
        Number.isFinite(second.sortOrder)
          ? second.sortOrder
          : 0;
      return firstOrder - secondOrder;
    });

  if (isDismissed || visibleNotices.length === 0) return null;

  const renderNotice = (
    notice: NoticeItem & { title: string },
    duplicate = false,
  ) => {
    const Icon =
      typeof notice.icon === "string" && Object.hasOwn(iconMap, notice.icon)
        ? iconMap[notice.icon]
        : null;
    const badgeText =
      (typeof notice.badgeLabel === "string" && notice.badgeLabel.trim()) ||
      (typeof notice.category === "string" && notice.category.trim());
    const pdfUrl = resolveUploadUrl(notice.pdfUrl);
    const dateLabel = formatNoticeDate(notice.noticeDate);
    const content = (
      <>
        {badgeText && (
          <Badge
            variant="outline"
            className="shrink-0 rounded-none border-0 bg-[#0B2A5B] px-2 py-1 text-[9px] font-extrabold uppercase tracking-[0.09em] text-white  sm:px-2.5 sm:text-[10px]"
          >
            {badgeText}
          </Badge>
        )}
        {Icon && <Icon aria-hidden="true" className="size-4 shrink-0" />}
        <span className="max-w-[min(58vw,42rem)] truncate text-xs font-semibold sm:max-w-none sm:text-sm">
          {notice.title.trim()}
        </span>
        {dateLabel && (
          <time
            dateTime={notice.noticeDate ?? undefined}
            className="shrink-0 text-[10px] font-medium text-[#0B2A5B]/65 sm:text-xs"
          >
            {dateLabel}
          </time>
        )}
      </>
    );

    return (
      <div
        key={duplicate ? `duplicate-${notice.id}` : notice.id}
        role="listitem"
        className="flex min-w-0 shrink-0 items-center gap-2.5 pr-8 text-[#0B2A5B] sm:gap-3 sm:pr-12 "
      >
        {pdfUrl ? (
          <a
            href={pdfUrl}
            target="_blank"
            rel="noopener noreferrer"
            tabIndex={duplicate ? -1 : undefined}
            aria-label={`Open notice: ${notice.title.trim()} (PDF, opens in a new tab)`}
            className="flex min-w-0 items-center gap-2.5  focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d] sm:gap-3"
          >
            {content}
          </a>
        ) : (
          <div className="flex min-w-0 items-center gap-2.5 sm:gap-3">
            {content}
          </div>
        )}
      </div>
    );
  };

  return (
    <section
      aria-label="Latest university notices"
      className="border-y border-[#0B2A5B]/15 bg-[#f5b71d] text-[#0B2A5B] shadow-sm"
    >
      <div className="mx-auto flex min-h-14 max-w-screen-2xl items-center gap-2  px-5   sm:px-6 ">
        <Link
          href="/notices"
          className="flex shrink-0 items-center gap-2 bg-[#0B2A5B] px-3 py-2 text-[9px] font-extrabold uppercase tracking-[0.14em] text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d]  sm:text-[10px] "
        >
          <span
            aria-hidden="true"
            className="notice-marquee-point size-1.5 rounded-full bg-white"
          />
          <span>Notices</span>
        </Link>

        <div
          className="min-w-0 flex-1 overflow-hidden "
          role="list"
          aria-label="Current notices"
          data-slot="notice-marquee-viewport"
        >
          <div className="notice-marquee-track flex w-max min-w-full items-center">
            <div className="notice-marquee-content flex shrink-0 items-center">
              {visibleNotices.map((notice) => renderNotice(notice))}
            </div>
            <div
              aria-hidden="true"
              className="notice-marquee-content flex shrink-0 items-center"
            >
              {visibleNotices.map((notice) => renderNotice(notice, true))}
            </div>
          </div>
        </div>

        <Link
          href="/notices"
          className="notice-marquee-all-notices group hidden shrink-0 items-center gap-1 whitespace-nowrap rounded-sm px-2 py-2 text-[10px] font-extrabold uppercase tracking-[0.08em] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d] sm:inline-flex sm:text-[10px] sm:tracking-[0.12em]  border-l-2 border-white  "
        >
          <span>All Notices</span>
          <span
            aria-hidden="true"
            className="notice-marquee-point size-1.5 rounded-full bg-white"
          />
          {/* <ArrowRight aria-hidden="true" className="size-3.5 sm:size-4" /> */}
        </Link>

        <button
          type="button"
          onClick={() => setIsDismissed(true)}
          aria-label="Dismiss notices"
          className="shrink-0 rounded-full p-1 transition-colors hover:bg-[#0B2A5B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d]"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>
    </section>
  );
}
