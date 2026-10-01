export type PopupType = "VIDEO" | "TEXT";

export interface Popup {
  id: number;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  link: string;
  status: boolean;
  type: PopupType;
  createdAt: string;
  updatedAt: string;
  videoUrl?: string | null;
  mediaUrl?: string | null;
}

export interface PopupApiResponse {
  statusCode: number;
  success: boolean;
  message: string;
  data: Popup[];
}
