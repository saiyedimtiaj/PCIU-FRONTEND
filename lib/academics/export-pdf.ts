import { jsPDF } from "jspdf";
import autoTable from "jspdf-autotable";

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
const LOGO_WIDTH_MM = 16;
const LOGO_HEIGHT_MM = LOGO_WIDTH_MM * LOGO_ASPECT;

const PAGE_MARGIN = 12;
/** Reserved top margin on every page so autoTable's own page breaks never
 *  draw a continuation row under the repeating header. Generous enough to
 *  fit the logo + title + exam name + filter badges without crowding. */
const HEADER_RESERVED_HEIGHT = 58;

const INK = { r: 17, g: 24, b: 39 };
const MUTED = { r: 100, g: 108, b: 120 };
const BADGE_BG = { r: 238, g: 242, b: 255 };
const BADGE_BORDER = { r: 199, g: 210, b: 254 };
const BADGE_TEXT = { r: 55, g: 48, b: 163 };
const HEAD_FILL = { r: 30, g: 41, b: 90 };
const DAY_OFF_FILL = { r: 241, g: 245, b: 249 };

/** Grid-export palette — matches RoutineInfoBar / ClassScheduleGrid /
 *  ExamScheduleGrid's on-screen hex values exactly, so the downloaded PDF
 *  looks like the same document as what's on screen, not the older flat
 *  list's separate color scheme. */
const GRID_INK = { r: 13, g: 43, b: 69 }; // #0D2B45
const GRID_ACCENT = { r: 5, g: 150, b: 105 }; // #059669
const GRID_BAND = { r: 246, g: 250, b: 255 }; // #F6FAFF
const GRID_HEADER_HEIGHT = 40;

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

/** Compact "Batch: 28" style value for the PDF header badge — the API's
 *  batch field is a full label ("CSE 28th Batch"); showing that verbatim
 *  next to a Department badge already reading "CSE" would repeat itself. */
function batchDisplayValue(batch: string): string {
  return extractBatchNumber(batch) ?? batch;
}

export interface RoutinePdfFilters {
  department?: string;
  batch?: string;
  section?: string;
}

function drawFilterBadges(
  doc: jsPDF,
  pageWidth: number,
  y: number,
  segments: { label: string; value: string }[],
): number {
  const paddingX = 3;
  const gap = 4;
  const pillHeight = 7;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(10);

  const pills = segments.map((s) => {
    const text = `${s.label}: ${s.value}`;
    return { text, width: doc.getTextWidth(text) + paddingX * 2 };
  });
  const totalWidth = pills.reduce((sum, p) => sum + p.width, 0) + gap * (pills.length - 1);

  let x = (pageWidth - totalWidth) / 2;
  for (const pill of pills) {
    doc.setFillColor(BADGE_BG.r, BADGE_BG.g, BADGE_BG.b);
    doc.setDrawColor(BADGE_BORDER.r, BADGE_BORDER.g, BADGE_BORDER.b);
    doc.setLineWidth(0.3);
    doc.roundedRect(x, y, pill.width, pillHeight, 1.5, 1.5, "FD");
    doc.setTextColor(BADGE_TEXT.r, BADGE_TEXT.g, BADGE_TEXT.b);
    doc.text(pill.text, x + pill.width / 2, y + pillHeight / 2 + 1.1, {
      align: "center",
      baseline: "middle",
    });
    x += pill.width + gap;
  }

  doc.setTextColor(0, 0, 0);
  return y + pillHeight;
}

function drawHeader(
  doc: jsPDF,
  routineType: string,
  examName: string | undefined,
  filters: RoutinePdfFilters,
  logoDataUrl: string | null,
): number {
  const pageWidth = doc.internal.pageSize.getWidth();
  let y = 10;

  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      "PNG",
      (pageWidth - LOGO_WIDTH_MM) / 2,
      y,
      LOGO_WIDTH_MM,
      LOGO_HEIGHT_MM,
      undefined,
      "FAST",
    );
    y += LOGO_HEIGHT_MM + 4;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(18);
  doc.setTextColor(INK.r, INK.g, INK.b);
  doc.text(routineType.toUpperCase(), pageWidth / 2, y, { align: "center" });
  y += 4;

  doc.setDrawColor(190, 190, 190);
  doc.setLineWidth(0.4);
  doc.line(pageWidth / 2 - 26, y, pageWidth / 2 + 26, y);
  y += 6;

  if (examName) {
    doc.setFont("helvetica", "italic");
    doc.setFontSize(10.5);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text(examName, pageWidth / 2, y, { align: "center" });
    y += 7;
  }

  const segments = [
    filters.department ? { label: "Department", value: filters.department } : null,
    filters.batch ? { label: "Batch", value: batchDisplayValue(filters.batch) } : null,
    filters.section ? { label: "Section", value: filters.section } : null,
  ].filter((s): s is { label: string; value: string } => s !== null);

  let bottomY: number;
  if (segments.length > 0) {
    bottomY = drawFilterBadges(doc, pageWidth, y, segments);
  } else {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.setTextColor(MUTED.r, MUTED.g, MUTED.b);
    doc.text("All Departments · All Batches · All Sections", pageWidth / 2, y + 5, {
      align: "center",
    });
    bottomY = y + 8;
  }

  doc.setTextColor(0, 0, 0);
  return bottomY;
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

  // Draws page 1's header and, since its layout is deterministic for a given
  // routineType/examName/filters/logo, also tells us exactly how tall the
  // header is — a fixed constant here previously overlapped the filter
  // badges whenever examName pushed them lower than expected (Exam Routine
  // with a long exam name).
  const headerBottomY = drawHeader(doc, routineType, examName, filters, logoDataUrl);
  const contentStartY = Math.max(HEADER_RESERVED_HEIGHT, headerBottomY + 6);

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
    headStyles: { fillColor: [HEAD_FILL.r, HEAD_FILL.g, HEAD_FILL.b], textColor: 255 },
    alternateRowStyles: { fillColor: [248, 249, 252] },
    margin: { top: contentStartY, left: PAGE_MARGIN, right: PAGE_MARGIN },
    // Repeats the document header (logo/title/badges) on every page this
    // table spans, not just the first — autoTable repeats the table's own
    // column header row on each page by default (showHead: "everyPage").
    willDrawPage: () => {
      drawHeader(doc, routineType, examName, filters, logoDataUrl);
    },
  });

  doc.save(filename);
}

/**
 * Header for the grid-style export — a light-blue band with a centered logo,
 * title, and a "Program: X   Section: Y   Batch: Z" line, mirroring
 * RoutineInfoBar's on-screen layout (and its exact hex colors) instead of
 * downloadRoutinePdf's older centered-title + filter-badge-pills header.
 */
function drawGridHeader(
  doc: jsPDF,
  routineType: string,
  filters: RoutinePdfFilters,
  logoDataUrl: string | null,
): void {
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFillColor(GRID_BAND.r, GRID_BAND.g, GRID_BAND.b);
  doc.rect(0, 0, pageWidth, GRID_HEADER_HEIGHT, "F");

  let y = 8;
  if (logoDataUrl) {
    doc.addImage(
      logoDataUrl,
      "PNG",
      (pageWidth - LOGO_WIDTH_MM) / 2,
      y,
      LOGO_WIDTH_MM,
      LOGO_HEIGHT_MM,
      undefined,
      "FAST",
    );
    y += LOGO_HEIGHT_MM + 3;
  }

  doc.setFont("helvetica", "bold");
  doc.setFontSize(16);
  doc.setTextColor(GRID_INK.r, GRID_INK.g, GRID_INK.b);
  doc.text(routineType, pageWidth / 2, y, { align: "center" });
  y += 7;

  const segments = [
    filters.department ? `Program: ${filters.department}` : null,
    filters.section ? `Section: ${filters.section}` : null,
    filters.batch ? `Batch: ${filters.batch}` : null,
  ].filter((s): s is string => Boolean(s));

  if (segments.length > 0) {
    doc.setFont("helvetica", "normal");
    doc.setFontSize(10);
    doc.text(segments.join("      "), pageWidth / 2, y, { align: "center" });
  }

  doc.setTextColor(0, 0, 0);
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
  const { routineType, filters, columns, rowLabelHeader, rows, emptyMessage, filename } = options;

  const [doc, logoDataUrl] = await Promise.all([
    Promise.resolve(
      new jsPDF({ unit: "mm", format: "a4", orientation: "landscape" }) as DocWithAutoTable,
    ),
    loadLogoDataUrl(),
  ]);

  const contentStartY = GRID_HEADER_HEIGHT + 6;
  drawGridHeader(doc, routineType, filters, logoDataUrl);

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
      drawGridHeader(doc, routineType, filters, logoDataUrl);
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
