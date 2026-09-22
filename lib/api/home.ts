// import type { ApiResponse, HeroSliderItem } from "@/types/home";
import type {
  ApiResponse,
  FacultyItem,
  HeroSliderItem,
  NoticeItem,
  VCInfo,
  PageSettingItem,
  StatItem,
} from "@/types/home";

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
      return [];
    }

    return json.data
      .filter((notice) => notice.isActive && notice.isHome)
      .sort((a, b) => a.sortOrder - b.sortOrder);
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
export async function getFaculties(): Promise<FacultyItem[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/faculties`, {
      next: { revalidate: 3600 }, // 1 hour — faculty structure rarely changes
    });

    if (!res.ok) {
      console.error(`Faculties request failed: ${res.status}`);
      return [];
    }

    const json: ApiResponse<FacultyItem[]> = await res.json();

    if (!json.success || !Array.isArray(json.data)) {
      return [];
    }

    return json.data;
  } catch (error) {
    console.error("Error fetching faculties:", error);
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

/** --------- VC info---------- */
