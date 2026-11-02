/** Raw shapes from `GET /circulars`. Every field is optional/nullable on purpose — the mapper in `lib/api/circulars.ts` is what turns them into safe values. */
export interface CircularApiDepartment {
  id?: number | null;
  name?: string | null;
  shortName?: string | null;
  slug?: string | null;
}

export interface CircularApiRecord {
  id?: number | null;
  title?: string | null;
  departmentId?: number | null;
  description?: string | null;
  pdf?: string | null;
  startDate?: string | null;
  endDate?: string | null;
  type?: string | null;
  status?: boolean | null;
  createdAt?: string | null;
  updatedAt?: string | null;
  department?: CircularApiDepartment | null;
}

export interface CircularPagination {
  totalCirculars: number;
  totalPages: number;
  currentPage: number;
  limit: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

/**
 * - `active`   enabled, started, deadline not passed
 * - `upcoming` enabled, start date still in the future
 * - `expired`  deadline passed — wins over `status: true`
 * - `inactive` disabled by the API's `status: false`
 */
export type CircularStatus = "active" | "upcoming" | "expired" | "inactive";

export interface CircularDepartment {
  id: number | null;
  name: string;
  shortName: string;
}

/** Display-ready circular. Dates and status are resolved on the server so the client never formats a date or reads the clock. */
export interface Circular {
  id: number;
  title: string;
  description: string;
  type: string;
  typeLabel: string;
  department: CircularDepartment | null;
  startDateLabel: string | null;
  endDateLabel: string | null;
  updatedAtLabel: string | null;
  status: CircularStatus;
  /** "Closes today", "5 days left", "Opens in 3 days" — null when not meaningful. */
  deadlineNote: string | null;
  /** Share (0–100) of the start→deadline window already elapsed; null when not active or a date is missing. */
  progress: number | null;
  /** Active and closing within 3 days. */
  urgent: boolean;
  pdfUrl: string | null;
  pdfFileName: string | null;
}

export interface CircularFilterOption {
  value: string;
  label: string;
}
