"use client";

import { useState } from "react";
import { Pencil, Trash2, ExternalLink } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import DataTable, { type DataTableColumn } from "@/components/shared/DataTable";
import { Modal } from "@/components/shared/Modal";
import { AlertDialog } from "@/components/shared/Aleart";
import { Alert } from "@/components/shared/Aleart";

interface SitePage {
  id: string;
  title: string;
  path: string;
  sections: number;
}

const PAGES: SitePage[] = [
  { id: "home", title: "Homepage", path: "/", sections: 10 },
  { id: "about", title: "About the University", path: "/about-the-university", sections: 4 },
  { id: "vc-message", title: "Vice Chancellor's Message", path: "/vice-chancellors-message", sections: 1 },
  { id: "library", title: "Library", path: "/library", sections: 1 },
  { id: "management", title: "University Management", path: "/management", sections: 1 },
  { id: "notices", title: "Notice Board", path: "/notices", sections: 1 },
  { id: "faculty", title: "Faculty Directory", path: "/faculty", sections: 1 },
  { id: "port-city-news", title: "Port City News.com", path: "/port-city-news", sections: 1 },
  { id: "research", title: "Research Wing", path: "/research", sections: 5 },
  { id: "port-city-journal", title: "Port City Journal", path: "/research/port-city-journal", sections: 9 },
  { id: "academics", title: "Academics", path: "/academics", sections: 6 },
  { id: "admission", title: "Admission", path: "/admission", sections: 13 },
  { id: "iqac", title: "IQAC", path: "/iqac", sections: 1 },
];

export default function PagesTable() {
  const [editTarget, setEditTarget] = useState<SitePage | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<SitePage | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  const columns: DataTableColumn<SitePage>[] = [
    {
      key: "title",
      header: "Page",
      cell: (row) => (
        <div>
          <p className="font-medium text-foreground">{row.title}</p>
          <code className="text-xs text-muted-foreground">{row.path}</code>
        </div>
      ),
    },
    {
      key: "sections",
      header: "Sections",
      cell: (row) => <Badge variant="secondary">{row.sections}</Badge>,
      hideBelow: "sm",
      align: "center",
    },
    { key: "status", header: "Status", cell: () => <Badge>Published</Badge>, align: "center" },
    {
      key: "actions",
      header: "",
      align: "right",
      cell: (row) => (
        <div className="flex items-center justify-end gap-1">
          <Button
            variant="ghost"
            size="icon-sm"
            render={<a href={row.path} target="_blank" rel="noopener noreferrer" />}
            nativeButton={false}
            aria-label="View page"
          >
            <ExternalLink className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            onClick={() => setEditTarget(row)}
            aria-label="Edit page"
          >
            <Pencil className="size-4" />
          </Button>
          <Button
            variant="ghost"
            size="icon-sm"
            className="text-destructive hover:bg-destructive/10"
            onClick={() => setDeleteTarget(row)}
            aria-label="Delete page"
          >
            <Trash2 className="size-4" />
          </Button>
        </div>
      ),
    },
  ];

  async function confirmDelete() {
    if (!deleteTarget) return;
    setDeleting(true);
    // Design-only: no backend to persist this against yet.
    await new Promise((resolve) => setTimeout(resolve, 600));
    setDeleting(false);
    setNotice(`"${deleteTarget.title}" would be removed here once content persistence exists.`);
    setDeleteTarget(null);
  }

  return (
    <>
      {notice && (
        <div className="mb-4">
          <Alert
            variant="info"
            message={notice}
            dismissible
            onDismiss={() => setNotice(null)}
          />
        </div>
      )}

      <DataTable
        columns={columns}
        data={PAGES}
        rowKey={(row) => row.id}
        entityLabel="pages"
        pagination={{ page: 1, totalPages: 1, total: PAGES.length, limit: PAGES.length }}
      />

      <Modal
        open={editTarget !== null}
        onClose={() => setEditTarget(null)}
        title={editTarget ? `Edit ${editTarget.title}` : ""}
        description="Page content editing is not wired up yet — this preview shows the intended layout."
        footer={
          <>
            <Button variant="outline" onClick={() => setEditTarget(null)}>
              Cancel
            </Button>
            <Button onClick={() => setEditTarget(null)}>Save Changes</Button>
          </>
        }
      >
        {editTarget && (
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="page-title">Title</Label>
              <Input id="page-title" defaultValue={editTarget.title} />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="page-path">Path</Label>
              <Input id="page-path" defaultValue={editTarget.path} disabled className="bg-muted text-muted-foreground" />
            </div>
          </div>
        )}
      </Modal>

      <AlertDialog
        open={deleteTarget !== null}
        onClose={() => setDeleteTarget(null)}
        onConfirm={confirmDelete}
        title={`Delete "${deleteTarget?.title ?? ""}"?`}
        description="This is a design preview — no content is actually persisted or deleted yet."
        confirmLabel="Delete"
        variant="danger"
        loading={deleting}
      />
    </>
  );
}
