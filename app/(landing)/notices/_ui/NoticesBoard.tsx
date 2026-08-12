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
} from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
import type { Notice, NoticeCategory, NoticesPageContent } from "@/types/notices";

const ITEMS_PER_PAGE = 10;

const CATEGORY_COLORS: Record<NoticeCategory, string> = {
  All: "bg-muted text-muted-foreground",
  Academic: "bg-primary/10 text-primary border-primary/20",
  Admission: "bg-accent/10 text-accent border-accent/20",
  Examination: "bg-destructive/10 text-destructive border-destructive/20",
  Administrative: "bg-secondary text-secondary-foreground",
  Event: "bg-highlight/10 text-highlight border-highlight/20",
  Scholarship: "bg-green-500/10 text-green-700 border-green-500/20",
};

export default function NoticesBoard({ content }: { content: NoticesPageContent }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<NoticeCategory>("All");
  const [currentPage, setCurrentPage] = useState(1);

  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { All: content.notices.length };
    for (const category of content.categories) {
      if (category === "All") continue;
      counts[category] = content.notices.filter((n) => n.category === category).length;
    }
    return counts;
  }, [content.notices, content.categories]);

  const filteredNotices = useMemo(() => {
    return content.notices.filter((notice) => {
      const matchesSearch = notice.title.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "All" || notice.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [content.notices, searchQuery, selectedCategory]);

  const totalPages = Math.max(1, Math.ceil(filteredNotices.length / ITEMS_PER_PAGE));
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const paginatedNotices = filteredNotices.slice(startIndex, startIndex + ITEMS_PER_PAGE);

  function handleSearchChange(value: string) {
    setSearchQuery(value);
    setCurrentPage(1);
  }

  function handleCategoryChange(value: NoticeCategory) {
    setSelectedCategory(value);
    setCurrentPage(1);
  }

  return (
    <div className="grid lg:grid-cols-4 gap-8">
      {/* Sidebar: category filter */}
      <aside className="lg:col-span-1">
        <Card className="lg:sticky lg:top-24">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg flex items-center gap-2">
              <ListFilter className="w-5 h-5" />
              Categories
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {content.categories.map((category) => (
              <button
                key={category}
                type="button"
                onClick={() => handleCategoryChange(category)}
                className={cn(
                  "flex w-full items-center justify-between rounded-md px-3 py-2 text-sm transition-colors",
                  selectedCategory === category
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:bg-muted"
                )}
              >
                {category}
                <Badge
                  variant="secondary"
                  className={cn(selectedCategory === category && "bg-white/20 text-white")}
                >
                  {categoryCounts[category] ?? 0}
                </Badge>
              </button>
            ))}
          </CardContent>
        </Card>
      </aside>

      {/* Main content */}
      <div className="lg:col-span-3 space-y-6">
        {/* Search & filter bar */}
        <Card>
          <CardContent className="p-4 flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Search notices..."
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select
              value={selectedCategory}
              onValueChange={(value) => value && handleCategoryChange(value as NoticeCategory)}
            >
              <SelectTrigger className="w-full sm:w-45">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {content.categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        <p className="text-sm text-muted-foreground">
          Showing {filteredNotices.length === 0 ? 0 : startIndex + 1}-
          {Math.min(startIndex + ITEMS_PER_PAGE, filteredNotices.length)} of{" "}
          {filteredNotices.length} notices
        </p>

        {/* Table */}
        <Card>
          <Table>
            <TableHeader>
              <TableRow className="bg-muted/50">
                <TableHead className="w-12">SL</TableHead>
                <TableHead>Notice Title</TableHead>
                <TableHead className="w-32">Category</TableHead>
                <TableHead className="w-28">
                  <span className="inline-flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    Date
                  </span>
                </TableHead>
                <TableHead className="w-28">Download</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {paginatedNotices.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="py-12 text-center">
                    <FileText className="w-12 h-12 opacity-30 mx-auto mb-3" />
                    <p className="font-medium text-foreground">No notices found</p>
                    <p className="text-sm text-muted-foreground">
                      Try adjusting your search or filter criteria
                    </p>
                  </TableCell>
                </TableRow>
              ) : (
                paginatedNotices.map((notice: Notice, idx: number) => (
                  <TableRow key={notice.id}>
                    <TableCell className="text-muted-foreground">
                      {startIndex + idx + 1}
                    </TableCell>
                    <TableCell>
                      <span className="flex items-start gap-2">
                        <FileText className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                        <span>
                          {notice.title}
                          {notice.isNew && (
                            <Badge className="ml-2 bg-destructive text-destructive-foreground text-xs align-middle">
                              NEW
                            </Badge>
                          )}
                        </span>
                      </span>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline" className={CATEGORY_COLORS[notice.category]}>
                        {notice.category}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-muted-foreground whitespace-nowrap">
                      {notice.dateLabel}
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="ghost"
                        size="sm"
                        nativeButton={false}
                        render={<a href={notice.fileUrl} download />}
                      >
                        <Download className="w-4 h-4 mr-1" />
                        {notice.fileSize}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </Card>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === 1}
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            >
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "ghost"}
                size="sm"
                className="w-8 h-8 p-0"
                onClick={() => setCurrentPage(page)}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage === totalPages}
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            >
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
