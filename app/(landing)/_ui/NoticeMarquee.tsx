// "use client";

// import { useState } from "react";
// import { X } from "lucide-react";
// import Link from "next/link";
// import { Badge } from "@/components/ui/badge";
// import { iconMap } from "@/lib/icons";
// import noticesData from "@/content/home/notices.json";
// import type { Notice } from "@/types/home";

// const notices = noticesData as Notice[];

// export default function NoticeMarquee() {
//   const [isDismissed, setIsDismissed] = useState(false);

//   if (isDismissed) return null;

//   return (
//     <div className="bg-accent text-accent-foreground py-3 relative overflow-hidden">
//       <div className="container mx-auto px-4">
//         <div className="flex items-center gap-4">
//           <Link
//             href="/notices"
//             className="font-semibold text-sm uppercase tracking-wide whitespace-nowrap hover:underline"
//           >
//             Notices
//           </Link>
//           <div className="flex-1 overflow-hidden">
//             <div className="flex items-center gap-8 animate-slide-in">
//               {notices.map((notice) => {
//                 const Icon = iconMap[notice.icon];
//                 return (
//                   <div key={notice.text} className="flex items-center gap-2 whitespace-nowrap">
//                     <Badge
//                       variant="outline"
//                       className="border-white/30 bg-white/10 text-white font-medium"
//                     >
//                       {notice.type}
//                     </Badge>
//                     <Icon className="w-4 h-4" />
//                     <span className="text-sm">{notice.text}</span>
//                   </div>
//                 );
//               })}
//             </div>
//           </div>
//           <button
//             onClick={() => setIsDismissed(true)}
//             className="p-1 hover:bg-white/10 rounded transition-colors"
//             aria-label="Dismiss notices"
//           >
//             <X className="w-4 h-4" />
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

import { getHomeNotices } from "@/lib/api/home";
import NoticeMarqueeClient from "./NoticeMarqueeClient";

export default async function NoticeMarquee() {
  const notices = await getHomeNotices();

  if (notices.length === 0) return null;

  return <NoticeMarqueeClient notices={notices} />;
}