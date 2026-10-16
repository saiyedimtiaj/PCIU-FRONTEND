"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Microscope,
  Beaker,
  BookOpen,
  Handshake,
  FileText,
  Search,
  ExternalLink,
  Building2,
  MapPin,
  CalendarDays,
  Globe,
  RotateCcw,
  type LucideIcon,
} from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import SeeMore from "@/components/shared/SeeMore";
import { iconMap } from "@/lib/icons";
import { cn } from "@/lib/utils";
import {
  RESEARCH_SECTION_IDS,
  type ResearchPageContent,
  type ResearchSectionId,
} from "@/types/research";

const TAB_META: {
  id: ResearchSectionId;
  label: string;
  /** Fits a fifth of a 320px screen. */
  short: string;
  icon: LucideIcon;
  title: string;
  description: string;
}[] = [
  {
    id: "centres",
    label: "Centres",
    short: "Centres",
    icon: Microscope,
    title: "Research Centres",
    description:
      "Dedicated centres and cells that lead research across every faculty.",
  },
  {
    id: "areas",
    label: "Areas",
    short: "Areas",
    icon: Beaker,
    title: "Research Areas",
    description: "The university-wide themes our researchers focus on.",
  },
  {
    id: "publications",
    label: "Publications",
    short: "Papers",
    icon: BookOpen,
    title: "Research & Publications",
    description:
      "Journal articles, conference papers and chapters by PCIU faculty.",
  },
  {
    id: "partnerships",
    label: "Partnerships",
    short: "Partners",
    icon: Handshake,
    title: "Partnerships",
    description:
      "Academic, industry and international institutions we collaborate with.",
  },
  {
    id: "mous",
    label: "MoUs",
    short: "MoUs",
    icon: FileText,
    title: "Memoranda of Understanding",
    description:
      "Formal agreements that anchor our research and academic collaborations.",
  },
];

/**
 * Area colors are typed in by admins, but Tailwind only generates classes it
 * finds in source — so a gradient is used only when it's one of these, a CSS
 * color goes inline, and anything else takes the next gradient in turn.
 */
const AREA_GRADIENTS = [
  "from-blue-500 to-indigo-600",
  "from-cyan-500 to-teal-600",
  "from-emerald-500 to-green-600",
  "from-pink-500 to-rose-600",
  "from-amber-500 to-orange-600",
  "from-purple-500 to-fuchsia-600",
  "from-red-500 to-pink-600",
  "from-slate-500 to-gray-700",
];

const CSS_COLOR = /^(#[0-9a-f]{3,8}|(rgb|hsl|oklch)a?\(.+\))$/i;

function areaBackground(color: string, index: number) {
  if (CSS_COLOR.test(color))
    return { className: "", style: { backgroundColor: color } };
  const gradient = AREA_GRADIENTS.includes(color)
    ? color
    : AREA_GRADIENTS[index % AREA_GRADIENTS.length];
  return { className: `bg-linear-to-br ${gradient}`, style: undefined };
}

const DOT_PATTERN = {
  backgroundImage:
    "radial-gradient(circle at 1px 1px, white 1px, transparent 0)",
  backgroundSize: "16px 16px",
};

function monogram(name: string) {
  const words = name
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .split(/\s+/)
    .filter((w) => w && !/^(of|the|and|for|&)$/i.test(w));
  return (
    words.length > 1 ? words[0][0] + words[1][0] : (words[0] ?? "?").slice(0, 2)
  ).toUpperCase();
}

function Empty({
  icon: Icon,
  children,
}: {
  icon: LucideIcon;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-muted/30 px-6 py-16 text-center">
      <div className="mb-3 flex size-12 items-center justify-center rounded-full bg-muted text-muted-foreground">
        <Icon className="size-6" />
      </div>
      <p className="text-sm text-muted-foreground">{children}</p>
    </div>
  );
}

/** How many of each list show before "See more". */
const PREVIEW = { centres: 6, publications: 6, partnerships: 8, mous: 5 };

/** `items` lets the trigger show "All Years" rather than the raw "all" value. */
function FilterSelect({
  value,
  onChange,
  allLabel,
  options,
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  allLabel: string;
  options: string[];
  className?: string;
}) {
  const items = [
    { label: allLabel, value: "all" },
    ...options.map((o) => ({ label: o, value: o })),
  ];
  return (
    <Select
      items={items}
      value={value}
      onValueChange={(v) => onChange(v ?? "all")}
    >
      <SelectTrigger className={cn("w-full px-2.5 sm:px-3", className)}>
        <SelectValue className="truncate" />
      </SelectTrigger>
      <SelectContent>
        {items.map((item) => (
          <SelectItem key={item.value} value={item.value}>
            {item.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}

function SectionHeader({
  id,
  count,
  noun,
}: {
  id: ResearchSectionId;
  count: number;
  noun: string;
}) {
  const meta = TAB_META.find((t) => t.id === id)!;
  return (
    <div className="mb-6 sm:mb-8 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
      <div>
        <h2 className="font-heading font-bold text-[22px] sm:text-2xl md:text-3xl leading-tight text-foreground">
          {meta.title}
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">{meta.description}</p>
      </div>
      {count > 0 && (
        <p className="shrink-0 text-sm text-muted-foreground">
          <span className="font-semibold text-foreground tabular-nums">
            {count}
          </span>{" "}
          {noun}
        </p>
      )}
    </div>
  );
}

export default function ResearchTabs({
  content,
}: {
  content: ResearchPageContent;
}) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const requested = searchParams.get("section");
  const activeTab: ResearchSectionId = RESEARCH_SECTION_IDS.includes(
    requested as ResearchSectionId,
  )
    ? (requested as ResearchSectionId)
    : "centres";

  const [query, setQuery] = useState("");
  const [year, setYear] = useState("all");
  const [type, setType] = useState("all");
  const [dept, setDept] = useState("all");
  const [partnerType, setPartnerType] = useState("all");

  const counts: Record<ResearchSectionId, number> = {
    centres: content.centres.length,
    areas: content.areas.length,
    publications: content.publications.length,
    partnerships: content.partnerships.length,
    mous: content.mous.length,
  };

  const years = useMemo(
    () =>
      Array.from(
        new Set(
          content.publications.filter((p) => p.year).map((p) => String(p.year)),
        ),
      ).sort((a, b) => b.localeCompare(a)),
    [content.publications],
  );
  const types = useMemo(
    () =>
      Array.from(
        new Set(content.publications.map((p) => p.type).filter(Boolean)),
      ),
    [content.publications],
  );
  const depts = useMemo(
    () =>
      Array.from(
        new Set(content.publications.map((p) => p.department).filter(Boolean)),
      ),
    [content.publications],
  );
  const partnerTypes = useMemo(
    () =>
      Array.from(
        new Set(content.partnerships.map((p) => p.type).filter(Boolean)),
      ),
    [content.partnerships],
  );

  const filteredPubs = content.publications.filter((p) => {
    const q = query.toLowerCase();
    const matchesQuery =
      !q ||
      p.title.toLowerCase().includes(q) ||
      p.authors.toLowerCase().includes(q) ||
      p.venue.toLowerCase().includes(q);
    const matchesYear = year === "all" || String(p.year) === year;
    const matchesType = type === "all" || p.type === type;
    const matchesDept = dept === "all" || p.department === dept;
    return matchesQuery && matchesYear && matchesType && matchesDept;
  });
  const filtersActive =
    query !== "" || year !== "all" || type !== "all" || dept !== "all";

  const filteredPartners = content.partnerships.filter(
    (p) => partnerType === "all" || p.type === partnerType,
  );

  function resetFilters() {
    setQuery("");
    setYear("all");
    setType("all");
    setDept("all");
  }

  function handleTab(value: string) {
    const params = new URLSearchParams(searchParams);
    params.set("section", value);
    router.replace(`${pathname}?${params.toString()}`, { scroll: false });
  }

  return (
    <Tabs
      value={activeTab}
      onValueChange={(value) => handleTab(value as string)}
    >
      {/* Phones: all five tabs in one evenly split row (icon over a short
          label), so nothing scrolls off-screen. sm+: the usual pill row. */}
      <div className="flex justify-center">
        <TabsList className="grid w-full grid-cols-5 gap-1 rounded-2xl border border-border bg-card p-1 shadow-sm sm:flex sm:w-max sm:flex-nowrap sm:rounded-xl sm:p-1.5">
          {TAB_META.map((tab) => {
            const Icon = tab.icon;
            return (
              <TabsTrigger
                key={tab.id}
                value={tab.id}
                className="group relative min-w-0 flex-col gap-1 rounded-xl px-1 py-2 text-[11px] leading-tight sm:flex-row sm:gap-2 sm:rounded-lg sm:px-4 sm:text-sm whitespace-nowrap"
              >
                <Icon className="size-5 sm:size-4" />
                <span className="truncate sm:hidden">{tab.short}</span>
                <span className="hidden sm:inline">{tab.label}</span>
                <span className="absolute top-1 right-1 min-w-4 rounded-full bg-muted px-1 py-0.5 text-center text-[10px] font-semibold leading-none text-muted-foreground tabular-nums group-data-active:bg-accent group-data-active:text-accent-foreground sm:static sm:px-1.5 sm:text-[11px] sm:group-data-active:bg-white/20 sm:group-data-active:text-primary-foreground">
                  {counts[tab.id]}
                </span>
              </TabsTrigger>
            );
          })}
        </TabsList>
      </div>

      <TabsContent value="centres" className="mt-8 sm:mt-10">
        <SectionHeader id="centres" count={counts.centres} noun="centres" />
        {content.centres.length === 0 ? (
          <Empty icon={Microscope}>No research centres listed yet.</Empty>
        ) : (
          <SeeMore items={content.centres} limit={PREVIEW.centres}>
            {(visible) => (
              <>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                  {visible.map((centre, index) => (
                    <article
                      key={centre.name}
                      className="group relative flex flex-col overflow-hidden rounded-2xl border border-border bg-card p-5 sm:p-6 transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                    >
                      <div className="absolute inset-x-0 top-0 h-1 bg-linear-to-r from-primary via-secondary to-accent" />
                      <div className="mb-5 flex items-start justify-between gap-4">
                        <div className="flex size-12 items-center justify-center rounded-xl bg-primary/10 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                          <Microscope className="size-6" />
                        </div>
                        <span className="font-heading text-3xl font-bold text-primary/10 tabular-nums">
                          {String(index + 1).padStart(2, "0")}
                        </span>
                      </div>
                      <h3 className="font-heading font-semibold text-lg text-foreground leading-snug">
                        {centre.name}
                      </h3>
                      {centre.lead && (
                        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-secondary">
                          <Building2 className="size-3.5 shrink-0" />
                          {centre.lead}
                        </p>
                      )}
                      <p className="mt-3 mb-5 text-sm text-muted-foreground leading-relaxed">
                        {centre.description}
                      </p>
                      {centre.focus.length > 0 && (
                        <div className="mt-auto flex flex-wrap gap-1.5 border-t border-border pt-4">
                          {centre.focus.map((tag) => (
                            <span
                              key={tag}
                              className="rounded-full bg-accent-light px-2.5 py-1 text-xs font-medium text-foreground"
                            >
                              {tag}
                            </span>
                          ))}
                        </div>
                      )}
                    </article>
                  ))}
                </div>
              </>
            )}
          </SeeMore>
        )}
      </TabsContent>

      <TabsContent value="areas" className="mt-8 sm:mt-10">
        <SectionHeader id="areas" count={counts.areas} noun="areas" />
        {content.areas.length === 0 ? (
          <Empty icon={Beaker}>No research areas listed yet.</Empty>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
            {content.areas.map((area, index) => {
              const Icon = iconMap[area.icon];
              const background = areaBackground(area.color, index);
              return (
                <article
                  key={area.title}
                  className={cn(
                    "group relative flex aspect-4/3 flex-col justify-between overflow-hidden rounded-2xl p-4 md:p-5 text-white shadow-sm transition-all hover:-translate-y-1 hover:shadow-xl",
                    background.className,
                  )}
                  style={background.style}
                >
                  <div
                    className="absolute inset-0 opacity-15"
                    style={DOT_PATTERN}
                  />
                  <Icon className="absolute -right-4 -bottom-4 size-28 text-white/10 transition-transform duration-500 group-hover:scale-110 group-hover:-rotate-6" />
                  <div className="relative flex size-10 md:size-11 items-center justify-center rounded-xl bg-white/20 backdrop-blur-sm">
                    <Icon className="size-5 md:size-6" />
                  </div>
                  <h3 className="relative font-heading font-semibold text-sm md:text-base leading-snug">
                    {area.title}
                  </h3>
                </article>
              );
            })}
          </div>
        )}
      </TabsContent>

      <TabsContent value="publications" className="mt-8 sm:mt-10">
        <SectionHeader
          id="publications"
          count={counts.publications}
          noun="publications"
        />

        <div className="mb-6 rounded-2xl border border-border bg-card p-2.5 sm:p-3 shadow-sm">
          <div className="flex flex-col md:flex-row gap-2 sm:gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
              <Input
                placeholder="Search by title, author or venue..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="pl-9"
              />
            </div>
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 sm:gap-3 md:flex">
              <FilterSelect
                value={year}
                onChange={setYear}
                allLabel="Any year"
                options={years}
                className="md:w-32"
              />
              <FilterSelect
                value={type}
                onChange={setType}
                allLabel="Any type"
                options={types}
                className="md:w-44"
              />
              <FilterSelect
                value={dept}
                onChange={setDept}
                allLabel="Any department"
                options={depts}
                className="col-span-2 sm:col-span-1 md:w-44"
              />
            </div>
          </div>
          {filtersActive && (
            <div className="mt-3 flex items-center justify-between border-t border-border pt-3 text-sm">
              <p className="text-muted-foreground">
                Showing{" "}
                <span className="font-semibold text-foreground">
                  {filteredPubs.length}
                </span>{" "}
                of {content.publications.length}
              </p>
              <Button
                variant="ghost"
                size="sm"
                className="gap-1.5"
                onClick={resetFilters}
              >
                <RotateCcw className="size-3.5" />
                Reset
              </Button>
            </div>
          )}
        </div>

        {filteredPubs.length === 0 ? (
          <Empty icon={BookOpen}>
            {content.publications.length === 0
              ? "No publications listed yet."
              : "No publications match these filters."}
          </Empty>
        ) : (
          <SeeMore items={filteredPubs} limit={PREVIEW.publications}>
            {(visible) => (
              <>
                <ol className="space-y-3">
                  {visible.map((pub) => (
                    <li
                      key={`${pub.title}-${pub.year}`}
                      className="group flex gap-3 sm:gap-4 rounded-2xl border border-border bg-card p-4 md:p-5 transition-all hover:border-primary/30 hover:shadow-md"
                    >
                      <div className="hidden sm:flex w-16 shrink-0 flex-col items-center justify-center rounded-xl bg-primary/5 py-3 text-primary">
                        <BookOpen className="size-4 mb-1 opacity-60" />
                        <span className="font-heading font-bold text-lg leading-none tabular-nums">
                          {pub.year || "—"}
                        </span>
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-1.5">
                          {pub.type && (
                            <Badge variant="secondary">{pub.type}</Badge>
                          )}
                          {pub.department && (
                            <Badge variant="muted">{pub.department}</Badge>
                          )}
                          {pub.year > 0 && (
                            <span className="text-xs text-muted-foreground sm:hidden">
                              {pub.year}
                            </span>
                          )}
                        </div>
                        <h3 className="text-[15px] sm:text-base font-semibold text-foreground leading-snug wrap-break-word">
                          {pub.link ? (
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="hover:text-primary hover:underline"
                            >
                              {pub.title}
                            </a>
                          ) : (
                            pub.title
                          )}
                        </h3>
                        {pub.authors && (
                          <p className="mt-1.5 text-[13px] sm:text-sm text-muted-foreground wrap-break-word line-clamp-3 sm:line-clamp-none">
                            {pub.authors}
                          </p>
                        )}
                        {pub.venue && (
                          <p className="mt-1 text-[13px] sm:text-sm italic text-foreground/70 wrap-break-word">
                            {pub.venue}
                          </p>
                        )}
                      </div>
                      {pub.link && (
                        <Button
                          variant="outline"
                          size="icon"
                          className="shrink-0 self-start"
                          render={
                            <a
                              href={pub.link}
                              target="_blank"
                              rel="noopener noreferrer"
                              aria-label={`Open “${pub.title}”`}
                            />
                          }
                          nativeButton={false}
                        >
                          <ExternalLink className="size-4" />
                        </Button>
                      )}
                    </li>
                  ))}
                </ol>
              </>
            )}
          </SeeMore>
        )}
      </TabsContent>

      <TabsContent value="partnerships" className="mt-8 sm:mt-10">
        <SectionHeader
          id="partnerships"
          count={counts.partnerships}
          noun="partners"
        />
        {content.partnerships.length === 0 ? (
          <Empty icon={Handshake}>No partners listed yet.</Empty>
        ) : (
          <>
            {partnerTypes.length > 1 && (
              <div className="-mx-4 mb-6 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-thin sm:mx-0 sm:flex-wrap sm:overflow-visible sm:px-0">
                {["all", ...partnerTypes].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setPartnerType(t)}
                    className={cn(
                      "shrink-0 rounded-full border px-4 py-1.5 text-sm font-medium transition-colors",
                      partnerType === t
                        ? "border-primary bg-primary text-primary-foreground"
                        : "border-border bg-card text-muted-foreground hover:border-primary/40 hover:text-foreground",
                    )}
                  >
                    {t === "all" ? "All" : t}
                  </button>
                ))}
              </div>
            )}
            <SeeMore items={filteredPartners} limit={PREVIEW.partnerships}>
              {(visible) => (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
                    {visible.map((partner) => {
                      const Wrapper = partner.website ? "a" : "div";
                      return (
                        <Wrapper
                          key={partner.name}
                          {...(partner.website
                            ? {
                                href: partner.website,
                                target: "_blank",
                                rel: "noopener noreferrer",
                              }
                            : {})}
                          className="group flex min-w-0 flex-col items-center rounded-2xl border border-border bg-card p-4 sm:p-6 text-center transition-all hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
                        >
                          {partner.logo ? (
                            <div className="relative mb-3 sm:mb-4 h-12 sm:h-16 w-full">
                              <Image
                                src={partner.logo}
                                alt={partner.name}
                                fill
                                sizes="200px"
                                className="object-contain"
                              />
                            </div>
                          ) : (
                            <div className="mb-3 sm:mb-4 flex size-12 sm:size-16 items-center justify-center rounded-2xl bg-linear-to-br from-primary to-secondary font-heading text-base sm:text-lg font-bold text-primary-foreground shadow-sm">
                              {monogram(partner.name)}
                            </div>
                          )}
                          <h3 className="text-sm sm:text-base font-semibold text-foreground leading-snug wrap-break-word group-hover:text-primary">
                            {partner.name}
                          </h3>
                          {partner.country && (
                            <p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">
                              <MapPin className="size-3.5" />
                              {partner.country}
                            </p>
                          )}
                          <div className="mt-auto flex items-center gap-2 pt-4">
                            {partner.type && (
                              <Badge variant="secondary">{partner.type}</Badge>
                            )}
                            {partner.website && (
                              <Globe className="size-4 text-muted-foreground group-hover:text-primary" />
                            )}
                          </div>
                        </Wrapper>
                      );
                    })}
                  </div>
                </>
              )}
            </SeeMore>
          </>
        )}
      </TabsContent>

      <TabsContent value="mous" className="mt-8 sm:mt-10">
        <SectionHeader id="mous" count={counts.mous} noun="agreements" />
        {content.mous.length === 0 ? (
          <Empty icon={FileText}>No MoUs listed yet.</Empty>
        ) : (
          <SeeMore items={content.mous} limit={PREVIEW.mous}>
            {(visible) => (
              <>
                <ol className="relative space-y-4 border-l-2 border-border pl-6 md:pl-8 ml-2">
                  {visible.map((mou, index) => (
                    <li key={`${mou.partner}-${index}`} className="relative">
                      <span className="absolute -left-[33px] md:-left-[41px] top-5 flex size-4 items-center justify-center rounded-full border-2 border-accent bg-background">
                        <span className="size-1.5 rounded-full bg-accent" />
                      </span>
                      <div className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-4 md:p-5 transition-all hover:border-primary/30 hover:shadow-md sm:flex-row sm:items-center">
                        <div className="min-w-0 flex-1">
                          {mou.date && (
                            <p className="mb-1.5 inline-flex items-center gap-1.5 rounded-full bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary">
                              <CalendarDays className="size-3.5" />
                              {mou.date}
                            </p>
                          )}
                          <h3 className="font-semibold text-foreground">
                            {mou.partner}
                          </h3>
                          {mou.scope && (
                            <p className="mt-1 text-sm text-muted-foreground leading-relaxed">
                              {mou.scope}
                            </p>
                          )}
                        </div>
                        {mou.document && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="w-full shrink-0 gap-1.5 sm:w-auto sm:self-center"
                            render={
                              <a
                                href={mou.document}
                                target="_blank"
                                rel="noopener noreferrer"
                              />
                            }
                            nativeButton={false}
                          >
                            <FileText className="size-4" />
                            View MoU
                          </Button>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </>
            )}
          </SeeMore>
        )}
      </TabsContent>
    </Tabs>
  );
}
