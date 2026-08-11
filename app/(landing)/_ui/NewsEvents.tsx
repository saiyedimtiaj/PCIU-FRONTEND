"use client";

import { useState } from "react";
import Image from "next/image";
import { MapPin, ArrowRight, Clock, ChevronLeft, ChevronRight } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import newsEventsData from "@/content/home/news-events.json";
import type { NewsEventsContent } from "@/types/home";

const { news: sortedNews, events } = newsEventsData as NewsEventsContent;

const ITEMS_PER_PAGE = 6;

/**
 * Timezone-stable calendar parts. `date` is a plain "YYYY-MM-DD" string, so
 * parsing it as UTC avoids the server/client hydration mismatch that
 * `new Date(dateStr).toLocaleDateString()` produces when server and browser
 * timezones differ.
 */
function formatCalendarDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
  ];
  return { day, month: monthNames[month - 1], year };
}

export default function NewsEvents() {
  const [currentPage, setCurrentPage] = useState(0);
  const totalPages = Math.ceil(sortedNews.length / ITEMS_PER_PAGE);
  const visibleNews = sortedNews.slice(
    currentPage * ITEMS_PER_PAGE,
    (currentPage + 1) * ITEMS_PER_PAGE
  );

  return (
    <section
      className="py-20 bg-linear-to-br from-secondary/5 via-primary/10 to-accent/5"
      id="news"
    >
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
          {/* Latest News - takes 2 columns */}
          <div className="lg:col-span-2">
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl text-primary">Latest News</h2>
              <Button
                variant="ghostAccent"
                nativeButton={false}
                render={
                  <a
                    href="https://portcity.edu.bd/HomePage/ListPrimary/1/N/view-all-news"
                    target="_blank"
                    rel="noopener noreferrer"
                  />
                }
              >
                All News <ArrowRight className="w-4 h-4" />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {visibleNews.map((item) => {
                const cal = formatCalendarDate(item.date);
                return (
                  <a
                    key={item.link}
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="block group"
                  >
                    <Card className="overflow-hidden hover:shadow-lg transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30 h-full">
                      <div className="relative h-48">
                        <Image
                          src={item.image}
                          alt={item.title}
                          fill
                          sizes="(min-width: 768px) 25vw, 50vw"
                          className="object-cover group-hover:scale-105 transition-transform duration-500"
                        />
                        {/* Calendar date badge */}
                        <div className="absolute top-3 left-3 bg-primary text-primary-foreground rounded-lg overflow-hidden shadow-lg min-w-[56px]">
                          <div className="text-center px-2 py-0.5 bg-accent text-accent-foreground text-[10px] font-bold uppercase tracking-wider">
                            {cal.month}
                          </div>
                          <div className="text-center px-2 py-1">
                            <div className="font-heading font-bold text-xl leading-tight">
                              {cal.day}
                            </div>
                            <div className="text-[10px] opacity-80">{cal.year}</div>
                          </div>
                        </div>
                        <Badge className="absolute top-3 right-3 bg-secondary/90 text-secondary-foreground text-xs">
                          {item.category}
                        </Badge>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-heading font-semibold text-sm md:text-base text-primary mb-2 line-clamp-2 group-hover:text-accent transition-colors">
                          {item.title}
                        </h3>
                        <p className="text-xs text-muted-foreground line-clamp-2">
                          {item.excerpt}
                        </p>
                      </CardContent>
                    </Card>
                  </a>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="flex items-center justify-center gap-2 mt-8">
                <Button
                  variant="outlineMuted"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.max(0, p - 1))}
                  disabled={currentPage === 0}
                  aria-label="Previous page"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                {Array.from({ length: totalPages }, (_, i) => (
                  <Button
                    key={i}
                    variant={currentPage === i ? "default" : "outlineMuted"}
                    size="sm"
                    onClick={() => setCurrentPage(i)}
                  >
                    {i + 1}
                  </Button>
                ))}
                <Button
                  variant="outlineMuted"
                  size="icon"
                  onClick={() => setCurrentPage((p) => Math.min(totalPages - 1, p + 1))}
                  disabled={currentPage === totalPages - 1}
                  aria-label="Next page"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Upcoming Events - takes 1 column */}
          <div>
            <div className="flex items-center justify-between mb-8">
              <h2 className="font-heading font-bold text-3xl text-primary">Upcoming Events</h2>
            </div>

            <div className="space-y-5">
              {events.map((event) => {
                const [month, day] = event.date.replace(",", "").split(" ");
                return (
                  <Card
                    key={event.title}
                    className="hover:shadow-lg transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-secondary hover:bg-white/30"
                  >
                    <CardContent className="p-5">
                      <div className="flex gap-4">
                        <div className="flex-shrink-0 text-center">
                          <div className="w-14 h-14 bg-gradient-highlight rounded-lg flex flex-col items-center justify-center">
                            <div className="font-heading font-bold text-xl text-highlight-foreground leading-tight">
                              {day}
                            </div>
                            <div className="text-[10px] text-highlight-foreground font-medium">
                              {month}
                            </div>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <Badge className="bg-secondary text-secondary-foreground mb-1.5 text-xs">
                            {event.category}
                          </Badge>
                          <h3 className="font-heading font-semibold text-sm text-primary mb-1.5 line-clamp-2">
                            {event.title}
                          </h3>
                          <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                              <Clock className="w-3 h-3" />
                              <span>{event.time}</span>
                            </div>
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-3 h-3" />
                              <span>{event.venue}</span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
