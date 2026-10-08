import Image from "next/image";
import { Quote } from "lucide-react";
import type { AboutUniversity } from "@/types/about";

export default function CampusBanner({ about }: { about: AboutUniversity }) {
  return (
    <section className="relative overflow-hidden">
      <Image
        src={about.bottomBannerImage}
        alt="PCIU Campus Life"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-linear-to-r from-primary/95 via-primary/85 to-primary/70" />

      <div className="container relative mx-auto px-4 py-14 sm:py-20 md:py-24">
        <figure className="reveal mx-auto max-w-3xl text-center">
          <span className="mx-auto mb-5 flex h-12 w-12 items-center justify-center rounded-full bg-white/10 ring-1 ring-white/20 sm:mb-6 sm:h-14 sm:w-14">
            <Quote aria-hidden className="h-5 w-5 fill-accent text-accent sm:h-6 sm:w-6" />
          </span>
          <blockquote className="font-heading text-lg font-bold leading-relaxed text-white sm:text-2xl md:text-3xl md:leading-snug">
            {about.bottomBannerText}
          </blockquote>
          <div className="mt-6 flex items-center justify-center gap-2">
            <span className="h-1 w-3 rounded-full bg-accent" />
            <span className="h-1 w-12 rounded-full bg-white/60" />
            <span className="h-1 w-3 rounded-full bg-accent" />
          </div>
        </figure>
      </div>
    </section>
  );
}
