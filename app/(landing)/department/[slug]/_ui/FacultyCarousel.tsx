"use client";

import * as React from "react";
import Link from "next/link";
import Image from "next/image";
import { ExternalLink, User2 } from "lucide-react";
import Autoplay from "embla-carousel-autoplay";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { getMediaUrl } from "@/lib/utils/media";
import { getInitials } from "@/lib/utils";
import type { DepartmentContent } from "@/types/department";

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
              className="h-full bg-white border border-slate-200 rounded-xl p-6 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group flex flex-col items-center text-center relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 w-full h-1 bg-[#0ea5e9] transform origin-left scale-x-0 group-hover:scale-x-100 transition-transform duration-300" />

              <Avatar className="w-24 h-24 mb-5 border-4 border-white shadow-sm shrink-0 font-heading text-slate-500 bg-slate-100 flex items-center justify-center group-hover:bg-[#0ea5e9]/10 transition-colors">
                <AvatarImage
                  src={getMediaUrl(member.imageUrl) || ""}
                  alt={member.name}
                  className="object-cover"
                />
                <AvatarFallback className="bg-transparent text-3xl font-bold group-hover:text-[#0ea5e9] transition-colors">
                  {getInitials(member.name)}
                </AvatarFallback>
              </Avatar>

              <h3 className="font-bold text-[#1e3a8a] text-[17px] leading-tight mb-2 group-hover:text-[#0ea5e9] transition-colors line-clamp-2">
                {member.name}
              </h3>

              <p className="text-[13px] font-semibold text-slate-600 mb-3 line-clamp-2 px-2">
                {member.designation}
              </p>

              <div className="mt-auto w-full flex flex-col items-center">
                {member.specialization && (
                  <p className="text-xs text-muted-foreground line-clamp-2 pt-4 border-t border-slate-100 w-full">
                    {member.specialization}
                  </p>
                )}

                <div className="mt-4 flex items-center justify-center gap-1 text-xs font-semibold text-[#0ea5e9] opacity-0 group-hover:opacity-100 transition-opacity">
                  View Profile <ExternalLink className="w-3 h-3" />
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
