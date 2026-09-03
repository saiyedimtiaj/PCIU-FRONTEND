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
    <div className="bg-accent text-accent-foreground py-2.5 sm:py-3 relative overflow-hidden">
      <div className="container mx-auto px-3 sm:px-4">
        <div className="flex items-center gap-3 sm:gap-4">
          <Link
            href="/notices"
            className="font-semibold text-xs sm:text-sm uppercase tracking-wide whitespace-nowrap hover:underline shrink-0"
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
                    className="flex items-center gap-1.5 sm:gap-2 whitespace-nowrap"
                  >
                    {badgeText && (
                      <Badge
                        variant="outline"
                        className={`font-medium text-[10px] sm:text-xs px-1.5 sm:px-2 ${getBadgeColorClasses(
                          notice.badgeColor
                        )}`}
                      >
                        {badgeText}
                      </Badge>
                    )}
                    {Icon && <Icon className="w-3.5 h-3.5 sm:w-4 sm:h-4 shrink-0" />}
                    <span className="text-xs sm:text-sm">{notice.title}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <button
            onClick={() => setIsDismissed(true)}
            className="p-1.5 sm:p-1 hover:bg-white/10 rounded transition-colors shrink-0"
            aria-label="Dismiss notices"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}