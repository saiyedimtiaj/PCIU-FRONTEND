"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { CalendarDays, Camera, ArrowRight, CalendarRange } from "lucide-react";
import SeeMore from "@/components/shared/SeeMore";
import { cn } from "@/lib/utils";
import type { IqacActivityItem, IqacGalleryPhoto } from "@/types/iqac";

/** Distinct labels in first-seen order — filters follow whatever the admin entered. */
function kinds<T>(items: T[], key: (item: T) => string) {
  return [...new Set(items.map(key).filter(Boolean))];
}

function SectionTitle({ eyebrow, title }: { eyebrow: string; title: string }) {
  return (
    <div className="mb-6 sm:mb-8 text-center">
      <p className="text-xs font-semibold uppercase tracking-widest text-accent-hover mb-2">{eyebrow}</p>
      <h2 className="font-heading font-bold text-[22px] sm:text-2xl md:text-3xl leading-tight text-foreground">
        {title}
      </h2>
    </div>
  );
}

/** One row you can swipe on phones; wraps and centres from sm up. */
function FilterChips({
  options,
  value,
  onChange,
}: {
  options: string[];
  value: string;
  onChange: (value: string) => void;
}) {
  if (options.length <= 2) return null;
  return (
    <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin sm:mx-0 sm:flex-wrap sm:justify-center sm:overflow-visible sm:px-0">
      {options.map((option) => (
        <button
          key={option}
          type="button"
          onClick={() => onChange(option)}
          className={cn(
            "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium capitalize transition-colors",
            value === option
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground"
          )}
        >
          {option === "all" ? "All" : option}
        </button>
      ))}
    </div>
  );
}

function Empty({ icon: Icon, children }: { icon: typeof Camera; children: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-14 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

export default function ActivitiesGallery({
  activities,
  gallery,
}: {
  activities: IqacActivityItem[];
  gallery: IqacGalleryPhoto[];
}) {
  const [activityFilter, setActivityFilter] = useState("all");
  const [galleryFilter, setGalleryFilter] = useState("all");

  const activityFilters = ["all", ...kinds(activities, (a) => a.type)];
  const galleryFilters = ["all", ...kinds(gallery, (g) => g.category)];
  const filteredActivities =
    activityFilter === "all" ? activities : activities.filter((a) => a.type === activityFilter);
  const filteredGallery =
    galleryFilter === "all" ? gallery : gallery.filter((item) => item.category === galleryFilter);

  return (
    <>
      <section id="activities" className="bg-muted/40 border-y border-border py-10 md:py-14 scroll-mt-24">
        <div className="container mx-auto px-4">
          <SectionTitle eyebrow="What we've been doing" title="Our Activities" />
          {activities.length ? (
            <>
              <FilterChips options={activityFilters} value={activityFilter} onChange={setActivityFilter} />
              {/* Keyed by filter so switching starts collapsed again. */}
              <SeeMore key={activityFilter} items={filteredActivities} limit={6}>
                {(visible) => (
                  <div className="grid sm:grid-cols-[repeat(auto-fit,minmax(280px,380px))] justify-center gap-4 md:gap-6">
                    {visible.map((activity, i) => (
                      <ActivityCard key={`${activity.title}-${i}`} activity={activity} />
                    ))}
                  </div>
                )}
              </SeeMore>
            </>
          ) : (
            <Empty icon={CalendarRange}>No IQAC activities have been published yet.</Empty>
          )}
        </div>
      </section>

      <section id="gallery" className="container mx-auto px-4 py-10 md:py-14 scroll-mt-24">
        <SectionTitle eyebrow="Moments" title="Photo Gallery" />
        {gallery.length ? (
          <>
            <FilterChips options={galleryFilters} value={galleryFilter} onChange={setGalleryFilter} />
            <SeeMore key={galleryFilter} items={filteredGallery} limit={8}>
              {(visible) => (
                <div className="grid grid-cols-2 md:grid-cols-[repeat(auto-fit,minmax(220px,300px))] justify-center gap-2 sm:gap-4">
                  {visible.map((item, i) => (
                    <figure
                      key={`${item.image}-${i}`}
                      className="group relative aspect-4/3 overflow-hidden rounded-xl sm:rounded-2xl bg-gradient-accent"
                    >
                      <Image
                        src={item.image}
                        alt={item.title}
                        fill
                        sizes="(min-width: 1024px) 300px, (min-width: 768px) 33vw, 50vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                      <figcaption className="absolute inset-x-0 bottom-0 bg-linear-to-t from-black/75 to-transparent p-2.5 pt-8 sm:p-3 sm:pt-10 transition-opacity md:opacity-0 md:group-hover:opacity-100">
                        <p className="text-[11px] sm:text-xs font-medium text-white line-clamp-2">
                          {item.title}
                        </p>
                      </figcaption>
                    </figure>
                  ))}
                </div>
              )}
            </SeeMore>
          </>
        ) : (
          <Empty icon={Camera}>No IQAC photos have been published yet.</Empty>
        )}
      </section>
    </>
  );
}

function ActivityCard({ activity }: { activity: IqacActivityItem }) {
  const body = (
    <article className="flex h-full flex-col overflow-hidden rounded-2xl border border-border bg-card transition-all group-hover:-translate-y-1 group-hover:border-primary/30 group-hover:shadow-lg">
      <div className="relative aspect-video overflow-hidden bg-linear-to-br from-primary to-secondary">
        {activity.image ? (
          <Image
            src={activity.image}
            alt=""
            fill
            sizes="(min-width: 640px) 380px, 100vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <CalendarRange className="absolute inset-0 m-auto size-12 text-white/30" />
        )}
        {activity.type && (
          <span className="absolute top-3 left-3 rounded-full bg-accent px-2.5 py-1 text-xs font-semibold text-accent-foreground shadow-sm">
            {activity.type}
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col p-4 sm:p-5">
        {activity.date && (
          <p className="mb-2 inline-flex items-center gap-1.5 text-xs font-medium text-primary">
            <CalendarDays className="size-3.5" />
            {activity.date}
          </p>
        )}
        <h3 className="font-heading font-semibold text-foreground leading-snug wrap-anywhere group-hover:text-primary">
          {activity.title}
        </h3>
        {activity.description && (
          <p className="mt-2 text-sm text-muted-foreground line-clamp-3 wrap-anywhere">
            {activity.description}
          </p>
        )}
        {activity.href && (
          <span className="mt-auto inline-flex items-center gap-1 pt-4 text-sm font-medium text-primary">
            Read more
            <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" />
          </span>
        )}
      </div>
    </article>
  );

  return activity.href ? (
    <Link href={activity.href} className="group block h-full">
      {body}
    </Link>
  ) : (
    <div className="group h-full">{body}</div>
  );
}
