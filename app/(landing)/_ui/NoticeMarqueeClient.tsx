"use client";

import { useState } from "react";
import { X } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { iconMap } from "@/lib/icons";
import { getBadgeColorClasses } from "@/lib/utils/badge-color";
import type { NoticeItem } from "@/types/home";

export default function NoticeMarqueeClient({ notices }: { notices: NoticeItem[] }) {
  const [isDismissed, setIsDismissed] = useState(false);

  if (isDismissed || notices.length === 0) return null;

  return (
    <div className="relative overflow-hidden border-y border-[#0B2A5B]/15 bg-[#f5b71d] py-2.5 text-[#0B2A5B] shadow-sm sm:py-3">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/notices"
            className="shrink-0 whitespace-nowrap rounded-xs bg-[#0B2A5B] px-4 py-2 text-[10px] font-bold uppercase tracking-[0.12em] text-white transition-colors hover:bg-[#123d7d] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d] sm:text-xs"
          >
            Notices
          </Link>

          <div className="flex-1 overflow-hidden">
            <div className="flex items-center gap-5 sm:gap-8 animate-slide-in">
              {notices.map((notice) => {
                const Icon = notice.icon ? iconMap[notice.icon] : null;
                const badgeText = notice.badgeLabel ?? notice.category;

                return (
                  <div
                    key={notice.id}
                    className="flex items-center gap-1.5 whitespace-nowrap text-[#0B2A5B] sm:gap-2"
                  >
                    {badgeText && (
                      <Badge
                        variant="outline"
                        className={`border-white !bg-[#0B2A5B] px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-xs ${getBadgeColorClasses(
                          notice.badgeColor
                        )}`}
                      >
                        {badgeText}
                      </Badge>
                    )}
                    {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                    <span className="text-xs font-medium sm:text-sm">{notice.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="shrink-0 rounded-full p-1.5 transition-colors hover:bg-[#0B2A5B]/10 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0B2A5B] focus-visible:ring-offset-2 focus-visible:ring-offset-[#f5b71d] sm:p-1"
            aria-label="Dismiss notices"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}