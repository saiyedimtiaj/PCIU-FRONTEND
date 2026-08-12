"use client";

import { useState } from "react";
import { Calendar, Award } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { IqacActivity, IqacGalleryItem } from "@/types/iqac";

const ACTIVITY_TYPES = ["Workshop", "Training", "Seminar", "Meeting"];
const GALLERY_FILTERS = ["all", "Workshop", "Training", "Meeting", "Seminar"];

export default function ActivitiesGallery({
  activities,
  gallery,
}: {
  activities: IqacActivity[];
  gallery: IqacGalleryItem[];
}) {
  const [galleryFilter, setGalleryFilter] = useState("all");

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
        <Tabs defaultValue="all">
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            {ACTIVITY_TYPES.map((type) => (
              <TabsTrigger key={type} value={type}>
                {type}
              </TabsTrigger>
            ))}
          </TabsList>
          <TabsContent value="all">
            <div className="grid sm:grid-cols-2 gap-4">
              {activities.map((activity) => (
                <ActivityCard key={activity.title} activity={activity} />
              ))}
            </div>
          </TabsContent>
          {ACTIVITY_TYPES.map((type) => (
            <TabsContent key={type} value={type}>
              <div className="grid sm:grid-cols-2 gap-4">
                {activities
                  .filter((a) => a.type === type)
                  .map((activity) => (
                    <ActivityCard key={activity.title} activity={activity} />
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </section>

      {/* Gallery */}
      <section>
        <h2 className="font-heading font-bold text-xl text-foreground mb-4 flex items-center gap-2">
          <Award className="size-5 text-primary" />
          Gallery
        </h2>
        <div className="flex flex-wrap gap-2 mb-4">
          {GALLERY_FILTERS.map((filter) => (
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
          {filteredGallery.map((item) => (
            <div
              key={item.title}
              className="group relative aspect-video rounded-lg bg-gradient-accent overflow-hidden"
            >
              <div className="absolute inset-0 flex items-end bg-linear-to-t from-black/70 via-black/0 to-black/0 p-3 opacity-0 transition-opacity group-hover:opacity-100">
                <p className="text-xs font-medium text-white">{item.title}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}

function ActivityCard({ activity }: { activity: IqacActivity }) {
  return (
    <Card>
      <CardContent>
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-foreground text-sm">{activity.title}</h3>
          <Badge variant="secondary">{activity.type}</Badge>
        </div>
        <p className="text-xs text-muted-foreground mb-2">{activity.date}</p>
        <p className="text-sm text-muted-foreground">{activity.description}</p>
      </CardContent>
    </Card>
  );
}
