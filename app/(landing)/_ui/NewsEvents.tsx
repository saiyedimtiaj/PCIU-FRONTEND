import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Clock, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { getNewsArticles } from "@/lib/api/news";
import { formatPublishedDate, getPublishedAt } from "@/lib/news-date";
import type { EventItem } from "@/types/home";
import eventsData from "@/content/home/news-events.json";

const events = (eventsData as { events: EventItem[] }).events;

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
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between sm:mb-8">
              <h2 className="font-heading text-2xl font-bold text-primary sm:text-3xl">
                Latest News
              </h2>
              <Button
                variant="outlineAccent"
                size="cta"
                nativeButton={false}
                render={<Link href="/news" />}
                className="group/all-news border-accent/0 bg-accent/5 hover:-translate-y-0.5 hover:bg-accent hover:text-accent-foreground hover:shadow-md"
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
                    className="group overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
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
          <div>
            <h2 className="mb-6 font-heading text-2xl font-bold text-primary sm:mb-8 sm:text-3xl">
              Upcoming Events
            </h2>
            <div className="divide-y divide-primary/10 rounded-2xl border border-primary/10 bg-white shadow-sm">
              {events.map((event) => {
                const [month, day] = event.date.replace(",", "").split(" ");
                return (
                  <div key={event.title} className="flex gap-4 p-4 sm:p-5">
                    <div className="flex h-12 w-12 shrink-0 flex-col items-center justify-center rounded-lg bg-primary text-white">
                      <div className="font-heading text-base font-bold leading-tight">
                        {day}
                      </div>
                      <div className="text-[9px] font-medium uppercase tracking-wide">
                        {month}
                      </div>
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="mb-1 line-clamp-2 font-heading text-sm font-semibold text-primary">
                        {event.title}
                      </h3>
                      <div className="flex flex-col gap-0.5 text-xs text-muted-foreground">
                        <span className="flex items-center gap-1.5">
                          <Clock className="h-3 w-3" />
                          {event.time}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <MapPin className="h-3 w-3" />
                          {event.venue}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function NewsMessage({ children }: { children: string }) {
  return (
    <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}
