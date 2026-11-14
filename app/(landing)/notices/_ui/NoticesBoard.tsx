"use client";

import { useMemo, useState } from "react";
import {
  Search,
  Download,
  FileText,
  Calendar,
  ListFilter,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Eye,
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { cn } from "@/lib/utils";
import { resolveUploadUrl } from "@/lib/upload-url";
import type {
  Notice,
  NoticeCategory,
  NoticesPageContent,
} from "@/types/notices";

const ITEMS_PER_PAGE = 6;

const CATEGORY_COLORS: Record<string, string> = {
  All: "bg-slate-100 text-slate-700 border-slate-200",
  Academic: "bg-blue-100 text-blue-700 border-blue-200",
  Admission: "bg-orange-100 text-orange-700 border-orange-200",
  Examination: "bg-rose-100 text-rose-700 border-rose-200",
  Administrative: "bg-violet-100 text-violet-700 border-violet-200",
  Event: "bg-amber-100 text-amber-700 border-amber-200",
  Scholarship: "bg-emerald-100 text-emerald-700 border-emerald-200",
  General: "bg-slate-200 text-slate-700 border-slate-300",
};

function normalizeCategory(value: string | null | undefined): string {
  return (value ?? "").trim() || "General";
}

function getSafeBadgeColor(
  color: string | null | undefined,
): string | undefined {
  if (!color) return undefined;
  const clean = color.trim();
  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(clean);
  const isRgb =
    /^rgba?\((?:\s*\d+\s*,){2}\s*\d+\s*(?:,\s*(?:0|0?\.\d+)\s*)?\)$/.test(
      clean,
    );
  const isHsl =
    /^hsla?\((?:\s*\d+\s*,\s*\d+%\s*,\s*\d+%\s*)(?:,\s*(?:0|0?\.\d+)\s*)?\)$/.test(
      clean,
    );
  return isHex || isRgb || isHsl ? clean : undefined;
}

function getContrastTextColor(hexOrRgb: string): string {
  const match = hexOrRgb.match(/^#?([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/);
  let red = 0;
  let green = 0;
  let blue = 0;

  if (match) {
    const value = match[1];
    const full =
      value.length === 3
        ? value
            .split("")
            .map((char) => char + char)
            .join("")
        : value;
    red = Number.parseInt(full.slice(0, 2), 16);
    green = Number.parseInt(full.slice(2, 4), 16);
    blue = Number.parseInt(full.slice(4, 6), 16);
  } else {
    const rgbMatch = hexOrRgb.match(/rgba?\(([^)]+)\)/i);
    if (rgbMatch) {
      const [r, g, b] = rgbMatch[1]
        .split(",")
        .map((part) => Number.parseInt(part.trim(), 10));
      red = r ?? 0;
      green = g ?? 0;
      blue = b ?? 0;
    }
  }

  const luminance = (0.2126 * red + 0.7152 * green + 0.0722 * blue) / 255;
  return luminance > 0.66 ? "#111827" : "#ffffff";
}

function toDateKey(value: string | null | undefined): string | null {
  if (!value) return null;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return null;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

export default function NoticesBoard({
  content,
}: {
  content: NoticesPageContent;
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] =
    useState<NoticeCategory>("All");
  const [selectedYear, setSelectedYear] = useState<string>("All Years");
  const [selectedDepartment, setSelectedDepartment] =
    useState<string>("All Departments");
  const [selectedDate, setSelectedDate] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);

  const yearOptions = useMemo(() => {
    const years = new Set<number>();
    for (const notice of content.notices) {
      if (!notice.date) continue;
      const parsed = new Date(notice.date);
      if (!Number.isNaN(parsed.getTime())) years.add(parsed.getFullYear());
    }
    return Array.from(years).sort((a, b) => b - a);
  }, [content.notices]);

  const departmentOptions = useMemo(() => {
    const seen = new Set<string>();
    return content.notices.reduce<string[]>((acc, notice) => {
      const departmentValue =
        notice.departmentShortName || notice.departmentName || "General";
      const key = departmentValue.toLowerCase();
      if (seen.has(key)) return acc;
      seen.add(key);
      acc.push(departmentValue);
      return acc;
    }, []);
  }, [content.notices]);

  const categoryOptions = useMemo(() => {
    const seen = new Set<string>();
    const list: string[] = [];
    for (const notice of content.notices) {
      const category = normalizeCategory(notice.category);
      const key = category.toLowerCase();
      if (!category || seen.has(key)) continue;
      seen.add(key);
      list.push(category);
    }
    return list.sort((a, b) => a.localeCompare(b));
  }, [content.notices]);

  const filteredNotices = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return [...content.notices]
      .filter((notice) => {
        const noticeDate = notice.date ? new Date(notice.date) : null;
        const matchesSearch =
          !query ||
          notice.title.toLowerCase().includes(query) ||
          notice.category.toLowerCase().includes(query) ||
          notice.departmentName.toLowerCase().includes(query) ||
          notice.departmentShortName.toLowerCase().includes(query);

        const matchesCategory =
          selectedCategory === "All" ||
          normalizeCategory(notice.category) === selectedCategory;

        const matchesYear =
          selectedYear === "All Years" ||
          (noticeDate && noticeDate.getFullYear().toString() === selectedYear);

        const matchesDepartment =
          selectedDepartment === "All Departments" ||
          (notice.departmentShortName || notice.departmentName || "General") ===
            selectedDepartment;

        const matchesDate =
          !selectedDate || toDateKey(notice.date) === selectedDate;

        return (
          matchesSearch &&
          matchesCategory &&
          matchesYear &&
          matchesDepartment &&
          matchesDate
        );
      })
      .sort((a, b) => {
        const aTime = a.date ? new Date(a.date).getTime() : 0;
        const bTime = b.date ? new Date(b.date).getTime() : 0;
        return (
          bTime - aTime ||
          new Date(b.createdAt ?? 0).getTime() -
            new Date(a.createdAt ?? 0).getTime()
        );
      });
  }, [
    content.notices,
    searchQuery,
    selectedCategory,
    selectedYear,
    selectedDepartment,
    selectedDate,
  ]);

  const totalPages = Math.max(
    1,
    Math.ceil(filteredNotices.length / ITEMS_PER_PAGE),
  );
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotices = filteredNotices.slice(
    startIndex,
    startIndex + ITEMS_PER_PAGE,
  );

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: NoticeCategory) {
    setSelectedCategory(value);
    setCurrentPage(1);
  }

  function handleResetFilters() {
    setSearchQuery("");
    setSelectedCategory("All");
    setSelectedYear("All Years");
    setSelectedDepartment("All Departments");
    setSelectedDate("");
    setCurrentPage(1);
  }

  const hasActiveFilters =
    searchQuery.trim().length > 0 ||
    selectedCategory !== "All" ||
    selectedYear !== "All Years" ||
    selectedDepartment !== "All Departments" ||
    selectedDate !== "";

  return (
    <div className="space-y-5">
      <Card className="overflow-hidden border border-border/60 bg-gradient-to-r from-background via-background to-primary/[0.02] shadow-sm">
        <CardHeader className="border-b border-border/70 bg-muted/20 px-3 py-2.5 sm:px-4">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-md bg-primary/10 text-primary">
                <ListFilter className="h-4 w-4" />
              </div>
              <CardTitle className="text-base font-semibold sm:text-lg">
                Filter notices
              </CardTitle>
            </div>
            <div className="flex items-center gap-2">
              <div className="rounded-full border border-primary/10 bg-primary/5 px-2.5 py-1 text-xs font-medium text-primary sm:text-sm">
                {filteredNotices.length} notice
                {filteredNotices.length === 1 ? "" : "s"} found
              </div>
              {hasActiveFilters && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleResetFilters}
                >
                  <RotateCcw className="mr-2 h-4 w-4" />
                  Reset
                </Button>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-3 sm:p-4">
          <div className="flex flex-wrap gap-3">
            <div className="min-w-[180px] flex-1 basis-[220px] space-y-1.5 lg:flex-[2_1_260px]">
              <label className="text-xs font-medium text-foreground sm:text-sm">
                Search
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  aria-label="Search notices"
                  placeholder="Search titles, categories, departments"
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  className="h-10 pl-10"
                />
              </div>
            </div>

            <div className="min-w-[140px] flex-1 basis-[150px] space-y-1.5">
              <label className="text-xs font-medium text-foreground sm:text-sm">
                Category
              </label>
              <Select
                value={selectedCategory}
                onValueChange={(value) =>
                  value && handleCategoryChange(value as NoticeCategory)
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All">All Categories</SelectItem>
                  {categoryOptions.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[140px] flex-1 basis-[150px] space-y-1.5">
              <label className="text-xs font-medium text-foreground sm:text-sm">
                Department
              </label>
              <Select
                value={selectedDepartment}
                onValueChange={(value) =>
                  setSelectedDepartment(value ?? "All Departments")
                }
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Department" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Departments">
                    All Departments
                  </SelectItem>
                  {departmentOptions.map((department) => (
                    <SelectItem key={department} value={department}>
                      {department}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[120px] flex-1 basis-[130px] space-y-1.5">
              <label className="text-xs font-medium text-foreground sm:text-sm">
                Year
              </label>
              <Select
                value={selectedYear}
                onValueChange={(value) => {
                  setSelectedYear(value ?? "All Years");
                  setCurrentPage(1);
                }}
              >
                <SelectTrigger className="h-10 w-full">
                  <SelectValue placeholder="Year" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="All Years">All Years</SelectItem>
                  {yearOptions.map((year) => (
                    <SelectItem key={year} value={String(year)}>
                      {year}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="min-w-[150px] flex-1 basis-[150px] space-y-1.5">
              <label className="text-xs font-medium text-foreground sm:text-sm">
                Notice date
              </label>
              <Input
                type="date"
                value={selectedDate}
                onChange={(e) => {
                  setSelectedDate(e.target.value);
                  setCurrentPage(1);
                }}
                className="h-10"
              />
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-5">
        <Card className="overflow-hidden border-border/70 shadow-sm">
          <div className="flex items-center justify-between border-b border-border/70 bg-muted/20 px-4 py-2.5 text-xs text-muted-foreground sm:text-sm">
            <span>Latest notices first</span>
            <div className="flex items-center gap-1.5">
              <Calendar className="h-4 w-4" />
              <span>Live feed</span>
            </div>
          </div>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">SL</TableHead>
                <TableHead>Notice Title</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-28">Date</TableHead>
                <TableHead className="w-28">Preview</TableHead>
                <TableHead className="w-28">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="py-14 text-center">
                    <FileText className="mx-auto mb-3 h-12 w-12 opacity-30" />
                    <p className="font-medium text-foreground">
                      No notices found
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter criteria.
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNotices.map((notice: Notice, idx: number) => {
                  const badgeColor = getSafeBadgeColor(
                    notice.badgeColor ?? null,
                  );
                  const resolvedPdfUrl = resolveUploadUrl(
                    notice.pdfUrl ?? null,
                  );
                  const hasPdf = Boolean(
                    resolvedPdfUrl && resolvedPdfUrl !== "#",
                  );
                  const isDownloadable =
                    hasPdf && !resolvedPdfUrl.startsWith("javascript:");
                  const categoryClassName =
                    CATEGORY_COLORS[normalizeCategory(notice.category)] ||
                    CATEGORY_COLORS.General;

                  return (
                    <TableRow key={notice.id}>
                      <TableCell className="text-muted-foreground">
                        {startIndex + idx + 1}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-start gap-2">
                          <FileText className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                          <div className="min-w-0">
                            <p className="line-clamp-2 text-sm font-medium text-foreground">
                              {notice.title}
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {notice.departmentShortName ||
                                notice.departmentName}
                            </p>
                            {notice.isNew && (
                              <Badge className="mt-2 bg-destructive text-destructive-foreground text-[10px]">
                                NEW
                              </Badge>
                            )}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={cn(
                            "border font-medium",
                            categoryClassName,
                          )}
                          style={
                            badgeColor
                              ? {
                                  backgroundColor: badgeColor,
                                  color: getContrastTextColor(badgeColor),
                                  borderColor: badgeColor,
                                }
                              : undefined
                          }
                        >
                          {notice.badgeLabel || notice.category || "General"}
                        </Badge>
                      </TableCell>
                      <TableCell className="whitespace-nowrap text-muted-foreground">
                        {notice.dateLabel}
                      </TableCell>
                      <TableCell>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          disabled={!hasPdf}
                          onClick={() => {
                            if (resolvedPdfUrl)
                              window.open(
                                resolvedPdfUrl,
                                "_blank",
                                "noopener,noreferrer",
                              );
                          }}
                          className={cn(
                            !hasPdf && "cursor-not-allowed opacity-50",
                          )}
                        >
                          <Eye className="mr-1 h-4 w-4" />
                          View
                        </Button>
                      </TableCell>
                      <TableCell>
                        {isDownloadable ? (
                          <a
                            href={resolvedPdfUrl || "#"}
                            target="_blank"
                            rel="noreferrer"
                            download
                            className={buttonVariants({
                              variant: "ghost",
                              size: "sm",
                            })}
                          >
                            <Download className="mr-1 h-4 w-4" />
                            PDF
                          </a>
                        ) : (
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            disabled
                          >
                            <Download className="mr-1 h-4 w-4" />
                            PDF
                          </Button>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </Card>

        {filteredNotices.length > ITEMS_PER_PAGE && (
          <div className="flex items-center justify-center gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                type="button"
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
