import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";
import type { ExamRoutine } from "@/types/academics";
import { courseLabel, formatIsoDate } from "./routine-grid";
import { timeRangeSortKey } from "./time-sort";

/**
 * jspdf-autotable v5 still writes `doc.lastAutoTable` at runtime (see
 * jspdf.plugin.autotable.mjs) for backward-compatible cursor tracking, but
 * no longer types it on the jsPDF instance — hence the cast where read.
 */
type DocWithAutoTable = jsPDF & { lastAutoTable?: { finalY: number } };

const LOGO_PATH = "/images/pciu-logo.png";
/** Real pixel dimensions of public/images/pciu-logo.png — preserved exactly
 *  so the logo is never stretched/distorted in the PDF. */
const LOGO_ASPECT = 93 / 65;

const PAGE_MARGIN = 12;

const MUTED = { r: 100, g: 108, b: 120 };
const BADGE_BG = { r: 238, g: 242, b: 255 };
const BADGE_BORDER = { r: 199, g: 210, b: 254 };
const BADGE_TEXT = { r: 55, g: 48, b: 163 };
const DAY_OFF_FILL = { r: 241, g: 245, b: 249 };

/** Shared palette for every routine PDF — matches RoutineInfoBar /
 *  ClassScheduleGrid / ExamScheduleGrid's on-screen hex values exactly, so
 *  a downloaded PDF (flat list or single-section grid) looks like the same
 *  document family as the page it was downloaded from. */
const GRID_INK = { r: 13, g: 43, b: 69 }; // #0D2B45
const GRID_ACCENT = { r: 5, g: 150, b: 105 }; // #059669
const GRID_BAND = { r: 246, g: 250, b: 255 }; // #F6FAFF
const GRID_LOGO_WIDTH_MM = 13;
const GRID_LOGO_HEIGHT_MM = GRID_LOGO_WIDTH_MM * LOGO_ASPECT;

/** Loads the site's real logo (used already in Navbar/AdminSidebar/AuthShell)
 *  as a data URL for jsPDF.addImage — fetched client-side since PDF export
 *  runs entirely in the browser. Returns null if it can't be loaded, so the
 *  header still renders (title-only) rather than failing the whole download. */
async function loadLogoDataUrl(): Promise<string | null> {
  try {
    const res = await fetch(LOGO_PATH);
    if (!res.ok) return null;
    const blob = await res.blob();
    return await new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = () => reject(reader.error);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

function extractBatchNumber(batch: string): string | null {
  const match = batch.match(/\d+/);
  return match ? match[0] : null;
}

export interface RoutinePdfFilters {
  department?: string;
  batch?: string;
  section?: string;
}

/** Rounded pill behind the exam-name subtitle — same visual language as the
 *  Department/Batch/Section filter badges below it, so the exam name reads
 *  as a designed header element instead of plain italic text. */
function drawExamNameBadge(doc: jsPDF, pageWidth: number, y: number, examName: string): number {
  const paddingX = 5;
  const pillHeight = 7.5;

  doc.setFont("helvetica", "bolditalic");
  doc.setFontSize(11);
  const textWidth = doc.getTextWidth(examName);
  const pillWidth = textWidth + paddingX * 2;
  const x = (pageWidth - pillWidth) / 2;

  doc.setFillColor(BADGE_BG.r, BADGE_BG.g, BADGE_BG.b);
  doc.setDrawColor(BADGE_BORDER.r, BADGE_BORDER.g, BADGE_BORDER.b);
  doc.setLineWidth(0.35);
  doc.roundedRect(x, y, pillWidth, pillHeight, 2, 2, "FD");
  doc.setTextColor(BADGE_TEXT.r, BADGE_TEXT.g, BADGE_TEXT.b);
  doc.text(examName, pageWidth / 2, y + pillHeight / 2 + 1, {
    align: "center",
    baseline: "middle",
  });

  doc.setTextColor(0, 0, 0);
  return y + pillHeight;
}

/**
 * Shared header for every routine PDF — flat list or single-section grid —
 * a light-blue band with a centered logo, bold navy title, an optional
 * exam-name badge, and a "Program: X   Section: Y   Batch: Z" line (or an
 * "All Departments · All Batches · All Sections" fallback when nothing is
 * filtered). Mirrors RoutineInfoBar's on-screen design exactly, so a full
 * unfiltered download and a narrowed single-section download read as the
 * same document family instead of two different-looking PDFs. Returns the
 * band height actually used (it varies with which optional pieces are
 * present) so the caller can start its table right below it.
 */
function drawRoutineHeader(
  doc: jsPDF,
  routineType: string,
  examName: string | undefined,
  filters: RoutinePdfFilters,
  logoDataUrl: string | null,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();

  const segments = [
    filters.department ? `Program: ${filters.department}` : null,
    filters.section ? `Section: ${filters.section}` : null,
    filters.batch ? `Batch: ${filters.batch}` : null,
  ].filter((s): s is string => Boolean(s));
  const segmentsLine = segments.length > 0 ? segments.join("      ") : "All Departments · All Batches · All Sections";

  const topPad = 7;
  const logoBlock = logoDataUrl ? GRID_LOGO_HEIGHT_MM + 5 : 0;
  const titleBlock = 7;
  const examBlock = examName ? 7.5 + 4 : 0;
  const segmentsBlock = 6;
  const bottomPad = 6;
  const bandHeight = topPad + logoBlock + titleBlock + examBlock + segmentsBlock + bottomPad;

  doc.setFillColor(GRID_BAND.r, GRID_BAND.g, GRID_BAND.b);
  doc.rect(0, 0, pageWidth, bandHeight, "F");

  let y = topPad;
  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      "PNG",
      (pageWidth - GRID_LOGO_WIDTH_MM) / 2,
      y,
      GRID_LOGO_WIDTH_MM,
      GRID_LOGO_HEIGHT_MM,
      undefined,
      "FAST",
    );
    y += GRID_LOGO_HEIGHT_MM + 5;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(15);
  doc.setTextColor(GRID_INK.r, GRID_INK.g, GRID_INK.b);
  doc.text(routineType, pageWidth / 2, y, { align: "center" });
  y += titleBlock;

  if (examName) {
    y = drawExamNameBadge(doc, pageWidth, y, examName) + 4;
  }

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);
  doc.setTextColor(GRID_INK.r, GRID_INK.g, GRID_INK.b);
  doc.text(segmentsLine, pageWidth / 2, y, { align: "center" });

  doc.setTextColor(0, 0, 0);
  return bandHeight;
}

export async function downloadRoutinePdf(options: {
  /** e.g. "Class Routine" / "Exam Routine" — printed as the centered title. */
  routineType: string;
  /** Exam Routine only — shown as a subtitle under the title. */
  examName?: string;
  filters: RoutinePdfFilters;
  columns: string[];
  rows: (string | number)[][];
  emptyMessage?: string;
  filename: string;
}): Promise<void> {
  const { routineType, examName, filters, columns, rows, emptyMessage, filename } = options;

  const [doc, logoDataUrl] = await Promise.all([
    Promise.resolve(new jsPDF({ unit: "mm", format: "a4" }) as DocWithAutoTable),
    loadLogoDataUrl(),
  ]);

  const headerHeight = drawRoutineHeader(doc, routineType, examName, filters, logoDataUrl);
  const contentStartY = headerHeight + 6;

  if (rows.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(
      emptyMessage ?? "No routine found for the selected filters.",
      doc.internal.pageSize.getWidth() / 2,
      contentStartY,
      { align: "center" },
    );
    doc.setTextColor(0, 0, 0);
    doc.save(filename);
    return;
  }

  autoTable(doc, {
    startY: contentStartY,
    head: [columns],
    body: rows,
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [GRID_INK.r, GRID_INK.g, GRID_INK.b], textColor: 255 },
    alternateRowStyles: { fillColor: [GRID_BAND.r, GRID_BAND.g, GRID_BAND.b] },
    margin: { top: contentStartY, left: PAGE_MARGIN, right: PAGE_MARGIN },
    // Repeats the document header (logo/title/segments) on every page this
    // table spans, not just the first — autoTable repeats the table's own
    // column header row on each page by default (showHead: "everyPage").
    willDrawPage: () => {
      drawRoutineHeader(doc, routineType, examName, filters, logoDataUrl);
    },
  });

  doc.save(filename);
}

export interface RoutineGridRow {
  /** Left column value — a day name for Class Routine, a date for Exam Routine. */
  label: string;
  /** When true, renders as a single merged "DAY OFF" band instead of per-column cells
   *  (only meaningful for Class Routine, where every weekday is a known, fixed row). */
  isOff?: boolean;
  /** Cell text per column, aligned by index; a blank slot is just an empty string. */
  cells?: string[];
}

/**
 * Grid-style export used once a routine is narrowed to a single Department +
 * Batch + Section — mirrors the on-screen ClassScheduleGrid/ExamScheduleGrid
 * (Day or Date rows × time-slot columns) instead of the flat per-record list
 * downloadRoutinePdf produces. Rendered landscape since a real timetable is
 * wider than it is tall once every time slot gets its own column.
 */
export async function downloadRoutineGridPdf(options: {
  /** e.g. "Class Routine" / "Exam Routine" — printed as the centered title. */
  routineType: string;
  /** Exam Routine only — shown as a subtitle under the title. */
  examName?: string;
  filters: RoutinePdfFilters;
  /** Time-slot column headers, already in chronological order. */
  columns: string[];
  /** Header label for the left-hand row column ("Day" or "Date"). */
  rowLabelHeader: string;
  rows: RoutineGridRow[];
  emptyMessage?: string;
  filename: string;
}): Promise<void> {
  const { routineType, examName, filters, columns, rowLabelHeader, rows, emptyMessage, filename } = options;

  const [doc, logoDataUrl] = await Promise.all([
    Promise.resolve(
      new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" }) as DocWithAutoTable,
    ),
    loadLogoDataUrl(),
  ]);

  const headerHeight = drawRoutineHeader(doc, routineType, examName, filters, logoDataUrl);
  const contentStartY = headerHeight + 6;

  if (rows.length === 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(
      emptyMessage ?? "No routine found for the selected filters.",
      doc.internal.pageSize.getWidth() / 2,
      contentStartY,
      { align: "center" },
    );
    doc.setTextColor(0, 0, 0);
    doc.save(filename);
    return;
  }

  const roomColumnIndex = columns.findIndex((c) => c.toLowerCase() === "room");

  const body = rows.map((row) => {
    if (row.isOff) {
      return [
        row.label,
        {
          content: "DAY OFF",
          colSpan: columns.length,
          styles: {
            halign: "center" as const,
            fillColor: [DAY_OFF_FILL.r, DAY_OFF_FILL.g, DAY_OFF_FILL.b] as [number, number, number],
            textColor: [MUTED.r, MUTED.g, MUTED.b] as [number, number, number],
            fontStyle: "bold" as const,
          },
        },
      ];
    }
    return [row.label, ...columns.map((_, i) => row.cells?.[i] || "")];
  });

  autoTable(doc, {
    startY: contentStartY,
    head: [[rowLabelHeader, ...columns]],
    body,
    styles: { fontSize: 8, cellPadding: 2.5, valign: "top" },
    headStyles: { fillColor: [GRID_INK.r, GRID_INK.g, GRID_INK.b], textColor: 255 },
    alternateRowStyles: { fillColor: [GRID_BAND.r, GRID_BAND.g, GRID_BAND.b] },
    margin: { top: contentStartY, left: PAGE_MARGIN, right: PAGE_MARGIN },
    // Column 0 is the row label (Day/Date); a data column's index in the
    // table is offset by one from its index in `columns`.
    didParseCell: (data) => {
      if (roomColumnIndex !== -1 && data.section === "body" && data.column.index === roomColumnIndex + 1) {
        data.cell.styles.textColor = [GRID_ACCENT.r, GRID_ACCENT.g, GRID_ACCENT.b];
        data.cell.styles.fontStyle = "bold";
      }
    },
    // Repeats the light-blue header band on every page this table spans.
    willDrawPage: () => {
      drawRoutineHeader(doc, routineType, examName, filters, logoDataUrl);
    },
  });

  doc.save(filename);
}

/** Sanitizes an arbitrary label (e.g. a batch/section name from the API) into a safe filename segment. */
export function filenameSegment(value: string, fallback = "All"): string {
  const cleaned = value
    .trim()
    .replace(/[^a-zA-Z0-9]+/g, "_")
    .replace(/^_+|_+$/g, "");
  return cleaned || fallback;
}

/**
 * Batch labels from the API are full descriptive strings (e.g. "CSE 28th
 * Batch"), not a bare number — pull the leading number out for a compact
 * "Batch-28" filename segment, falling back to the sanitized full label if
 * the batch name has no digits.
 */
export function batchFilenamePart(batch: string): string {
  const num = extractBatchNumber(batch);
  return `Batch-${num ?? filenameSegment(batch)}`;
}

export function sectionFilenamePart(section: string): string {
  return `Section-${filenameSegment(section)}`;
}

/** Mon/Tue/... label for a "YYYY-MM-DD" date string. Only ever called from
 *  the click-triggered download path below (never during render), so using
 *  `Date` here carries none of the server/client hydration mismatch risk
 *  this codebase avoids for on-screen date formatting. */
function dayOfWeekLabel(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return "";
  const [, year, month, day] = match;
  const date = new Date(Date.UTC(Number(year), Number(month) - 1, Number(day)));
  return date.toLocaleDateString("en-US", { weekday: "long", timeZone: "UTC" });
}

/** Sanitizes an exam name into a filename segment, preserving hyphens already
 *  in the name (unlike filenameSegment, which collapses them to underscores
 *  along with every other non-alphanumeric run) — keeps "Final-Term ..."
 *  reading naturally in the saved file instead of becoming "Final_Term_...". */
function examNameFilenamePart(examName: string): string {
  return examName.trim().replace(/\s+/g, "_").replace(/[^a-zA-Z0-9_-]/g, "") || "Exam";
}

/**
 * Single reusable full-routine PDF download for one examination — called
 * identically from an exam card's "View Routine" button and its Download
 * icon (ExamCardActions) so the two can never drift into separate
 * implementations. Always exports every routine row for `examId` (ignoring
 * any on-screen department/batch/section filter elsewhere on the page), and
 * renders through the same downloadRoutinePdf used by Class Routine so the
 * branding/layout matches exactly.
 */
export async function downloadExamRoutinePdf(options: {
  examId: number;
  examName: string;
  /** All exam routines across every exam — filtered to `examId` here so
   *  callers can just pass the full list already loaded on the page. */
  routines: ExamRoutine[];
}): Promise<void> {
  const { examId, examName, routines } = options;

  const examRoutines = routines
    .filter((r) => r.examId === examId)
    .sort(
      (a, b) => a.date.localeCompare(b.date) || timeRangeSortKey(a.timeSlot) - timeRangeSortKey(b.timeSlot),
    );

  // Condensed the same way Class Routine's own flat download reads —
  // Course Name/Code into one "Course" cell, Department/Batch/Section into
  // one "Dept / Batch / Section" cell, Room/Building into one "Room" cell —
  // instead of a raw one-column-per-field list, so a routine covering many
  // departments still reads as a clean, spacious table on A4 portrait.
  const hasShift = examRoutines.some((r) => r.shift);
  const columns = [
    "Date",
    "Day",
    "Time",
    "Course",
    "Dept / Batch / Section",
    "Room",
    "Student Range",
    ...(hasShift ? ["Shift"] : []),
  ];
  const rows = examRoutines.map((r) => [
    formatIsoDate(r.date),
    dayOfWeekLabel(r.date),
    r.timeSlot,
    courseLabel(r),
    `${r.department} - ${r.batch} (${r.section})`,
    [r.room, r.building].filter(Boolean).join(", "),
    r.studentRange,
    ...(hasShift ? [r.shift ?? ""] : []),
  ]);

  await downloadRoutinePdf({
    routineType: "Exam Routine",
    examName,
    filters: {},
    columns,
    rows,
    emptyMessage: "No routine available for this examination yet.",
    filename: `${examNameFilenamePart(examName)}_Exam_Routine.pdf`,
  });
}
