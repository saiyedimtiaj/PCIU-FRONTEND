"use client";

import * as React from "react";
import Link from "next/link";
import { ExternalLink } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { getInitials } from "@/lib/utils";
import { getMediaUrl } from "@/lib/utils/media";
import type { DepartmentContent } from "@/types/department";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function FacultyCarousel({
  members,
}: {
  members: DepartmentContent["facultyMembers"];
}) {
  const [plugin] = React.useState(() =>
    Autoplay({ delay: 3000, stopOnInteraction: true }),
  );

  return (
    <Carousel
      plugins={[plugin]}
      className="w-full max-w-full relative"
      onMouseEnter={plugin.stop}
      onMouseLeave={plugin.reset}
      opts={{
        align: "start",
        loop: true,
      }}
    >
      <CarouselContent className="-ml-4 pb-4">
        {members.map((member) => (
          <CarouselItem
            key={member.slug || member.name}
            className="pl-4 basis-[80%] sm:basis-[60%] md:basis-1/2 lg:basis-1/3 xl:basis-1/4"
          >
            <Link
              href={`/faculty/${member.id}`}
              className="group relative block aspect-3/4 w-full rounded-lg overflow-hidden shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-[0_20px_40px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-500"
            >
              <Avatar className="size-full rounded-none after:rounded-none after:hidden">
                <AvatarImage
                  src={getMediaUrl(member.imageUrl) || ""}
                  className="rounded-none object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <AvatarFallback className="rounded-none bg-slate-100 text-5xl font-bold font-heading text-slate-300">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-linear-to-t from-[#0f172a] via-[#0f172a]/40 to-transparent opacity-80 group-hover:opacity-95 transition-opacity duration-500" />

              {/* Content */}
              <div className="absolute bottom-0 left-0 w-full p-6 flex flex-col justify-end text-left z-10">
                <h3 className="font-bold font-heading text-white text-xl leading-tight mb-1.5 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                  {member.name}
                </h3>
                <p className="text-sm font-semibold text-white/90 mb-2 line-clamp-1">
                  {member.designation}
                </p>

                <div className="flex items-center gap-1.5 text-xs font-bold text-[#0ea5e9] opacity-0 translate-y-3 group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-300">
                  View Profile <ExternalLink className="w-3.5 h-3.5" />
                </div>
              </div>
            </Link>
          </CarouselItem>
        ))}
      </CarouselContent>
      <div className="hidden sm:block">
        <CarouselPrevious className="-left-4 lg:-left-6 border-slate-200 bg-white/80 hover:bg-white text-slate-700 shadow-sm" />
        <CarouselNext className="-right-4 lg:-right-6 border-slate-200 bg-white/80 hover:bg-white text-slate-700 shadow-sm" />
      </div>
    </Carousel>
  );
}
