import { Suspense } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import EventCard from "@/components/shared/EventCard";
import { getLatestPublishedEvents } from "@/lib/api/events";
import { getNewsArticles } from "@/lib/api/news";
import { formatPublishedDate, getPublishedAt } from "@/lib/news-date";

export default async function NewsEvents() {
  const { articles, error } = await getNewsArticles();
  const latestNews = articles.slice(0, 4);

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24"
      id="news"
    >
      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        <div className="grid grid-cols-1 gap-10 lg:grid-cols-3 lg:gap-12">
          {/*----------------------- Latest News-------------------------- */}
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="font-heading text-2xl font-bold text-primary sm:text-2xl">
                Latest News
              </h2>
              <Button
                variant="outlineAccent"
                size="cta"
                nativeButton={false}
                render={<Link href="/news" />}
                className="group/all-news text-white border-accent/50 bg-primary px-4  hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
              >
                All News
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/all-news:translate-x-1" />
              </Button>
            </div>
            {error ? (
              <NewsMessage>
                News is temporarily unavailable. Please try again later.
              </NewsMessage>
            ) : latestNews.length === 0 ? (
              <NewsMessage>No news is available right now.</NewsMessage>
            ) : (
              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {latestNews.map((article) => (
                  <Link
                    key={article.id}
                    href={`/news/${article.slug}`}
                    className="group overflow-hidden rounded-xl  border-t-4  border-primary hover:border-accent bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
                  >
                    <div className="relative h-44 bg-muted">
                      {article.coverImageUrl && (
                        <Image
                          src={article.coverImageUrl}
                          alt={article.title}
                          fill
                          sizes="(min-width: 640px) 40vw, 100vw"
                          className="object-cover transition-transform duration-500 group-hover:scale-105"
                        />
                      )}
                    </div>
                    <div className="p-4">
                      <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
                        {article.category ?? "News"}
                      </p>
                      <p className="mb-2 text-xs text-muted-foreground">
                        Published:{" "}
                        {formatPublishedDate(getPublishedAt(article))}
                      </p>
                      <h3 className="line-clamp-2 font-heading text-base font-semibold text-primary transition-colors group-hover:text-accent">
                        {article.title}
                      </h3>
                      {article.excerpt && (
                        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                          {article.excerpt}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            )}
          </div>
          <Suspense fallback={<EventsLoading />}>
            <UpcomingEvents />
          </Suspense>
        </div>
      </div>
    </section>
  );
}

/*-------------------- Upcoming Events------------ */

async function UpcomingEvents() {
  const { events, error } = await getLatestPublishedEvents();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3 sm:mb-8">
        <h2 className="font-heading text-2xl font-bold text-primary sm:text-2xl">
          Upcoming Events
        </h2>
        <Button
          variant="outlineAccent"
          size="cta"
          nativeButton={false}
          render={<Link href="/events" />}
          className="group/all-news text-white border-accent/50 bg-primary px-3  hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
        >
          All Events
          <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover/all-events:translate-x-1" />
        </Button>
      </div>
      {error ? (
        <NewsMessage>
          Unable to load events. Please try again later.
        </NewsMessage>
      ) : events.length === 0 ? (
        <NewsMessage>No upcoming events available.</NewsMessage>
      ) : (
        <div className="grid gap-3 ">
          {events.map((event) => (
            <EventCard key={event.id || event.slug} event={event} compact />
          ))}
        </div>
      )}
    </div>
  );
}

function EventsLoading() {
  return (
    <div aria-label="Loading events" aria-busy="true" className="grid gap-3">
      {Array.from({ length: 4 }, (_, index) => (
        <div key={index} className="h-32 animate-pulse rounded-xl bg-muted" />
      ))}
    </div>
  );
}

function NewsMessage({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
