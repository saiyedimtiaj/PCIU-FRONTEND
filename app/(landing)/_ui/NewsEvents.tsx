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
      {/* Subtle brand-colored arcs behind the heading */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-24 w-[min(820px,90vw)] -translate-x-1/2"
      >
        <svg
          className="h-full w-full"
          viewBox="0 0 820 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="campus-life-arc-fade">
              <stop offset="0%" stopColor="white" stopOpacity="0" />
              <stop offset="12%" stopColor="white" />
              <stop offset="88%" stopColor="white" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="campus-life-highlight-accent"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="820"
              y2="0"
            >
              <stop offset="0%" stopColor="var(--accent)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--accent)" />
              <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
            </linearGradient>
            <linearGradient
              id="campus-life-highlight-secondary"
              gradientUnits="userSpaceOnUse"
              x1="0"
              y1="0"
              x2="820"
              y2="0"
            >
              <stop offset="0%" stopColor="var(--secondary)" stopOpacity="0" />
              <stop offset="50%" stopColor="var(--secondary)" />
              <stop
                offset="100%"
                stopColor="var(--secondary)"
                stopOpacity="0"
              />
            </linearGradient>
            <mask id="campus-life-arc-mask">
              <rect
                width="820"
                height="110"
                fill="url(#campus-life-arc-fade)"
              />
            </mask>
          </defs>
          <g mask="url(#campus-life-arc-mask)">
            <path
              d="M20 6 Q410 82 800 6"
              stroke="hsl(42 85% 58%)"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.42"
            />
            <path
              d="M10 18 Q410 94 810 18"
              stroke="hsl(230 70% 50%)"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.24"
            />
            <path
              d="M28 30 Q410 102 792 30"
              stroke="hsl(42 85% 72%)"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.38"
            />
            <path
              d="M45 42 Q410 108 775 42"
              stroke="hsl(231 77% 22%)"
              strokeWidth="0.9"
              strokeLinecap="round"
              opacity="0.16"
            />
            <path
              d="M36 12 Q410 76 784 12"
              stroke="hsl(230 70% 50%)"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.18"
            />
            <path
              d="M18 26 Q410 100 802 26"
              stroke="hsl(42 85% 58%)"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.25"
            />
            <path
              d="M54 38 Q410 106 766 38"
              stroke="hsl(42 85% 72%)"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.22"
            />
            <path
              d="M68 50 Q410 110 752 50"
              stroke="hsl(231 77% 22%)"
              strokeWidth="0.7"
              strokeLinecap="round"
              opacity="0.12"
            />
          </g>
          <g mask="url(#campus-life-arc-mask)" opacity="1">
            <path
              className="animate-arc-highlight"
              style={{ animationDelay: "0s" }}
              d="M20 6 Q410 82 800 6"
              stroke="url(#campus-life-highlight-accent)"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeDasharray="42 858"
            />
            <path
              className="animate-arc-highlight-reverse"
              style={{ animationDelay: "-1.6s" }}
              d="M28 30 Q410 102 792 30"
              stroke="url(#campus-life-highlight-secondary)"
              strokeWidth="1.6"
              strokeLinecap="round"
              strokeDasharray="42 858"
            />
            <path
              className="animate-arc-highlight"
              style={{ animationDelay: "-1.75s" }}
              d="M54 38 Q410 106 766 38"
              stroke="url(#campus-life-highlight-accent)"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeDasharray="42 858"
            />
            <path
              className="animate-arc-highlight-reverse"
              style={{ animationDelay: "-0.9s" }}
              d="M68 50 Q410 110 752 50"
              stroke="url(#campus-life-highlight-secondary)"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeDasharray="42 858"
            />
          </g>
        </svg>
      </div>

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
