"use client";

import { useState } from "react";
import { cn } from "@/lib/utils";
import type { ManagementMember } from "@/types/management";

function roleClasses(role: string) {
  if (role === "Chairman" || role === "Chairperson" || /founding/i.test(role)) {
    return "bg-highlight/15 text-highlight";
  }
  if (role === "Member Secretary") return "bg-accent/15 text-accent";
  return "bg-primary/10 text-primary";
}

/**
 * The Vice Chancellor's profile card (`vice-chancellors-message/page.tsx`)
 * at ~60% scale: offset primary backing slab, gold corner brackets, and a
 * name plate overlapping the bottom of the photo.
 */
export default function MemberCard({ member }: { member: ManagementMember }) {
  const initial = member.name.replace(/^(Mr\.|Ms\.|Mrs\.|Dr\.|Prof\.|Engr\.)\s*/g, "")[0];
  // Uploaded photos can be missing on the API host — fall back to the initial.
  const [imgFailed, setImgFailed] = useState(false);
  const showImg = member.img && !imgFailed;

  return (
    <div className="relative mx-auto w-full max-w-[230px] pl-2.5 pt-2.5">
      <div className="pointer-events-none absolute left-0 top-0 bottom-4 w-[calc(100%-12px)] rounded-[18px] bg-primary" />

      <div className="relative z-10 flex h-full flex-col rounded-xl bg-card p-2.5 shadow-[0_15px_42px_rgba(8,47,103,0.13)]">
        <div className="group relative aspect-[5/4] overflow-hidden rounded-[13px] bg-[#EEF5FC]">
          {showImg ? (
            // eslint-disable-next-line @next/next/no-img-element -- onError fallback; images are unoptimized anyway
            <img
              src={member.img!}
              alt={member.name}
              onError={() => setImgFailed(true)}
              className="h-full w-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-[1.035] motion-reduce:transition-none"
            />
          ) : (
            <div className="flex h-full items-center justify-center font-heading text-3xl font-bold text-primary/60">
              {initial}
            </div>
          )}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#082F67]/15 via-transparent to-transparent" />
          <div className="pointer-events-none absolute right-2 top-2 h-10 w-10 rounded-tr-xl border-r-[3px] border-t-[3px] border-accent" />
          <div className="pointer-events-none absolute bottom-6 left-2 h-8 w-8 rounded-bl-xl border-b-[3px] border-l-[3px] border-accent" />
          <span className="absolute left-2 top-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground shadow">
            {member.serial}
          </span>
        </div>

        <div className="relative z-20 -mt-4 ml-3 rounded-xl bg-primary px-3 py-2.5 shadow-[0_8px_21px_rgba(8,47,103,0.13)]">
          <h3 className="font-heading text-xs font-bold leading-snug text-white">{member.name}</h3>
          {member.designation && (
            <p
              className="mt-0.5 line-clamp-3 text-[11px] font-bold leading-relaxed tracking-wide text-accent"
              title={member.designation}
            >
              {member.designation}
            </p>
          )}
        </div>

        <div className="flex justify-center pt-2.5 pb-0.5">
          <span
            className={cn(
              "inline-block rounded-full px-2.5 py-0.5 text-[11px] font-medium",
              roleClasses(member.role)
            )}
          >
            {member.role}
          </span>
        </div>
      </div>
    </div>
  );
}
