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

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null;
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
