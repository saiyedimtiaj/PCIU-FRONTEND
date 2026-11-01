import { cache } from "react";
import type { ApiResponse } from "@/types/home";
import type { HomeMenus, MenuItem } from "@/types/menu";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

const activeOnly = (items: MenuItem[] | undefined): MenuItem[] =>
  (items ?? []).filter((item) => item.isActive && item.name && item.slug);

/**
 * Public navigation menus. Wrapped in React `cache()` so the footer, and any
 * future header/topbar consumer, share one request per render; the fetch
 * itself is cached under the "menus" tag, which admin menu saves expire
 * (academics-cache.ts). Returns null on failure so callers can tell "API
 * down" apart from "admin left this menu empty".
 */
export const getHomeMenus = cache(async (): Promise<HomeMenus | null> => {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return null;
  }

  try {
    const res = await fetch(`${API_BASE_URL}/home/menus`, {
      // Cached: this runs in the public layout on every page.
      next: { revalidate: 300, tags: ["menus"] },
    });

    if (!res.ok) {
      console.error(`Home menus request failed: ${res.status}`);
      return null;
    }

    const json: ApiResponse<Partial<HomeMenus>> = await res.json();
    if (!json.success || !json.data) return null;

    return {
      topHeader: activeOnly(json.data.topHeader),
      header: activeOnly(json.data.header),
      footer_academics: activeOnly(json.data.footer_academics),
      footer_admission: activeOnly(json.data.footer_admission),
    };
  } catch (error) {
    console.error("Error fetching home menus:", error);
    return null;
  }
});
