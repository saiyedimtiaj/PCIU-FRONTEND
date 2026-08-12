"use client";

import { Badge } from "@/components/ui/badge";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";

interface RecentPage {
  id: string;
  title: string;
  path: string;
  status: "Published";
  updated: string;
}

const RECENT_PAGES: RecentPage[] = [
  { id: "1", title: "Homepage", path: "/", status: "Published", updated: "Aug 12, 2026" },
  { id: "2", title: "About the University", path: "/about-the-university", status: "Published", updated: "Aug 12, 2026" },
  { id: "3", title: "Admission", path: "/admission", status: "Published", updated: "Aug 12, 2026" },
  { id: "4", title: "Academics", path: "/academics", status: "Published", updated: "Aug 12, 2026" },
  { id: "5", title: "Research Wing", path: "/research", status: "Published", updated: "Aug 12, 2026" },
];

const columns: DataTableColumn<RecentPage>[] = [
  {
    key: "title",
    header: "Page",
    cell: (row) => <span className="font-medium text-foreground">{row.title}</span>,
  },
  {
    key: "path",
    header: "Path",
    cell: (row) => <code className="text-xs text-muted-foreground">{row.path}</code>,
    hideBelow: "sm",
  },
  {
    key: "status",
    header: "Status",
    cell: () => <Badge variant="secondary">Published</Badge>,
  },
  { key: "updated", header: "Last Updated", cell: (row) => row.updated, hideBelow: "md" },
];

export default function RecentPagesTable() {
  return <DataTable columns={columns} data={RECENT_PAGES} rowKey={(row) => row.id} entityLabel="pages" />;
}
