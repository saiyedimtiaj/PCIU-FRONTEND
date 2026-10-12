"use client";

import { useState } from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import EventCard from "@/components/shared/EventCard";
import type { HomeEvent } from "@/types/home";

const PAGE_SIZE = 9;

function getDateTimestamp(value: string | null | undefined) {
  if (!value) return Number.NaN;
  return new Date(value).getTime();
}

function occursOnDate(event: HomeEvent, selectedDate: string) {
  const dayStart = new Date(`${selectedDate}T00:00:00.000Z`).getTime();
  if (!Number.isFinite(dayStart)) return false;

  const publishedAt = getDateTimestamp(event.createdAt);
  if (
    Number.isFinite(publishedAt) &&
    new Date(publishedAt).toISOString().slice(0, 10) === selectedDate
  ) {
    return true;
  }

  const dayEnd = dayStart + 24 * 60 * 60 * 1000 - 1;
  const eventStart = getDateTimestamp(event.startDateTime);
  if (!Number.isFinite(eventStart)) return false;

  const parsedEnd = getDateTimestamp(event.endDateTime) || eventStart;
  const eventEnd = Number.isFinite(parsedEnd) ? parsedEnd : eventStart;

  return eventStart <= dayEnd && eventEnd >= dayStart;
}

function occursInYear(event: HomeEvent, year: number) {
  const publishedAt = getDateTimestamp(event.createdAt);
  if (
    Number.isFinite(publishedAt) &&
    new Date(publishedAt).getUTCFullYear() === year
  ) {
    return true;
  }

  const eventStart = getDateTimestamp(event.startDateTime);
  if (!Number.isFinite(eventStart)) return false;

  const parsedEnd = getDateTimestamp(event.endDateTime) || eventStart;
  const eventEnd = Number.isFinite(parsedEnd) ? parsedEnd : eventStart;
  const yearStart = Date.UTC(year, 0, 1);
  const yearEnd = Date.UTC(year + 1, 0, 1) - 1;

  return eventStart <= yearEnd && eventEnd >= yearStart;
}

export default function EventsDirectory({
  events,
  error,
}: {
  events: HomeEvent[];
  error: boolean;
}) {
  const [query, setQuery] = useState("");
  const [selectedYear, setSelectedYear] = useState("");
  const [selectedDate, setSelectedDate] = useState("");
  const [sortOrder, setSortOrder] = useState<"latest" | "oldest">("latest");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [page, setPage] = useState(1);

  const categories = Array.from(
    new Set(
      events
        .map((event) => event.category?.trim())
        .filter((category): category is string => Boolean(category)),
    ),
  ).sort((a, b) => a.localeCompare(b));
  const years = Array.from(
    new Set(
      events.flatMap((event) =>
        [event.startDateTime, event.endDateTime, event.createdAt]
          .map(getDateTimestamp)
          .filter(Number.isFinite)
          .map((timestamp) => new Date(timestamp).getUTCFullYear()),
      ),
    ),
  ).sort((a, b) => b - a);
  const filteredEvents = events
    .filter((event) =>
      event.title
        .toLocaleLowerCase()
        .includes(query.trim().toLocaleLowerCase()),
    )
    .filter((event) => {
      if (!selectedDate) return true;
      return occursOnDate(event, selectedDate);
    })
    .filter((event) => {
      if (!selectedYear) return true;
      return occursInYear(event, Number(selectedYear));
    })
    .filter(
      (event) =>
        !selectedCategory ||
        event.category?.trim().toLocaleLowerCase() ===
          selectedCategory.toLocaleLowerCase(),
    )
    .sort((a, b) => {
      const aCreated = new Date(a.createdAt ?? "").getTime();
      const bCreated = new Date(b.createdAt ?? "").getTime();
      const aDate = Number.isFinite(aCreated)
        ? aCreated
        : new Date(a.startDateTime).getTime();
      const bDate = Number.isFinite(bCreated)
        ? bCreated
        : new Date(b.startDateTime).getTime();
      return sortOrder === "latest" ? bDate - aDate : aDate - bDate;
    });
  const pageCount = Math.ceil(filteredEvents.length / PAGE_SIZE);
  const visibleEvents = filteredEvents.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE,
  );

  function resetPage<T>(setter: (value: T) => void, value: T) {
    setter(value);
    setPage(1);
  }

  if (error) {
    return (
      <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 p-8 text-center">
        <p className="font-semibold text-primary">Unable to load events.</p>
        <p className="mt-1 text-sm text-muted-foreground">
          Please try again later.
        </p>
      </div>
    );
  }

  return (
    <>
      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-[minmax(220px,1fr)_150px_180px_170px_180px]">
        <label className="relative">
          <span className="sr-only">Search event titles</span>
          <Search
            aria-hidden="true"
            className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            value={query}
            onChange={(event) => resetPage(setQuery, event.target.value)}
            placeholder="Search event titles"
            className="pl-10"
          />
        </label>
        <label className="sr-only" htmlFor="event-year">
          Filter by year
        </label>
        <select
          id="event-year"
          aria-label="Filter by year"
          value={selectedYear}
          onChange={(event) => resetPage(setSelectedYear, event.target.value)}
          className="h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All years</option>
          {years.map((year) => (
            <option key={year} value={year}>
              {year}
            </option>
          ))}
        </select>
        <label className="sr-only" htmlFor="event-date">
          Filter by event or published date
        </label>
        <Input
          id="event-date"
          type="date"
          aria-label="Filter by date"
          value={selectedDate}
          onChange={(event) => resetPage(setSelectedDate, event.target.value)}
        />
        <select
          id="event-sort"
          aria-label="Sort events"
          value={sortOrder}
          onChange={(event) =>
            resetPage(setSortOrder, event.target.value as "latest" | "oldest")
          }
          className="h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="latest">Latest first</option>
          <option value="oldest">Oldest first</option>
        </select>
        <select
          id="event-category"
          aria-label="Filter by category"
          value={selectedCategory}
          onChange={(event) =>
            resetPage(setSelectedCategory, event.target.value)
          }
          className="h-11 w-full rounded-lg border border-input bg-card px-4 text-sm text-foreground outline-none transition-colors focus-visible:ring-2 focus-visible:ring-ring"
        >
          <option value="">All categories</option>
          {categories.map((category) => (
            <option key={category} value={category}>
              {category}
            </option>
          ))}
        </select>
      </div>

      <div
        className="mb-5 flex min-h-6 items-center justify-between gap-4 text-sm text-muted-foreground"
        aria-live="polite"
      >
        <p>
          {filteredEvents.length}{" "}
          {filteredEvents.length === 1 ? "event" : "events"} found
        </p>
        {(query ||
          selectedDate ||
          selectedYear ||
          selectedCategory ||
          sortOrder !== "latest") && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setSelectedDate("");
              setSelectedYear("");
              setSelectedCategory("");
              setSortOrder("latest");
              setPage(1);
            }}
            className="font-medium text-accent underline-offset-4 hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent"
          >
            Clear filters
          </button>
        )}
      </div>

      {visibleEvents.length === 0 ? (
        <div className="rounded-xl border border-dashed border-primary/20 bg-primary/5 px-5 py-14 text-center">
          <p className="font-heading text-lg font-semibold text-primary">
            No events found.
          </p>
          <p className="mt-1 text-sm text-muted-foreground">
            Try changing your search or filters.
          </p>
        </div>
      ) : (
        <div className="grid items-stretch gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {visibleEvents.map((event) => (
            <EventCard key={event.id || event.slug} event={event} />
          ))}
        </div>
      )}

      {pageCount > 1 && (
        <nav
          aria-label="Events pages"
          className="mt-8 flex items-center justify-center gap-4"
        >
          <button
            type="button"
            disabled={page === 1}
            onClick={() => setPage((current) => current - 1)}
            className="rounded-lg border border-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Previous
          </button>
          <span className="text-sm text-muted-foreground">
            Page {page} of {pageCount}
          </span>
          <button
            type="button"
            disabled={page === pageCount}
            onClick={() => setPage((current) => current + 1)}
            className="rounded-lg border border-primary/15 px-4 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/5 disabled:cursor-not-allowed disabled:opacity-45"
          >
            Next
          </button>
        </nav>
      )}
    </>
  );
}
