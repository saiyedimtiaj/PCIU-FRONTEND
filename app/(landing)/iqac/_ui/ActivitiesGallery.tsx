"use client";

import { useState } from "react";
import Link from "next/link";
import { Calendar, Award } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IqacActivityItem, IqacGalleryPhoto } from "@/types/iqac";

/** Distinct labels in first-seen order — tabs/filters follow whatever the admin entered. */
function kinds<T>(items: T[], key: (item: T) => string) {
  return [...new Set(items.map(key))];
}

function EmptyNote({ children }: { children: React.ReactNode }) {
  return (
    <Card>
      <CardContent className="text-sm text-muted-foreground">{children}</CardContent>
    </Card>
  );
}

export default function ActivitiesGallery({
  activities,
  gallery,
}: {
  activities: IqacActivityItem[];
  gallery: IqacGalleryPhoto[];
}) {
  const [galleryFilter, setGalleryFilter] = useState("all");

  const activityTypes = kinds(activities, (a) => a.type);
  const galleryFilters = ["all", ...kinds(gallery, (g) => g.category)];
  const filteredGallery =
    galleryFilter === "all" ? gallery : gallery.filter((item) => item.category === galleryFilter);

  return (
    <>
      {/* Activities */}
      <section>
        <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Calendar className="size-5 text-primary" />
          Our Activities
        </h2>
        {activities.length ? (
          <Tabs defaultValue="all">
            <TabsList className="flex-wrap h-auto">
              <TabsTrigger value="all">All</TabsTrigger>
              {activityTypes.map((type) => (
                <TabsTrigger key={type} value={type}>
                  {type}
                </TabsTrigger>
              ))}
            </TabsList>
            {["all", ...activityTypes].map((type) => (
              <TabsContent key={type} value={type}>
                <div className="grid sm:grid-cols-2 gap-4">
                  {activities
                    .filter((a) => type === "all" || a.type === type)
                    .map((activity, i) => (
                      <ActivityCard key={`${activity.title}-${i}`} activity={activity} />
                    ))}
                </div>
              </TabsContent>
            ))}
          </Tabs>
        ) : (
          <EmptyNote>No IQAC activities have been published yet.</EmptyNote>
        )}
      </section>

      {/* Gallery */}
      <section>
        <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Award className="size-5 text-primary" />
          Gallery
        </h2>
        {gallery.length ? (
          <>
            <div className="flex flex-wrap gap-2 mb-4">
              {galleryFilters.map((filter) => (
                <button
                  key={filter}
                  type="button"
                  onClick={() => setGalleryFilter(filter)}
                  className={cn(
                    "rounded-full px-4 py-1.5 text-xs font-medium transition-colors capitalize",
                    galleryFilter === filter
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/70"
                  )}
                >
                  {filter}
                </button>
              ))}
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {filteredGallery.map((item, i) => (
                <div
                  key={`${item.image}-${i}`}
                  className="group relative aspect-video rounded-lg bg-gradient-accent overflow-hidden"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element -- API uploads, sized by the tile */}
                  <img
                    src={item.image}
                    alt={item.title}
                    loading="lazy"
                    className="absolute inset-0 size-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/0 to-black/0 p-3 transition-opacity sm:opacity-0 sm:group-hover:opacity-100">
                    <p className="text-xs font-medium text-white line-clamp-2">{item.title}</p>
                  </div>
                </div>
              ))}
            </div>
          </>
        ) : (
          <EmptyNote>No IQAC photos have been published yet.</EmptyNote>
        )}
      </section>
    </>
  );
}

function ActivityCard({ activity }: { activity: IqacActivityItem }) {
  const body = (
    <Card className="h-full overflow-hidden">
      {activity.image && (
        // eslint-disable-next-line @next/next/no-img-element -- API uploads, sized by the card
        <img src={activity.image} alt="" loading="lazy" className="aspect-video w-full object-cover" />
      )}
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm min-w-0 wrap-anywhere">{activity.title}</h3>
          <Badge variant="secondary">{activity.type}</Badge>
        </div>
        {activity.date && <p className="text-xs text-muted-foreground mb-2">{activity.date}</p>}
        {activity.description && (
          <p className="text-sm text-muted-foreground line-clamp-3 wrap-anywhere">{activity.description}</p>
        )}
      </CardContent>
    </Card>
  );

  return activity.href ? (
    <Link href={activity.href} className="block transition-opacity hover:opacity-90">
      {body}
    </Link>
  ) : (
    body
  );
}
