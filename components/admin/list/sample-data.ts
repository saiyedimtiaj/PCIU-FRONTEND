import type { EntitySchema, FieldDescriptor } from "@/components/admin/form/form-types";

export type SampleRow = { __id: string } & Record<string, unknown>;

// ---------------------------------------------------------------------------
// Deterministic pseudo-random generation. This is design-only data — there is
// no backend — but it must render identically on the server and the client,
// or React throws a hydration mismatch on every one of the ~50 listing pages.
// So: no Math.random(), no Date.now(), no `new Date()`, no toLocaleDateString()
// at render time. Everything below is seeded from the entity slug + field
// name + row index, which is stable across server render, client render, and
// rebuilds.
// ---------------------------------------------------------------------------

function hashString(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

/** mulberry32 — small, fast, deterministic PRNG. */
function mulberry32(seed: number) {
  let t = seed >>> 0;
  return function next() {
    t = (t + 0x6d2b79f5) | 0;
    let r = Math.imul(t ^ (t >>> 15), 1 | t);
    r = (r + Math.imul(r ^ (r >>> 7), 61 | r)) ^ r;
    return ((r ^ (r >>> 14)) >>> 0) / 4294967296;
  };
}

function seededRandom(...parts: (string | number)[]): number {
  return mulberry32(hashString(parts.join("::")))();
}

function pick<T>(items: readonly T[], ...seedParts: (string | number)[]): T {
  const idx = Math.floor(seededRandom(...seedParts) * items.length);
  return items[Math.min(idx, items.length - 1)];
}

// Small curated name pools per entity group so `name`/`title` fields read as
// plausible content instead of "Item 1", "Item 2". Not exhaustive — this is
// sample/preview data, not a content generator.
const GROUP_NAME_POOLS: Record<string, string[]> = {
  Academics: [
    "Computer Science and Engineering",
    "Electrical and Electronic Engineering",
    "Civil Engineering",
    "Business Administration",
    "English Language and Literature",
    "Law",
    "Software Engineering",
    "Data Science",
    "Architecture",
    "Pharmacy",
    "Economics",
    "Public Health",
  ],
  People: [
    "Dr. Farhana Rahman",
    "Prof. Kamal Hossain",
    "Dr. Nusrat Jahan",
    "Md. Shahriar Alam",
    "Dr. Tanvir Ahmed",
    "Prof. Sultana Begum",
    "Dr. Imran Chowdhury",
    "Rafiqul Islam",
    "Dr. Shirin Akter",
    "Prof. Anwarul Karim",
    "Dr. Mahbuba Yasmin",
    "Zahidul Islam",
  ],
  Scheduling: [
    "Spring 2026",
    "Summer 2026",
    "Fall 2026",
    "Section A",
    "Section B",
    "Room 301",
    "Room 402",
    "Academic Building 1",
    "Science Complex",
    "Mid Term Exam",
    "Final Exam",
    "9:00 AM – 10:30 AM",
  ],
  Content: [
    "New Semester Registration Opens",
    "Annual Sports Week 2026",
    "Guest Lecture on AI Ethics",
    "Convocation 2026 Announcement",
    "Library Extended Hours Notice",
    "Cultural Fest Highlights",
    "Research Grant Awarded",
    "Alumni Meetup Recap",
    "Orientation Program for Freshers",
    "Scholarship Application Deadline",
    "Campus Blood Donation Drive",
    "Industry Collaboration Signed",
  ],
  Research: [
    "Centre for AI and Data Science",
    "Sustainable Energy Research Group",
    "Machine Learning for Healthcare",
    "Urban Planning and Smart Cities",
    "Applied Materials Science Lab",
    "Language Technology Research Unit",
    "Renewable Energy Systems",
    "Environmental Policy Studies",
    "Biomedical Signal Processing",
    "Software Systems Research Centre",
    "Robotics and Automation Lab",
    "Public Policy and Governance",
  ],
  Journal: [
    "Port City Journal Vol. 12, Issue 1",
    "Advances in Renewable Energy Systems",
    "A Study on Coastal Urban Growth",
    "Deep Learning for Bengali NLP",
    "Governance Models in South Asia",
    "Port City Journal Vol. 11, Issue 2",
    "Sustainable Materials for Construction",
    "Financial Inclusion in Bangladesh",
    "Curriculum Reform in Higher Education",
    "Port City Journal Vol. 12, Issue 2",
    "Water Resource Management Strategies",
    "Digital Transformation in SMEs",
  ],
  Admission: [
    "Spring 2026 Admission Circular",
    "Undergraduate Admission Test Result",
    "MBA Program Fee Structure",
    "Admission Schedule — Fall 2026",
    "Merit Scholarship Notice",
    "Application Deadline Extended",
    "Transfer Student Guidelines",
    "Postgraduate Admission Circular",
    "Entrance Test Syllabus",
    "Waiver Policy Update",
    "International Student Admission",
    "Second Merit List Published",
  ],
  IQAC: [
    "Quality Assurance Annual Report",
    "IQAC Committee Meeting Minutes",
    "Self Assessment Report 2026",
    "Feedback Analysis Summary",
    "Institutional Quality Policy",
    "Accreditation Progress Update",
    "Curriculum Review Committee",
    "Teaching Quality Enhancement Plan",
    "Student Satisfaction Survey Results",
    "IQAC Strategic Plan 2026-2030",
    "Best Practices Documentation",
    "Quality Audit Checklist",
  ],
  System: [
    "Primary Contact",
    "Admissions Office",
    "Registrar Office",
    "Site Configuration",
    "Notification Settings",
    "Support Desk",
    "General Enquiries",
    "IT Helpdesk",
    "Alumni Relations",
    "Media & Communications",
    "Finance Office",
    "Student Affairs",
  ],
};

const FALLBACK_NAMES = [
  "Sample Record One",
  "Sample Record Two",
  "Sample Record Three",
  "Sample Record Four",
  "Sample Record Five",
];

// Stored as plain ISO strings (yyyy-MM-dd) — required so an edit page can
// feed one straight into <input type="date">, and so date filtering/sorting
// is a stable string comparison instead of the old locale-formatted
// "03 Jan 2026" strings (alphabetical, not chronological, and rejected by
// <input type="date">). Display formatting happens separately in
// columns.tsx via formatSampleDate() — never toLocaleDateString() at render
// time, since that call can differ by runtime ICU data and has caused
// hydration warnings elsewhere in this codebase before.
const SAMPLE_DATES = [
  "2026-01-03", "2026-01-11", "2026-01-22", "2026-02-05", "2026-02-14",
  "2026-03-01", "2026-03-12", "2026-03-26", "2026-04-08", "2026-04-19",
  "2026-05-02", "2026-05-15", "2026-05-27", "2026-06-09", "2026-06-20",
  "2026-07-03", "2026-07-16", "2026-07-28", "2026-08-11", "2026-08-24",
];

const MONTH_ABBR = [
  "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec",
] as const;

/**
 * Formats an ISO "yyyy-MM-dd" (optionally "yyyy-MM-ddTHH:mm") string as
 * "03 Jan 2026" for display — a pure string→string transform with no
 * locale/timezone lookups, so it renders identically on server and client.
 * Never use toLocaleDateString() here (see the SAMPLE_DATES comment above).
 */
export function formatSampleDate(iso: string): string {
  const [datePart] = iso.split("T");
  const [year, month, day] = datePart.split("-");
  const monthName = MONTH_ABBR[Number(month) - 1];
  if (!year || !monthName || !day) return iso;
  return `${day} ${monthName} ${year}`;
}

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function numberRange(fieldName: string): [number, number] {
  const name = fieldName.toLowerCase();
  if (/year/.test(name)) return [2018, 2026];
  if (/(credit|count|semester)/.test(name)) return [1, 6];
  if (/(amount|fee|price|salary)/.test(name)) return [500, 50000];
  return [1, 500];
}

function generateFieldValue(
  field: FieldDescriptor,
  schema: EntitySchema,
  rowIndex: number,
  namePool: readonly string[],
  generatedName: string
): unknown {
  const seedBase = [schema.slug, field.name, rowIndex];
  const fieldName = field.name.toLowerCase();

  if (/^(name|title|label|heading)$/.test(fieldName)) {
    return generatedName;
  }
  if (fieldName === "slug") {
    return slugify(generatedName);
  }

  switch (field.type) {
    case "email":
      return `${slugify(generatedName)}@portcity.edu.bd`;
    case "tel": {
      const digits = String(hashString(seedBase.join("::"))).padStart(9, "0").slice(0, 9);
      return `+8801${digits}`;
    }
    case "url":
      return `https://portcity.edu.bd/${slugify(generatedName)}`;
    case "date":
      return pick(SAMPLE_DATES, ...seedBase);
    case "datetime": {
      const isoDate = pick(SAMPLE_DATES, ...seedBase);
      const hour = String(9 + (hashString(seedBase.join("::")) % 9)).padStart(2, "0");
      return `${isoDate}T${hour}:00`;
    }
    case "time":
      return pick(["09:00 AM", "10:30 AM", "12:00 PM", "02:00 PM", "03:30 PM"], ...seedBase);
    case "enum":
    case "select":
    case "radio":
    case "relation":
      // Store the option's stable `value` (what a real <Select> binds to
      // and what an edit form needs for defaultValues), not its `label` —
      // display formatting resolves the label back out in columns.tsx.
      return field.options && field.options.length > 0
        ? pick(field.options, ...seedBase).value
        : "";
    case "switch":
    case "checkbox":
      return seededRandom(...seedBase) > 0.3;
    case "number":
    case "decimal": {
      const [lo, hi] = numberRange(fieldName);
      return lo + Math.floor(seededRandom(...seedBase) * (hi - lo));
    }
    case "json-list": {
      const count = 1 + Math.floor(seededRandom(...seedBase) * 3);
      return Array.from({ length: count }, (_, i) => pick(namePool, ...seedBase, i));
    }
    case "image":
      return "";
    case "textarea":
    case "richtext":
      return `Sample ${field.label.toLowerCase()} content for preview purposes.`;
    default:
      return generatedName;
  }
}

/**
 * Generates a stable, plausible-looking set of sample rows for an entity's
 * listing page. Deterministic — same output every time for a given schema,
 * so server and client render identically (required to avoid a hydration
 * mismatch across all generated listing pages).
 */
export function generateSampleRows(schema: EntitySchema, count?: number): SampleRow[] {
  const rowCount = count ?? 12 + (hashString(schema.slug) % 40);
  const namePool = GROUP_NAME_POOLS[schema.group] ?? FALLBACK_NAMES;
  const fields = schema.sections.flatMap((s) => s.fields);

  return Array.from({ length: rowCount }, (_, i) => {
    const generatedName = pick(namePool, schema.slug, "name", i);
    const row: SampleRow = { __id: `${schema.slug}-${i}` };
    for (const field of fields) {
      row[field.name] = generateFieldValue(field, schema, i, namePool, generatedName);
    }
    return row;
  });
}

/** A short seeded number series, for dashboard sparklines. Deterministic. */
export function generateSeries(seed: string, points = 12, min = 20, max = 100): number[] {
  return Array.from({ length: points }, (_, i) => Math.round(min + seededRandom(seed, i) * (max - min)));
}
