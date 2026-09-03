
import { getHomeNotices } from "@/lib/api/home";
import NoticeMarqueeClient from "./NoticeMarqueeClient";

export default async function NoticeMarquee() {
  const notices = await getHomeNotices();

  if (notices.length === 0) return null;

  return <NoticeMarqueeClient notices={notices} />;
}