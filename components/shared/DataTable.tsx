"use client";

import React from "react";
import {
  ArrowUpDown,
  ArrowDown,
  ArrowUp,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Checkbox } from "@/components/ui/checkbox";
import EmptyState from "./EmptyState";

export interface DataTableColumn<T> {
  key: string;
  header: string | React.ReactNode;
  cell: (row: T) => React.ReactNode;
  sortField?: string;
  hideBelow?: "sm" | "md" | "lg" | "xl" | "2xl";
  align?: "left" | "center" | "right";
  headerClassName?: string;
  cellClassName?: string;
  skeletonWidth?: string;
}

export interface DataTablePagination {
  page: number;
  totalPages: number;
  total: number;
  limit: number;
}

export interface DataTableProps<T> {
  columns: DataTableColumn<T>[];
  data: T[];
  rowKey: (row: T) => string | number;
  onPageChange?: (page: number) => void;
  onSort?: (field: string) => void;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
  pagination?: DataTablePagination;
  isLoading?: boolean;
  skeletonRows?: number;
  emptyState?: React.ReactNode;
  entityLabel?: string;
  mobileCard?: (row: T) => React.ReactNode;
  rowClassName?: (row: T) => string;
  footerLeft?: React.ReactNode;
  selectable?: boolean;
  selectedKeys?: Set<string | number>;
  onToggleRow?: (key: string | number) => void;
  onToggleAll?: () => void;
}

const breakpointHidden: Record<string, string> = {
  sm: "hidden sm:table-cell",
  md: "hidden md:table-cell",
  lg: "hidden lg:table-cell",
  xl: "hidden xl:table-cell",
  "2xl": "hidden 2xl:table-cell",
};

function SortIcon({
  field,
  sortBy,
  sortOrder,
}: {
  field: string;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}) {
  if (sortBy !== field)
    return (
      <ArrowUpDown className="size-3.5 opacity-0 group-hover/th:opacity-50 transition-opacity" />
    );
  return sortOrder === "asc" ? (
    <ArrowUp className="size-3.5 text-primary" />
  ) : (
    <ArrowDown className="size-3.5 text-primary" />
  );
}

function TableSkeleton<T>({
  columns,
  rows,
}: {
  columns: DataTableColumn<T>[];
  rows: number;
}) {
  return (
    <div className="rounded-xl border border-border overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {columns.map((col) => (
                <th
                  key={col.key}
                  className={`px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wide text-muted-foreground ${col.headerClassName ?? ""} ${
                    col.hideBelow ? breakpointHidden[col.hideBelow] : ""
                  }`}
                >
                  {/* Headers are known before the rows arrive — showing the
                      real labels keeps the table's shape readable while
                      loading instead of flashing placeholder bars. */}
                  {col.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {Array.from({ length: rows }).map((_, i) => (
              <tr key={i}>
                {columns.map((col) => (
                  <td
                    key={col.key}
                    className={`px-5 py-4 ${col.hideBelow ? breakpointHidden[col.hideBelow] : ""}`}
                  >
                    <Skeleton
                      className={`h-4 rounded ${col.skeletonWidth ?? "w-20"}`}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function PaginationText({
  pageStart,
  pageEnd,
  total,
  entityLabel,
}: {
  pageStart: number;
  pageEnd: number;
  total: number;
  entityLabel: string;
}) {
  return (
    <p className="text-sm text-muted-foreground">
      Showing <span className="font-semibold text-foreground">{pageStart}</span>{" "}
      to <span className="font-semibold text-foreground">{pageEnd}</span> of{" "}
      <span className="font-semibold text-foreground">{total}</span>{" "}
      {entityLabel}
    </p>
  );
}

function TablePagination({
  pagination,
  entityLabel,
  onPageChange,
  footerLeft,
}: {
  pagination: DataTablePagination;
  entityLabel: string;
  onPageChange?: (page: number) => void;
  footerLeft?: React.ReactNode;
}) {
  const { page, totalPages, total, limit } = pagination;
  const pageStart = (page - 1) * limit + 1;
  const pageEnd = Math.min(page * limit, total);

  return (
    <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-t border-border px-5 py-3.5 bg-muted/10">
      <div className="flex items-center gap-4">
        {footerLeft}
        <PaginationText
          pageStart={pageStart}
          pageEnd={pageEnd}
          total={total}
          entityLabel={entityLabel}
        />
      </div>
      {totalPages > 1 && (
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(1)}
          >
            <ChevronsLeft className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page <= 1}
            onClick={() => onPageChange?.(page - 1)}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          {(() => {
            const pages: (number | "ellipsis")[] = [];
            if (totalPages <= 5) {
              for (let i = 1; i <= totalPages; i++) pages.push(i);
            } else {
              pages.push(1);
              if (page > 3) pages.push("ellipsis");
              const start = Math.max(2, page - 1);
              const end = Math.min(totalPages - 1, page + 1);
              for (let i = start; i <= end; i++) pages.push(i);
              if (page < totalPages - 2) pages.push("ellipsis");
              pages.push(totalPages);
            }
            return pages.map((p, idx) =>
              p === "ellipsis" ? (
                <span
                  key={`dots-${idx}`}
                  className="size-7 flex items-center justify-center text-xs text-muted-foreground select-none"
                >
                  …
                </span>
              ) : (
                <Button
                  key={p}
                  variant={page === p ? "default" : "outline"}
                  size="icon-sm"
                  className="text-xs"
                  onClick={() => onPageChange?.(p)}
                >
                  {p}
                </Button>
              ),
            );
          })()}
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(page + 1)}
          >
            <ChevronRight className="size-3.5" />
          </Button>
          <Button
            variant="outline"
            size="icon-sm"
            disabled={page >= totalPages}
            onClick={() => onPageChange?.(totalPages)}
          >
            <ChevronsRight className="size-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export default function DataTable<T>({
  columns,
  data,
  rowKey,
  onPageChange,
  onSort,
  sortBy,
  sortOrder,
  pagination,
  isLoading,
  skeletonRows = 6,
  emptyState,
  entityLabel = "items",
  mobileCard,
  rowClassName,
  footerLeft,
  selectable,
  selectedKeys,
  onToggleRow,
  onToggleAll,
}: DataTableProps<T>) {
  const alignClass = (a?: "left" | "center" | "right") =>
    a === "right" ? "text-right" : a === "center" ? "text-center" : "text-left";
  const isAllSelected =
    selectable && data.length > 0 && data.every((row) => selectedKeys?.has(rowKey(row)));

  if (isLoading) {
    return <TableSkeleton columns={columns} rows={skeletonRows} />;
  }

  if (!data || data.length === 0) {
    const fallback = (
      <EmptyState
        title={`Nothing here yet`}
        description={`No ${entityLabel} have been added so far. Once they are, they'll appear right here.`}
        size="lg"
      />
    );

    return (
      <div className="rounded-xl border border-border overflow-hidden">
        <div
          className={`${mobileCard ? "hidden md:block" : ""} overflow-x-auto`}
        >
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                {columns.map((col) => {
                  const vis = col.hideBelow
                    ? breakpointHidden[col.hideBelow]
                    : "";
                  const align = alignClass(col.align);
                  return (
                    <th
                      key={col.key}
                      className={`px-5 py-3.5 ${align} ${vis} ${col.headerClassName ?? ""}`}
                    >
                      {col.sortField ? (
                        <button className="group/th flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground font-heading cursor-default">
                          {col.header}
                          <ArrowUpDown className="size-3.5 opacity-20" />
                        </button>
                      ) : typeof col.header === "string" ? (
                        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-heading">
                          {col.header}
                        </span>
                      ) : (
                        col.header
                      )}
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody>
              <tr>
                <td colSpan={columns.length}>{emptyState ?? fallback}</td>
              </tr>
            </tbody>
          </table>
        </div>

        <div className="md:hidden">{emptyState ?? fallback}</div>
      </div>
    );
  }

  return (
    <div className="rounded-xl border border-border overflow-hidden">
      {mobileCard && (
        <div className="md:hidden divide-y divide-border">
          {data.map((row) => (
            <React.Fragment key={rowKey(row)}>{mobileCard(row)}</React.Fragment>
          ))}
        </div>
      )}

      <div className={`${mobileCard ? "hidden md:block" : ""} overflow-x-auto`}>
        <table className="w-full">
          <thead>
            <tr className="border-b border-border bg-muted/30">
              {selectable && (
                <th className="px-5 py-3.5 w-10">
                  <Checkbox
                    checked={isAllSelected}
                    onCheckedChange={() => onToggleAll?.()}
                    aria-label="Select all rows"
                  />
                </th>
              )}
              {columns.map((col) => {
                const vis = col.hideBelow
                  ? breakpointHidden[col.hideBelow]
                  : "";
                const align = alignClass(col.align);
                return (
                  <th
                    key={col.key}
                    className={`px-5 py-3.5 ${align} ${vis} ${col.headerClassName ?? ""}`}
                  >
                    {col.sortField && onSort ? (
                      <button
                        onClick={() => onSort(col.sortField!)}
                        className="group/th flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground hover:text-foreground transition-colors font-heading"
                      >
                        {col.header}
                        <SortIcon
                          field={col.sortField}
                          sortBy={sortBy}
                          sortOrder={sortOrder}
                        />
                      </button>
                    ) : typeof col.header === "string" ? (
                      <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground font-heading">
                        {col.header}
                      </span>
                    ) : (
                      col.header
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          <tbody className="divide-y divide-border">
            {data?.map((row) => (
              <tr
                key={rowKey(row)}
                className={`group transition-colors hover:bg-muted/20 ${rowClassName?.(row) ?? ""}`}
              >
                {selectable && (
                  <td className="px-5 py-3.5 w-10">
                    <Checkbox
                      checked={selectedKeys?.has(rowKey(row)) ?? false}
                      onCheckedChange={() => onToggleRow?.(rowKey(row))}
                      aria-label="Select row"
                    />
                  </td>
                )}
                {columns.map((col) => {
                  const vis = col.hideBelow
                    ? breakpointHidden[col.hideBelow]
                    : "";
                  const align = alignClass(col.align);
                  return (
                    <td
                      key={col.key}
                      className={`px-5 py-3.5 ${align} ${vis} ${col.cellClassName ?? ""}`}
                    >
                      {col.cell(row)}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && data.length > 0 && (
        <TablePagination
          pagination={pagination}
          entityLabel={entityLabel}
          onPageChange={onPageChange}
          footerLeft={footerLeft}
        />
      )}
    </div>
  );
}
