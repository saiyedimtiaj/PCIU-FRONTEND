"use client";

import Image from "next/image";
import Link from "next/link";
import { ChevronLeft, ChevronRight, Search } from "lucide-react";
import { useMemo, useState } from "react";
import type { NewsArticle } from "@/types/home";
import { formatPublishedDate, getPublishedAt } from "@/lib/news-date";

const PAGE_SIZE = 9;

export default function NewsGrid({
  articles,
  error,
}: {
  articles: NewsArticle[];
  error: boolean;
}) {
  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [date, setDate] = useState("");
  const [sort, setSort] = useState<"latest" | "oldest">("latest");
  const [page, setPage] = useState(1);

  const years = useMemo(
    () =>
      Array.from(
        new Set(articles.map((article) => getPublishedAt(article).slice(0, 4))),
      )
        .sort()
        .reverse(),
    [articles],
  );

  const filteredArticles = useMemo(() => {
    const normalizedQuery = query.trim().toLowerCase();
    return articles
      .filter((article) => {
        const publishedAt = getPublishedAt(article);
        const searchableText =
          `${article.title} ${article.excerpt ?? ""}`.toLowerCase();
        return (
          (!normalizedQuery || searchableText.includes(normalizedQuery)) &&
          (year === "all" || publishedAt.startsWith(year)) &&
          (!date || publishedAt.startsWith(date))
        );
      })
      .sort((a, b) => {
        const difference =
          new Date(getPublishedAt(a)).getTime() -
          new Date(getPublishedAt(b)).getTime();
        return sort === "latest" ? -difference : difference;
      });
  }, [articles, date, query, sort, year]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredArticles.length / PAGE_SIZE),
  );
  const currentPage = Math.min(page, totalPages);
  const visibleArticles = filteredArticles.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  if (error)
    return (
      <Message>
        News is temporarily unavailable. Please try again later.
      </Message>
    );
  if (articles.length === 0)
    return <Message>No news is available right now.</Message>;

  return (
    <div>
      <div className="mb-8 grid gap-4 rounded-2xl border border-primary/10 bg-white p-4 shadow-sm md:grid-cols-[minmax(0,2fr)_repeat(3,minmax(0,1fr))] md:p-5">
        <label className="relative block">
          <span className="sr-only">Search News</span>
          <Search className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Search News"
            className="h-10 w-full rounded-lg border border-input bg-background pl-9 pr-3 text-sm outline-none transition-colors focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="block">
          <span className="sr-only">Filter by year</span>
          <select
            value={year}
            onChange={(event) => {
              setYear(event.target.value);
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="all">All years</option>
            {years.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="sr-only">Filter by date</span>
          <input
            type="date"
            value={date}
            onChange={(event) => {
              setDate(event.target.value);
              setPage(1);
            }}
            aria-label="Filter by date"
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          />
        </label>
        <label className="block">
          <span className="sr-only">Sort by date</span>
          <select
            value={sort}
            onChange={(event) => {
              setSort(event.target.value as "latest" | "oldest");
              setPage(1);
            }}
            className="h-10 w-full rounded-lg border border-input bg-background px-3 text-sm outline-none focus:border-accent focus:ring-2 focus:ring-accent/20"
          >
            <option value="latest">Latest first</option>
            <option value="oldest">Oldest first</option>
          </select>
        </label>
      </div>

      {visibleArticles.length === 0 ? (
        <Message>No news matches the selected filters.</Message>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {visibleArticles.map((article) => (
            <Link
              key={article.id}
              href={`/news/${article.slug}`}
              className="group overflow-hidden rounded-xl border border-primary/10 bg-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="relative h-52 bg-muted">
                {article.coverImageUrl && (
                  <Image
                    src={article.coverImageUrl}
                    alt={article.title}
                    fill
                    sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                )}
              </div>
              <div className="p-5">
                <p className="mb-2 text-xs font-bold uppercase tracking-wider text-accent">
                  {article.category ?? "News"}
                </p>
                <h2 className="line-clamp-2 font-heading text-lg font-semibold text-primary group-hover:text-accent">
                  {article.title}
                </h2>
                <p className="mt-2 text-xs text-muted-foreground">
                  Published: {formatPublishedDate(getPublishedAt(article))}
                </p>
                {article.excerpt && (
                  <p className="mt-2 line-clamp-3 text-sm text-muted-foreground">
                    {article.excerpt}
                  </p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      {filteredArticles.length > PAGE_SIZE && (
        <nav
          aria-label="News pagination"
          className="mt-10 flex flex-wrap items-center justify-center gap-2"
        >
          <button
            type="button"
            onClick={() => setPage((value) => Math.max(1, value - 1))}
            disabled={currentPage === 1}
            aria-label="Previous page"
            className="flex size-9 items-center justify-center rounded-lg border border-primary/20 text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronLeft className="size-4" />
          </button>
          {Array.from({ length: totalPages }, (_, index) => index + 1).map(
            (pageNumber) => (
              <button
                key={pageNumber}
                type="button"
                onClick={() => setPage(pageNumber)}
                aria-current={currentPage === pageNumber ? "page" : undefined}
                className={`flex size-9 items-center justify-center rounded-lg border text-sm transition-colors ${currentPage === pageNumber ? "border-primary bg-primary text-primary-foreground" : "border-primary/20 text-primary hover:bg-primary/10"}`}
              >
                {pageNumber}
              </button>
            ),
          )}
          <button
            type="button"
            onClick={() => setPage((value) => Math.min(totalPages, value + 1))}
            disabled={currentPage === totalPages}
            aria-label="Next page"
            className="flex size-9 items-center justify-center rounded-lg border border-primary/20 text-primary transition-colors hover:bg-primary/10 disabled:pointer-events-none disabled:opacity-40"
          >
            <ChevronRight className="size-4" />
          </button>
        </nav>
      )}
    </div>
  );
}

function Message({ children }: { children: string }) {
  return (
    <p className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-10 text-center text-muted-foreground">
      {children}
    </p>
  );
}
