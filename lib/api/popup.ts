import type { Popup, PopupApiResponse } from "@/types/popup";

const API_BASE_URL = process.env.NEXT_PUBLIC_BACKEND_BASE_URL;

export async function getActivePopups(): Promise<Popup[]> {
  if (!API_BASE_URL) {
    console.error("NEXT_PUBLIC_BACKEND_BASE_URL is not defined");
    return [];
  }

  try {
    const response = await fetch(`${API_BASE_URL}/popup/active`, {
      cache: "no-store",
    });

    if (!response.ok) {
      console.error(`Active popups request failed: ${response.status}`);
      return [];
    }

    const payload: PopupApiResponse = await response.json();
    if (!payload.success || !Array.isArray(payload.data)) return [];

    return payload.data;
  } catch (error) {
    console.error("Error fetching active popups:", error);
    return [];
  }
}
