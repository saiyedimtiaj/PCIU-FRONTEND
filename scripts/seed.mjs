#!/usr/bin/env node
/**
 * Fills the PCIU backend with realistic test data, in foreign-key order.
 *
 * Usage:
 *   PCIU_EMAIL=you@portcity.edu.bd PCIU_PASSWORD='...' node scripts/seed.mjs
 *   node scripts/seed.mjs --dry     # print what would be created, write nothing
 *
 * Only creates. Never deletes or overwrites. Anything that already exists
 * (matched on a natural key) is skipped and its id reused for foreign keys.
 */

import process from "node:process";

const BASE =
  process.env.NEXT_PUBLIC_BACKEND_BASE_URL ??
  "https://pciu-web-backend.onrender.com/api/v1";
const EMAIL = process.env.PCIU_EMAIL;
const PASSWORD = process.env.PCIU_PASSWORD;
const DRY = process.argv.includes("--dry");

if (!DRY && (!EMAIL || !PASSWORD)) {
  console.error(
    "Missing credentials.\n" +
      "  PCIU_EMAIL=... PCIU_PASSWORD='...' node scripts/seed.mjs\n" +
      "  (or run with --dry to preview without writing)",
  );
  process.exit(1);
}

let cookie = "";
const created = [];
const skipped = [];
const failed = [];

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

/** The API rate-limits by IP, so a 429 is retried with a backoff. */
async function call(method, path, body, attempt = 0) {
  const headers = { Cookie: cookie };
  let payload;
  if (body !== undefined) {
    headers["Content-Type"] = "application/json";
    payload = JSON.stringify(body);
  }
  const res = await fetch(BASE + path, { method, headers, body: payload });
  const text = await res.text();
  let json;
  try {
    json = JSON.parse(text);
  } catch {
    json = { message: text.slice(0, 120) };
  }

  if (res.status === 429 && attempt < 4) {
    const wait = 15000 * (attempt + 1);
    console.log(`    rate limited — waiting ${wait / 1000}s...`);
    await sleep(wait);
    return call(method, path, body, attempt + 1);
  }

  // Stay under the limit on long runs.
  await sleep(350);
  return { ok: res.ok && json?.success !== false, status: res.status, json };
}

async function login(attempt = 0) {
  const res = await fetch(`${BASE}/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email: EMAIL, password: PASSWORD }),
  });

  if (res.status === 429 && attempt < 4) {
    const wait = 20000 * (attempt + 1);
    console.log(`Rate limited on login — waiting ${wait / 1000}s...`);
    await new Promise((r) => setTimeout(r, wait));
    return login(attempt + 1);
  }
  const setCookie = res.headers.getSetCookie?.() ?? [];
  const token = setCookie
    .map((c) => /better-auth\.session_token=([^;]*)/.exec(c)?.[1])
    .find(Boolean);
  if (!token) {
    const body = await res.text();
    throw new Error(`Login failed (${res.status}): ${body.slice(0, 160)}`);
  }
  cookie = `better-auth.session_token=${token}`;
}

async function list(path) {
  const { ok, json } = await call("GET", path);
  if (!ok) return [];
  const d = json?.data;
  if (Array.isArray(d)) return d;
  if (d && typeof d === "object") {
    if (Array.isArray(d.teachers)) return d.teachers;
    return Object.values(d).flatMap((v) => (Array.isArray(v) ? v : []));
  }
  return [];
}

/** Creates `body` at `path` unless a row already matches on `match`. */
async function ensure(label, path, body, match) {
  if (DRY) {
    console.log(`  would create  ${label}`);
    created.push({ label, id: "(dry)" });
    return null;
  }

  const existing = await list(path);
  const hit = match
    ? existing.find((row) =>
        Object.entries(match).every(
          ([k, v]) => String(row?.[k] ?? "").toLowerCase() === String(v).toLowerCase(),
        ),
      )
    : null;

  if (hit) {
    console.log(`  · exists      ${label} (id ${hit.id})`);
    skipped.push({ label, id: hit.id });
    return hit.id;
  }

  const { ok, status, json } = await call("POST", path, body);
  if (!ok) {
    console.log(`  ✗ failed      ${label} — ${status} ${json?.message ?? ""}`);
    failed.push({ label, status, message: json?.message });
    return null;
  }
  const id = json?.data?.id ?? null;
  console.log(`  ✓ created     ${label}${id ? ` (id ${id})` : ""}`);
  created.push({ label, id });
  return id;
}

async function main() {
  if (!DRY) {
    await login();
    console.log(`Signed in as ${EMAIL}\n`);
  } else {
    console.log("DRY RUN — nothing will be written\n");
  }

  // ---- 1. Foundation: faculty -> department -> teacher ----------------
  console.log("Academics");
  const facultyId =
    (await ensure(
      "Faculty of Science and Engineering",
      "/faculties",
      {
        name: "Faculty of Science and Engineering",
        slug: "science-engineering",
        about: "Engineering, computing and applied science programmes at PCIU.",
        mission: "Produce industry-ready engineers and scientists.",
        vision: "A regional centre of excellence in applied technology.",
        keyPoint: ["Modern labs", "Industry partnerships", "Research focus"],
        status: true,
      },
      { slug: "science-engineering" },
    )) ?? 1;

  // facultyId is captured for reference; the API's POST /departments body
  // does not accept it (see docs/API-STATUS-BN.md).
  console.log(`  (faculty id ${facultyId} available for department linking)`);

  const departmentId =
    (await ensure(
      "Department of CSE",
      "/departments",
      {
        name: "Department of Computer Science and Engineering",
        shortName: "CSE",
        slug: "cse",
        title: "Building Tomorrow's Innovators in Tech",
        subtitle: "Excellence in Computing, Software Engineering and AI",
        phone: "+8801812345678",
        email: "cse@portcity.edu.bd",
        officeLocation: "Academic Building 1, 4th Floor",
        graduate: "2450",
        numberOfResearch: "120",
        numberOfPartner: "15",
        currentStudent: "1850",
        description: "The CSE department trains software engineers and data scientists.",
        status: 1,
      },
      { slug: "cse" },
    )) ?? 1;

  console.log("\nScheduling");
  const semesterId =
    (await ensure(
      "Semester Spring 2027",
      "/academic/semesters",
      { title: "Spring 2027", status: true },
      { title: "Spring 2027" },
    )) ?? 1;

  const buildingId =
    (await ensure(
      "Academic Building 1",
      "/academic/buildings",
      { name: "Academic Building 1", status: true },
      { name: "Academic Building 1" },
    )) ?? 1;

  const roomId =
    (await ensure(
      "Room 501",
      "/academic/rooms",
      { buildingId, name: "Room 501", status: true },
      { name: "Room 501" },
    )) ?? 1;

  const batchId =
    (await ensure(
      "Batch CSE 30",
      "/academic/batches",
      { departmentId, name: "CSE 30", status: true },
      { name: "CSE 30" },
    )) ?? 1;

  const sectionId =
    (await ensure(
      "Section B",
      "/academic/sections",
      { batchId, name: "B", status: true },
      { name: "B" },
    )) ?? 1;

  const timeSlotId =
    (await ensure(
      "Time slot 09:00-10:30",
      "/academic/time-slots",
      { startTime: "09:00", endTime: "10:30", type: "CLASS", status: true },
      { startTime: "09:00" },
    )) ?? 1;

  const courseId =
    (await ensure(
      "Course CSE-201",
      "/academic/courses",
      { departmentId, name: "Object Oriented Programming", code: "CSE-201", status: true },
      { code: "CSE-201" },
    )) ?? 1;

  const examId = await ensure(
    "Exam Mid-Term Spring 2027",
    "/academic/exams",
    {
      semesterId,
      name: "Mid-Term Examination Spring 2027",
      startDate: "2027-03-15",
      endDate: "2027-03-25",
      status: true,
    },
    { name: "Mid-Term Examination Spring 2027" },
  );

  console.log("\nContent");
  const pageId =
    (await ensure(
      "Page: Campus Life",
      "/pages",
      {
        title: "Campus Life",
        slug: "campus-life",
        path: "/campus-life",
        pageType: "static",
        metaTitle: "Campus Life at PCIU",
        metaDescription: "Clubs, sports and student activities at Port City.",
        status: "published",
        sortOrder: 2,
      },
      { slug: "campus-life" },
    )) ?? 1;

  await ensure(
    "Notice: Spring 2027 registration",
    "/notices",
    {
      title: "Spring 2027 course registration opens 5 January",
      badgeLabel: "New",
      badgeColor: "green",
      category: "Academic",
      noticeDate: "2027-01-05",
      departmentId,
      pageId,
      isActive: true,
      isHome: true,
      sortOrder: 1,
    },
    { title: "Spring 2027 course registration opens 5 January" },
  );

  await ensure(
    "FAQ: admission requirements",
    "/faqs",
    {
      type: "admission",
      question: "What are the minimum requirements for undergraduate admission?",
      answer: "A minimum GPA of 2.5 in both SSC and HSC, or equivalent.",
      displayOrder: 1,
      isActive: true,
    },
    { question: "What are the minimum requirements for undergraduate admission?" },
  );

  await ensure(
    "Menu: Academics",
    "/menus",
    { name: "Academics", location: "HEADER", type: "ACADEMICS", slug: "academics", isActive: true },
    { slug: "academics" },
  );

  console.log("\nJournal");
  const volumeId = await ensure(
    "PCJ Volume 5 Issue 1",
    "/pcj/volumes",
    {
      volumeNumber: 5,
      issueNumber: 1,
      publicationDate: "2026-12-01",
      description: "Port City Journal, Volume 5 Issue 1.",
      status: true,
    },
    { volumeNumber: 5 },
  );

  if (volumeId) {
    await ensure(
      "PCJ article",
      "/pcj/articles",
      {
        volumeId,
        departmentId,
        title: "A Survey of Federated Learning in Low-Bandwidth Networks",
        authors: "Dr. Jane Doe, Dr. A. Rahman",
        abstract: "We review federated learning approaches suited to constrained networks.",
        keywords: "federated learning, edge computing",
        pages: "12-28",
        doi: "10.1234/pcj.2026.5.1.02",
        publicationDate: "2026-12-01",
        displayOrder: 1,
        status: true,
      },
      { doi: "10.1234/pcj.2026.5.1.02" },
    );
  }

  console.log("\nAdmission");
  await ensure(
    "MBA eligibility tier",
    "/admission/admin/mba-eligibility",
    {
      academicBackground: "Bachelor of Business Administration",
      creditsRequired: "40",
      perCreditFeeBDT: "2500",
      totalFeeBDT: "100000",
    },
    { academicBackground: "Bachelor of Business Administration" },
  );

  console.log("\nIQAC & System");
  await ensure(
    "IQAC committee member",
    "/iqac/committee",
    { teacherId: 1, designation: "Convener", status: true, iqacOrder: 1 },
    { designation: "Convener" },
  );

  // The API rejects a teacher who isn't flagged isManagement, so pick one
  // that is rather than assuming teacher 1 qualifies.
  const teachers = await list("/teachers/admin");
  const managementTeacher = teachers.find((t) => t.isManagement);
  if (managementTeacher) {
    await ensure(
      "Management member",
      "/management",
      {
        teacherId: managementTeacher.id,
        designation: "Chairman",
        managementRole: "Board of Trustees",
        type: "SYNDICATE",
        status: true,
      },
      { designation: "Chairman" },
    );
  } else {
    console.log("  · skipped     Management member (no teacher has isManagement = true)");
  }

  await ensure(
    "Contact: CSE office",
    "/contacts",
    {
      officeName: "CSE Departmental Office",
      address: "Academic Building 1, 4th Floor, Chattogram",
      phone: "+8801812345678",
      email: "cse.office@portcity.edu.bd",
      mapUrl: "https://maps.google.com/?q=Port+City+International+University",
      contactPerson: "Md. Karim",
      availableHours: "Sun-Thu, 9:00am - 5:00pm",
      type: "DEPARTMENT",
    },
    { officeName: "CSE Departmental Office" },
  );

  await ensure(
    "Setting: site tagline",
    "/settings",
    { key: "site_tagline", value: "Where the Bay Meets Brilliance", status: true, pageId, page: "home" },
    { key: "site_tagline" },
  );
  await ensure(
    "Setting: contact phone",
    "/settings",
    { key: "contact_phone", value: "+8801812345678", status: true, pageId, page: "home" },
    { key: "contact_phone" },
  );
  await ensure(
    "Setting: contact email",
    "/settings",
    { key: "contact_email", value: "info@portcity.edu.bd", status: true, pageId, page: "home" },
    { key: "contact_email" },
  );
  await ensure(
    "Setting: admission open",
    "/settings",
    { key: "admission_open", value: "true", status: true },
    { key: "admission_open" },
  );
  await ensure(
    "Setting: homepage research count",
    "/settings",
    { key: "home_research_projects", value: "500", status: true, pageId, page: "home" },
    { key: "home_research_projects" },
  );
  await ensure(
    "Setting: footer copyright",
    "/settings",
    { key: "footer_copyright", value: "© 2027 Port City International University. All rights reserved.", status: true },
    { key: "footer_copyright" },
  );
  await ensure(
    "Setting: maintenance mode",
    "/settings",
    { key: "maintenance_mode", value: "false", status: false },
    { key: "maintenance_mode" },
  );

  console.log("\nRoutines");
  await ensure(
    "Class routine",
    "/routines/class",
    {
      departmentId, courseId, teacherId: 1, buildingId, roomId,
      timeSlotId, batchId, sectionId,
      day: "SUNDAY", studentRange: "1-40", status: true,
    },
    null,
  );

  if (examId) {
    await ensure(
      "Exam routine",
      "/routines/exam",
      {
        departmentId, courseId, examId, buildingId, roomId,
        timeSlotId, batchId, sectionId,
        date: "2027-03-18", studentRange: "1-40", status: true,
      },
      null,
    );
  }

  // ---- summary --------------------------------------------------------
  console.log("\n" + "─".repeat(52));
  console.log(`created: ${created.length}   already existed: ${skipped.length}   failed: ${failed.length}`);
  if (failed.length) {
    console.log("\nFailures:");
    for (const f of failed) console.log(`  ${f.label} — ${f.status} ${f.message ?? ""}`);
    process.exitCode = 1;
  }
}

main().catch((err) => {
  console.error("\nSeed aborted:", err.message);
  process.exit(1);
});
