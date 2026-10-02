"use client";

import { ArrowRight, GraduationCap, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { resolveUploadUrl } from "@/lib/upload-url";
import type { Popup } from "@/types/popup";

export default function PopupCard({
  popup,
  onAdvance,
}: {
  popup: Popup;
  onAdvance: () => void;
}) {
  const videoSource = resolveUploadUrl(popup.videoUrl ?? popup.mediaUrl);
  const isExternalLink = /^https?:\/\//i.test(popup.link);

  return (
    <aside
      aria-live="polite"
      aria-label={popup.title || popup.type}
      className="animate-fade-in-up relative max-h-[min(36rem,calc(100dvh-8rem))] w-[min(25rem,calc(100vw-2rem))] overflow-y-auto rounded-2xl border border-white/10 bg-linear-to-br from-[#111e68] via-[#102b78] to-[#153b91] p-5 text-white shadow-[0_20px_70px_-20px_rgba(5,15,55,0.75)] ring-1 ring-black/10 sm:p-6"
    >
      <div className="flex min-h-8 items-start justify-between gap-3">
        <span className="inline-flex min-h-7 items-center rounded-full border border-sky-300/20 bg-sky-400/15 px-3 text-[11px] font-bold tracking-wide text-sky-100">
          {popup.type}
        </span>
        <button
          type="button"
          aria-label="Close popup"
          onClick={onAdvance}
          className="-mr-1 -mt-1 flex size-9 shrink-0 items-center justify-center rounded-full bg-white/10 text-white/80 transition-colors hover:bg-white/20 hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-sky-300 focus-visible:ring-offset-2 focus-visible:ring-offset-[#111e68]"
        >
          <X aria-hidden="true" className="size-4" />
        </button>
      </div>

      <div className="mx-auto mt-3 flex min-h-16 w-full items-center justify-center">
        {popup.type === "VIDEO" && videoSource ? (
          <video
            key={videoSource}
            className="max-h-44 w-full rounded-xl bg-black object-contain"
            src={videoSource}
            controls
            autoPlay
            muted
            playsInline
            preload="metadata"
            aria-label={popup.title || popup.type}
            onEnded={onAdvance}
            onError={onAdvance}
          />
        ) : (
          <span className="popup-icon-halo relative flex size-14 items-center justify-center rounded-full bg-white/10 text-sky-100 shadow-[0_0_22px_rgba(56,189,248,0.26)] ring-1 ring-white/10 before:absolute before:-inset-1 before:rounded-full before:border before:border-sky-200/40 before:opacity-40 before:content-['']">
            <GraduationCap
              aria-hidden="true"
              className="popup-icon-motion size-7"
            />
          </span>
        )}
      </div>

      <div className="mt-3 space-y-1 text-center">
        {popup.title && (
          <h2 className="animate-[fade-in-up_420ms_ease-out_160ms_both] font-heading text-xl font-black leading-tight text-white [text-shadow:0_2px_12px_rgba(125,211,252,0.3)] sm:text-2xl">
            {popup.title}
          </h2>
        )}
        {popup.subtitle && (
          <p className="animate-[fade-in-up_420ms_ease-out_260ms_both] text-sm font-semibold leading-relaxed text-sky-100">
            {popup.subtitle}
          </p>
        )}
      </div>

      {popup.description && (
        <p className="mt-3 text-center text-sm leading-relaxed text-white/75">
          {popup.description}
        </p>
      )}

      {popup.buttonText && popup.link && (
        <Button
          variant="highlight"
          size="cta"
          className="popup-cta-motion mt-5 w-full text-primary font-extrabold justify-center px-5 "
          render={
            <a
              href={popup.link}
              target={isExternalLink ? "_blank" : undefined}
              rel={isExternalLink ? "noopener noreferrer" : undefined}
            />
          }
          nativeButton={false}
        >
          <span className="truncate">{popup.buttonText}</span>
          <ArrowRight aria-hidden="true" className="popup-cta-arrow  " />
        </Button>
      )}
    </aside>
  );
}
