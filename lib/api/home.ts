// import type { ApiResponse, HeroSliderItem } from "@/types/home";
import type { ApiResponse, HeroSliderItem, NoticeItem } from "@/types/home";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

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


