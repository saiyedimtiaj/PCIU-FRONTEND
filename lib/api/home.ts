// import type { ApiResponse, HeroSliderItem } from "@/types/home";
import type {
  ApiResponse,
  FacultyItem,
  GalleryApiItem,
  GalleryItem,
  HeroSliderItem,
  KeyPerson,
  KeyPersonApiItem,
  NoticeItem,
  VCInfo,
  PageSettingItem,
  StatItem,
} from "@/types/home";
import type { PublicProgramItem, ActiveAdmissionSchedule } from "@/types/admission-apply";
import { cache } from "react";
import { resolveUploadUrl } from "@/lib/upload-url";
import { publicFetch } from "@/lib/server-fetch";
import { getMediaUrl } from "@/lib/utils/media";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

//**------ HeroSliderItem ------------------ */
export async function getHeroSlides(): Promise<HeroSliderItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/sliders`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Hero sliders request failed: ${res.status}`);
      return [];
    }

    const json: ApiResponse<HeroSliderItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      return [];
    }

    return json.data
      .filter((slide) => slide.isActive && slide.image)
      .sort((a, b) => a.sortOrder - b.sortOrder);
  } catch (error) {
    console.error("Error fetching hero slides:", error);
    return [];
  }
}

//**------NoticeItem------------------ */
export async function getHomeNotices(): Promise<NoticeItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/notices`, {
      next: { revalidate: 180 }, // 3 min — timely academic notices
    });

    if (!res.ok) {
      console.error(`Home notices request failed: ${res.status}`);
      return [];
    }

    const json: ApiResponse<NoticeItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      console.error("Home notices response was unsuccessful or invalid");
      return [];
    }

    return json.data
      .filter(
        (notice) =>
          notice.isActive === true &&
          notice.isHome === true &&
          typeof notice.title === "string" &&
          notice.title.trim().length > 0,
      )
      .sort((a, b) => {
        const firstOrder =
          typeof a.sortOrder === "number" && Number.isFinite(a.sortOrder)
            ? a.sortOrder
            : 0;
        const secondOrder =
          typeof b.sortOrder === "number" && Number.isFinite(b.sortOrder)
            ? b.sortOrder
            : 0;
        return firstOrder - secondOrder;
      });
  } catch (error) {
    console.error("Error fetching home notices:", error);
    return [];
  }
}

/** --------- VC info---------- */
export async function getVCInfo(): Promise<VCInfo | null> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/vc`, {
      next: { revalidate: 3600 }, // 1 hour — VC info rarely changes
    });

    if (!res.ok) {
      console.error(`VC info request failed: ${res.status}`);
      return null;
    }

    const json: ApiResponse<VCInfo> = await res.json();

    if (!json.success || !json.data) {
      return null;
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching VC info:", error);
    return null;
  }
}

/** --------- FacultyItem---------- */
export const getFaculties = cache(async function getFaculties(): Promise<
  FacultyItem[]
> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/faculties`, {
      cache: "no-store",
    });

    if (!res.ok) {
      console.error(`Faculties request failed: ${res.status}`);
      return [];
    }

    const payload: ApiResponse<FacultyItem[]> | FacultyItem[] =
      await res.json();

    if (Array.isArray(payload)) {
      return payload;
    }

    if (!payload.success || !Array.isArray(payload.data)) {
      return [];
    }

    return payload.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
    return [];
  }
});

/** --------- Photo gallery ---------- */
export async function getHomeGallery(): Promise<GalleryItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/gallery/life-at-pciu`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Home gallery request failed: ${res.status}`);
      return [];
    }

    const payload: unknown = await res.json();
    const records = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && "data" in payload
        ? Array.isArray(payload.data)
          ? payload.data
          : payload.data
            ? [payload.data]
            : []
        : payload
          ? [payload]
          : [];

    return (records as GalleryApiItem[])
      .filter((item) => item.status && item.imageUrl)
      .map((item) => ({
        src: resolveUploadUrl(item.imageUrl),
        title: item.title,
        category: item.types ?? "Campus",
        story: item.subtitle ?? "",
      }));
  } catch (error) {
    console.error("Error fetching home gallery:", error);
    return [];
  }
}

/** --------- Campus life gallery ---------- */
export async function getCampusGallery(): Promise<GalleryItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/gallery/campus`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Campus gallery request failed: ${res.status}`);
      return [];
    }

    const payload: unknown = await res.json();
    const records = Array.isArray(payload)
      ? payload
      : payload && typeof payload === "object" && "data" in payload
        ? Array.isArray(payload.data)
          ? payload.data
          : payload.data
            ? [payload.data]
            : []
        : payload
          ? [payload]
          : [];

    return (records as GalleryApiItem[])
      .filter((item) => item.status && item.imageUrl)
      .map((item) => ({
        src: resolveUploadUrl(item.imageUrl),
        title: item.title,
        category: item.types ?? "Campus",
        story: item.subtitle ?? "",
      }));
  } catch (error) {
    console.error("Error fetching campus gallery:", error);
    return [];
  }
}

/** --------- Starts.tsx---------- */

// Whitelist: only these known categories render as stats.
// Prevents unrelated homepage settings (from this generic
// /home/settings/page/home endpoint) from leaking in as fake stat cards.
const STAT_KEY_PATTERNS = [/student/i, /program/i, /alumni/i, /faculty/i];

export async function getStats(): Promise<StatItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/settings/page/home`, {
      next: { revalidate: 1800 },
    });

    if (!res.ok) {
      // 404 means no "home" page/settings have been configured in the
      // backend yet — an expected empty state, not a failure worth
      // surfacing as a console error.
      if (res.status !== 404) {
        console.error(`Home settings request failed: ${res.status}`);
      }
      return [];
    }

    const json: ApiResponse<PageSettingItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      return [];
    }

    return json.data
      .filter(
        (item) =>
          item.status &&
          STAT_KEY_PATTERNS.some((pattern) => pattern.test(item.key)),
      )
      .map((item) => ({
        id: item.id,
        key: item.key,
        label: item.key.replace(/^home\s+/i, "").trim(),
        value: item.value,
      }));
  } catch (error) {
    console.error("Error fetching stats:", error);
    return [];
  }
}

export async function getPrograms(): Promise<PublicProgramItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/programs`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Programs request failed: ${res.status}`);
      return [];
    }

    const json: ApiResponse<PublicProgramItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      return [];
    }

    return json.data.filter((program) => program.status);
  } catch (error) {
    console.error("Error fetching programs:", error);
    return [];
  }
}


function pickSchedule(data: unknown): unknown {
  if (!data || typeof data !== "object" || "semesterName" in data) return data;
  for (const group of Object.values(data as Record<string, unknown>)) {
    const row = Array.isArray(group) ? group[0] : group;
    if (row && typeof row === "object" && "semesterName" in row) return row;
  }
  return null;
}

export async function getActiveAdmissionSchedule(): Promise<ActiveAdmissionSchedule | null> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/admission/schedule`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      console.error(`Admission schedule request failed: ${res.status}`);
      return null;
    }

    const json: ApiResponse<unknown> = await res.json();
    const data = pickSchedule(json.data);

    if (
      !json.success ||
      !data ||
      typeof data !== "object" ||
      !("semesterName" in data) ||
      typeof (data as { semesterName?: unknown }).semesterName !== "string"
    ) {
      return null;
    }

    return data as ActiveAdmissionSchedule;
  } catch (error) {
    console.error("Error fetching admission schedule:", error);
    return null;
  }
}

/** --------- Research section settings ---------- */
export async function getResearchSettings(): Promise<PageSettingItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/settings/page/Research`, {
      next: { revalidate: 300 },
    });

    if (!res.ok) {
      if (res.status !== 404) {
        console.error(`Research settings request failed: ${res.status}`);
      }
      return [];
    }

    const json: ApiResponse<PageSettingItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      console.error("Research settings response was unsuccessful or invalid");
      return [];
    }

    return json.data.filter((item) => item.status);
  } catch (error) {
    console.error("Error fetching research settings:", error);
    return [];
  }
}

/** --------- Key persons ---------- */

function cleanText(value: string | null | undefined): string | null {
  const text = value?.trim();
  return text ? text : null;
}

/** "member" → "Member", "member secretary" → "Member Secretary". */
function titleCase(value: string): string {
  return value.replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * A `designation` reads as a statement (worth quoting) rather than a title
 * like "Dean" when it is sentence-length or contains sentence punctuation.
 */
function isStatement(text: string): boolean {
  return text.length > 60 || /[.!?;:]\s/.test(text);
}

/**
 * Active key persons from `GET /home/keypersons`, sorted by `sortorder`.
 * Cached under the "management" tag, which admin management saves already
 * expire (see app/(admin)/academics-cache.ts). `error` is true when the
 * request failed, so the section can tell "no one listed" from "unreachable".
 */
export const getKeyPersons = cache(async function getKeyPersons(): Promise<{
  persons: KeyPerson[];
  error: boolean;
}> {
  try {
    const res = await publicFetch.get("/home/keypersons", {
      next: { revalidate: 300, tags: ["management"] },
    });

    if (!res.ok) {
      console.error(`Key persons request failed: ${res.status}`);
      return { persons: [], error: true };
    }

    const json: ApiResponse<KeyPersonApiItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      return { persons: [], error: true };
    }

    const persons = json.data
      .filter((item) => item.status === true && item.iskeyperson === true)
      .sort(
        (a, b) =>
          (a.sortorder ?? Number.MAX_SAFE_INTEGER) -
          (b.sortorder ?? Number.MAX_SAFE_INTEGER),
      )
      .map((item): KeyPerson => {
        const designation = cleanText(item.designation);
        const role = cleanText(item.managementRole);
        return {
          id: item.id,
          name: cleanText(item.name),
          role: role ? titleCase(role) : null,
          typeName: cleanText(item.type?.name),
          typeDescription: cleanText(item.type?.description),
          designation,
          designationIsStatement: designation ? isStatement(designation) : false,
          imageUrl: getMediaUrl(cleanText(item.img)),
        };
      });

    return { persons, error: false };
  } catch (error) {
    console.error("Error fetching key persons:", error);
    return { persons: [], error: true };
  }
});
