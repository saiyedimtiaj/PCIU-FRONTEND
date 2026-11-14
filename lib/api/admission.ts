import envConfig from "@/config/env.config";
import { publicFetch } from "@/lib/server-fetch";

export interface AdmissionAdvertisementData {
  id: number;
  semesterName: string;
  year: number;
  imageUrl: string | null;
  isActive: boolean;
}

export type AdmissionAdvertisementResult =
  | { status: "success"; data: AdmissionAdvertisementData }
  | { status: "empty" }
  | { status: "error" };

export type AdmissionProgramLevel = "Graduate" | "Undergraduate";

export interface AdmissionScheduleData {
  id: number;
  semesterName: string;
  year: number;
  programLevel: AdmissionProgramLevel;
  applicationStartDate: string | null;
  directAdmissionDeadline: string | null;
  writtenApplicationDeadline: string | null;
  writtenTestDate: string | null;
  testResultDate: string | null;
  admissionWindowStart: string | null;
  admissionWindowEnd: string | null;
  courseRegistrationStart: string | null;
  courseRegistrationEnd: string | null;
  classStartDate: string | null;
  orientationDate: string | null;
  isActive: boolean;
}

export type AdmissionSchedules = Record<
  AdmissionProgramLevel,
  AdmissionScheduleData[]
>;

export type AdmissionScheduleResult =
  | { status: "success"; data: AdmissionSchedules }
  | { status: "empty" }
  | { status: "error" };

export interface MbaEligibilityData {
  id: number;
  academicBackground: string;
  creditsRequired: string;
  perCreditFeeBDT: string;
  totalFeeBDT: string;
}

export interface AdmissionFeeStructureData {
  id: number;
  admissionFeeBDT: string;
  admissionFormFeeBDT: string;
}

type ApiDataResult<T> =
  | { status: "success"; data: T }
  | { status: "empty" }
  | { status: "error" };

export type ProgramType = "UNDERGRADUATE" | "GRADUATE";

export interface ProgramTuitionFeeData {
  id: number;
  program: string;
  programType: ProgramType;
  departmentName: string | null;
  credit: string;
  perCreditAmount: string;
  totalFees: string;
}

export type ProgramTuitionFees = Record<ProgramType, ProgramTuitionFeeData[]>;

export type MbaEligibilityResult = ApiDataResult<MbaEligibilityData[]>;
export type ProgramTuitionFeesResult = ApiDataResult<ProgramTuitionFees>;
export type AdmissionFeeStructureResult =
  ApiDataResult<AdmissionFeeStructureData>;

export interface AdmissionTestResultData {
  id: number;
  semesterName: string;
  year: number;
  pdfUrl: string | null;
  publishedAt: string | null;
  isActive: boolean;
}

export type AdmissionTestResultResponse =
  ApiDataResult<AdmissionTestResultData>;

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
}

function normalizeAmount(value: unknown): string | null {
  if (typeof value !== "string" && typeof value !== "number") return null;
  const amount = String(value).trim();
  if (!amount || !/^\d+(?:\.\d+)?$/.test(amount)) return null;
  return amount;
}

function unwrapApiData(payload: unknown): unknown {
  if (!isRecord(payload)) return payload;
  if (payload.success === false) {
    throw new Error(
      typeof payload.message === "string"
        ? payload.message
        : "The API reported an unsuccessful response.",
    );
  }
  return "data" in payload ? payload.data : payload;
}

function parseMbaEligibility(value: unknown): MbaEligibilityData[] | null {
  const entries = Array.isArray(value) ? value : [value];
  if (entries.length === 0) return [];

  const parsedEntries: MbaEligibilityData[] = [];
  for (const entry of entries) {
    const parsed = parseMbaEligibilityEntry(entry);
    if (!parsed) return null;
    parsedEntries.push(parsed);
  }
  return parsedEntries;
}

function parseMbaEligibilityEntry(value: unknown): MbaEligibilityData | null {
  if (!isRecord(value)) return null;
  const { id, academicBackground } = value;
  const creditsRequired = normalizeAmount(value.creditsRequired);
  const perCreditFeeBDT = normalizeAmount(value.perCreditFeeBDT);
  const totalFeeBDT = normalizeAmount(value.totalFeeBDT);

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof academicBackground !== "string" ||
    !academicBackground.trim() ||
    !creditsRequired ||
    !perCreditFeeBDT ||
    !totalFeeBDT
  ) {
    return null;
  }

  return {
    id,
    academicBackground: academicBackground.trim(),
    creditsRequired,
    perCreditFeeBDT,
    totalFeeBDT,
  };
}

function parseProgramTuitionFees(value: unknown): ProgramTuitionFees | null {
  if (!Array.isArray(value)) return null;

  const fees: ProgramTuitionFees = { UNDERGRADUATE: [], GRADUATE: [] };
  for (const entry of value) {
    const parsed = parseProgramTuitionFeeEntry(entry);
    if (!parsed) {
      console.error("[Admission] Invalid program tuition fee entry.", entry);
      continue;
    }
    fees[parsed.programType].push(parsed);
  }
  return fees;
}

function parseProgramTuitionFeeEntry(
  value: unknown,
): ProgramTuitionFeeData | null {
  if (!isRecord(value)) return null;
  const { id, program, programType, departmentName } = value;
  const credit = normalizeAmount(value.credit);
  const perCreditAmount = normalizeAmount(value.perCreditAmount);
  const totalFees = normalizeAmount(value.totalFees);

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof program !== "string" ||
    !program.trim() ||
    (programType !== "UNDERGRADUATE" && programType !== "GRADUATE") ||
    !credit ||
    !perCreditAmount ||
    !totalFees
  ) {
    return null;
  }

  return {
    id,
    program: program.trim(),
    programType,
    departmentName:
      typeof departmentName === "string" ? departmentName.trim() || null : null,
    credit,
    perCreditAmount,
    totalFees,
  };
}

function parseAdmissionFeeStructure(
  value: unknown,
): AdmissionFeeStructureData | null {
  if (!isRecord(value)) return null;
  const { id } = value;
  const admissionFeeBDT = normalizeAmount(value.admissionFeeBDT);
  const admissionFormFeeBDT = normalizeAmount(value.admissionFormFeeBDT);

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    !admissionFeeBDT ||
    !admissionFormFeeBDT
  ) {
    return null;
  }

  return { id, admissionFeeBDT, admissionFormFeeBDT };
}

function parseAdmissionTestResult(
  value: unknown,
): AdmissionTestResultData | null {
  if (!isRecord(value)) return null;
  const { id, semesterName, year, isActive } = value;
  const pdfUrl = value.pdfUrl;
  const publishedAt = value.publishedAt;

  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof semesterName !== "string" ||
    !semesterName.trim() ||
    typeof year !== "number" ||
    !Number.isInteger(year) ||
    (pdfUrl !== null && pdfUrl !== undefined && typeof pdfUrl !== "string") ||
    (publishedAt !== null &&
      publishedAt !== undefined &&
      typeof publishedAt !== "string") ||
    typeof isActive !== "boolean"
  ) {
    return null;
  }

  return {
    id,
    semesterName: semesterName.trim(),
    year,
    pdfUrl: typeof pdfUrl === "string" ? pdfUrl.trim() || null : null,
    publishedAt:
      typeof publishedAt === "string" ? publishedAt.trim() || null : null,
    isActive,
  };
}

async function fetchAdmissionData<T>(
  endpoint: string,
  label: string,
  parse: (data: unknown) => T | null,
): Promise<ApiDataResult<T>> {
  if (!envConfig.backend_base_url) {
    console.error(
      "[Admission] NEXT_PUBLIC_BACKEND_BASE_URL is not configured.",
    );
    return { status: "error" };
  }

  try {
    const response = await publicFetch.get(endpoint, {
      next: { revalidate: 300, tags: [`admission-${label}`] },
    });
    if (!response.ok) {
      throw new Error(`${label} request failed (${response.status}).`);
    }

    const data = unwrapApiData(await response.json());
    if (data === null || data === undefined) return { status: "empty" };

    const parsed = parse(data);
    if (!parsed) throw new Error(`${label} response had an invalid shape.`);
    return { status: "success", data: parsed };
  } catch (error) {
    console.error(`[Admission] Failed to load ${label}.`, error);
    return { status: "error" };
  }
}

export function getMbaEligibility(): Promise<MbaEligibilityResult> {
  return fetchAdmissionData(
    "/admission/mba-eligibility",
    "MBA eligibility fees",
    parseMbaEligibility,
  );
}

export function getProgramTuitionFees(): Promise<ProgramTuitionFeesResult> {
  return fetchAdmissionData(
    "/admission/tuitionfees",
    "program tuition fees",
    parseProgramTuitionFees,
  );
}

export function getAdmissionFeeStructure(): Promise<AdmissionFeeStructureResult> {
  return fetchAdmissionData(
    "/admission/fee-structure",
    "other admission fees",
    parseAdmissionFeeStructure,
  );
}

export function getAdmissionTestResult(): Promise<AdmissionTestResultResponse> {
  return fetchAdmissionData(
    "/admission/test-result",
    "admission test result",
    parseAdmissionTestResult,
  );
}

const SCHEDULE_DATE_FIELDS = [
  "applicationStartDate",
  "directAdmissionDeadline",
  "writtenApplicationDeadline",
  "writtenTestDate",
  "testResultDate",
  "admissionWindowStart",
  "admissionWindowEnd",
  "courseRegistrationStart",
  "courseRegistrationEnd",
  "classStartDate",
  "orientationDate",
] as const;

type ScheduleDateField = (typeof SCHEDULE_DATE_FIELDS)[number];

function parseSchedule(
  value: unknown,
  programLevel: AdmissionProgramLevel,
): AdmissionScheduleData | null {
  if (!isRecord(value)) return null;

  const { id, semesterName, year, isActive } = value;
  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof semesterName !== "string" ||
    !semesterName.trim() ||
    typeof year !== "number" ||
    !Number.isInteger(year) ||
    typeof isActive !== "boolean"
  ) {
    return null;
  }

  const dates: Record<ScheduleDateField, string | null> = {
    applicationStartDate: null,
    directAdmissionDeadline: null,
    writtenApplicationDeadline: null,
    writtenTestDate: null,
    testResultDate: null,
    admissionWindowStart: null,
    admissionWindowEnd: null,
    courseRegistrationStart: null,
    courseRegistrationEnd: null,
    classStartDate: null,
    orientationDate: null,
  };
  for (const field of SCHEDULE_DATE_FIELDS) {
    const date = value[field];
    if (date !== undefined && date !== null && typeof date !== "string") {
      return null;
    }
    dates[field] = typeof date === "string" ? date.trim() || null : null;
  }

  return {
    id,
    semesterName: semesterName.trim(),
    year,
    programLevel,
    ...dates,
    isActive,
  };
}

function parseAdvertisement(value: unknown): AdmissionAdvertisementData | null {
  if (!isRecord(value)) return null;

  const { id, semesterName, year, imageUrl, isActive } = value;
  if (
    typeof id !== "number" ||
    !Number.isInteger(id) ||
    typeof semesterName !== "string" ||
    !semesterName.trim() ||
    typeof year !== "number" ||
    !Number.isInteger(year) ||
    (imageUrl !== null && typeof imageUrl !== "string") ||
    typeof isActive !== "boolean"
  ) {
    return null;
  }

  return {
    id,
    semesterName: semesterName.trim(),
    year,
    imageUrl: typeof imageUrl === "string" ? imageUrl.trim() || null : null,
    isActive,
  };
}

export async function getAdmissionSchedules(): Promise<AdmissionScheduleResult> {
  if (!envConfig.backend_base_url) {
    console.error(
      "[Admission] NEXT_PUBLIC_BACKEND_BASE_URL is not configured.",
    );
    return { status: "error" };
  }

  try {
    const response = await publicFetch.get("/admission/schedule", {
      next: { revalidate: 300, tags: ["admission-schedule"] },
    });

    if (!response.ok) {
      throw new Error(`Admission schedules request failed (${response.status}).`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || payload.success !== true) {
      throw new Error("Admission schedules response was unsuccessful.");
    }

    if (payload.data === null || payload.data === undefined) {
      return { status: "empty" };
    }
    if (!isRecord(payload.data)) {
      throw new Error("Admission schedules response had an invalid shape.");
    }

    const levels: AdmissionProgramLevel[] = ["Graduate", "Undergraduate"];
    const schedules = {} as AdmissionSchedules;

    for (const level of levels) {
      const entries = payload.data[level];
      if (entries === undefined || entries === null) {
        schedules[level] = [];
        continue;
      }
      if (!Array.isArray(entries)) {
        throw new Error(`Admission schedules for ${level} were invalid.`);
      }

      schedules[level] = entries.flatMap((entry) => {
        const schedule = parseSchedule(entry, level);
        if (!schedule) {
          console.error(`[Admission] Invalid ${level} schedule entry.`, entry);
          return [];
        }
        return [schedule];
      });
    }

    if (!schedules.Graduate.length && !schedules.Undergraduate.length) {
      return { status: "empty" };
    }

    return { status: "success", data: schedules };
  } catch (error) {
    console.error("[Admission] Failed to load admission schedules.", error);
    return { status: "error" };
  }
}

export async function getAdmissionAdvertisement(): Promise<AdmissionAdvertisementResult> {
  if (!envConfig.backend_base_url) {
    console.error(
      "[Admission] NEXT_PUBLIC_BACKEND_BASE_URL is not configured.",
    );
    return { status: "error" };
  }

  try {
    const response = await publicFetch.get("/admission/advertisement", {
      next: { revalidate: 300, tags: ["admission-advertisement"] },
    });

    if (!response.ok) {
      throw new Error(`Admission advertisement request failed (${response.status}).`);
    }

    const payload: unknown = await response.json();
    if (!isRecord(payload) || payload.success !== true) {
      throw new Error("Admission advertisement response was unsuccessful.");
    }

    if (payload.data === null || payload.data === undefined) {
      return { status: "empty" };
    }

    const data = parseAdvertisement(payload.data);
    if (!data) {
      throw new Error("Admission advertisement response had an invalid shape.");
    }

    return { status: "success", data };
  } catch (error) {
    console.error("[Admission] Failed to load admission advertisement.", error);
    return { status: "error" };
  }
}

export interface FaqData {
  id: number;
  type: string;
  question: string;
  answer: string;
  displayOrder: number;
}

export type FaqsResult = ApiDataResult<FaqData[]>;

function parseFaqs(value: unknown): FaqData[] | null {
  if (!Array.isArray(value)) return null;

  const faqs: FaqData[] = [];
  for (const entry of value) {
    if (!isRecord(entry)) continue;
    const { id, type, question, answer, displayOrder, isActive } = entry;
    if (
      typeof id !== "number" ||
      !Number.isInteger(id) ||
      typeof question !== "string" ||
      !question.trim() ||
      typeof answer !== "string" ||
      !answer.trim()
    ) {
      console.error("[Admission] Invalid FAQ entry.", entry);
      continue;
    }
    if (isActive === false) continue;

    faqs.push({
      id,
      type:
        typeof type === "string" && type.trim()
          ? type.trim().toLowerCase()
          : "others",
      question: question.trim(),
      answer: answer.trim(),
      displayOrder:
        typeof displayOrder === "number" && Number.isFinite(displayOrder)
          ? displayOrder
          : Number.MAX_SAFE_INTEGER,
    });
  }

  return faqs.sort((a, b) => a.displayOrder - b.displayOrder || a.id - b.id);
}

export async function getFaqs(): Promise<FaqsResult> {
  const result = await fetchAdmissionData("/home/faqs", "faqs", parseFaqs);
  if (result.status === "success" && result.data.length === 0) {
    return { status: "empty" };
  }
  return result;
}
