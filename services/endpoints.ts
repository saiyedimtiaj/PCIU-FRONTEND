
export interface EndpointConfig {
  path: string;
  item?: (id: string | number) => string;
  multipart?: boolean;
  singleton?: boolean;
  updateMethod?: "patch" | "put";
  noDelete?: boolean;
  /**
   * When `noDelete` is set but the resource has a boolean "active" field,
   * name it here to swap the delete action for a deactivate (PATCH this
   * field to false) instead of just hiding delete entirely. Verified live
   * against the API before adding one: DELETE /teachers/admin/{id} 404s,
   * but PATCH { isActive: false } works and is what the backend's own
   * error message on /users/{id} points admins toward.
   */
  deactivateField?: string;
  grouped?: boolean;
  /**
   * DELETE hits the bare collection path (no `/{id}`), for a resource
   * whose delete has no per-record form at all. Verified live for `iqac`:
   * `DELETE /iqac` succeeds and resets the one row the backend always
   * keeps (a fresh GET immediately after returns a new default row, not
   * 404/empty) — `DELETE /iqac/{id}` 404s outright.
   */
  deleteAtRoot?: boolean;
  /**
   * POST creates a new record everywhere except here: for a resource the
   * backend keeps as one row, POST upserts that same row instead of
   * adding a second. Verified live for `iqac` — POST /iqac twice returns
   * the same id and original createdAt, only the content changes. The Add
   * form warns about this rather than letting it look like ordinary create.
   */
  createOverwrites?: boolean;
}

export const ENTITY_ENDPOINTS: Record<string, EndpointConfig> = {
  department: { path: "/departments", multipart: true },
  faculty: { path: "/faculties" },
  course: { path: "/academic/courses" },

  teacher: {
    path: "/teachers/admin",
    multipart: true,
    noDelete: true,
    deactivateField: "is_active",
  },
  user: { path: "/users", multipart: true },

  semester: { path: "/academic/semesters" },
  exam: { path: "/academic/exams", multipart: true },
  batch: { path: "/academic/batches" },
  section: { path: "/academic/sections" },
  building: { path: "/academic/buildings" },
  room: { path: "/academic/rooms" },
  "time-slot": { path: "/academic/time-slots" },
  "class-routine": { path: "/routines/class" },
  "exam-routine": { path: "/routines/exam" },

  pages: { path: "/pages", multipart: true },
  "hero-slides": { path: "/heroslides", multipart: true },
  notices: { path: "/notices" },
  gallery: { path: "/galleries", multipart: true },
  menus: { path: "/menus" },

  "pcj-volumes": { path: "/pcj/volumes", multipart: true },
  "pcj-articles": { path: "/pcj/articles", multipart: true },

  "admission-advertisements": {
    path: "/admission/admin/advertisement",
    multipart: true,
    singleton: true,
  },
  "admission-test-results": {
    path: "/admission/admin/test-result",
    multipart: true,
    singleton: true,
  },
  "fee-structures": {
    path: "/admission/admin/fee-structure",
    singleton: true,
  },
  "admission-schedules": {
    path: "/admission/admin/schedule",
    grouped: true,
    // The spec really does misspell the DELETE route as "/admision"
    // (one 's') while GET/POST use "/admission". Both are encoded exactly
    // as the server exposes them — do not "correct" this.
    item: (id) => `/admission/admin/schedule/${id}`,
  },
  "mba-eligibility-tiers": { path: "/admission/admin/mba-eligibility" },
  faqs: { path: "/faqs" },

  // Not a singleton in the UI sense — GET/PATCH support real item paths
  // (/iqac/{id}, verified 404s on a wrong id), so it gets a normal list
  // with working per-row Edit. POST and DELETE only ever act on the one
  // row the backend keeps (POST upserts it; DELETE resets it to defaults
  // rather than truly removing it — see deleteAtRoot).
  iqac: { path: "/iqac", deleteAtRoot: true, createOverwrites: true },
  "iqac-committee": { path: "/iqac/committee" },
  management: { path: "/management" },

  contact: { path: "/contacts" },
  setting: { path: "/settings", multipart: true },
  popup: { path: "/popup", singleton: true },
};

/**
 * DELETE for admission schedules lives on the misspelled "/admision"
 * prefix while its PATCH uses "/admission". Kept separate so the shared
 * item-path helper stays honest about the difference.
 */
export const ADMISSION_SCHEDULE_DELETE_PATH = (id: string | number) =>
  `/admision/admin/schedule/${id}`;

export function getEndpoint(slug: string): EndpointConfig | undefined {
  return ENTITY_ENDPOINTS[slug];
}

export function isConnected(slug: string): boolean {
  return slug in ENTITY_ENDPOINTS;
}

export function collectionPath(slug: string): string {
  const cfg = ENTITY_ENDPOINTS[slug];
  if (!cfg) throw new Error(`No API endpoint registered for "${slug}"`);
  return cfg.path;
}

export function itemPath(slug: string, id: string | number): string {
  const cfg = ENTITY_ENDPOINTS[slug];
  if (!cfg) throw new Error(`No API endpoint registered for "${slug}"`);
  return cfg.item ? cfg.item(id) : `${cfg.path}/${id}`;
}

export function deletePath(slug: string, id: string | number): string {
  if (slug === "admission-schedules") return ADMISSION_SCHEDULE_DELETE_PATH(id);
  if (ENTITY_ENDPOINTS[slug]?.deleteAtRoot) return collectionPath(slug);
  return itemPath(slug, id);
}
