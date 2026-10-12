import Image from "next/image";
import { Building2 } from "lucide-react";
import type { AboutUniversity } from "@/types/about";

export default function AboutHero({ about }: { about: AboutUniversity }) {
  // The last word of the title gets the accent color ("About <PCIU>").
  const words = about.title.trim().split(/\s+/);
  const titleAccent = words.length > 1 ? words.pop() : "";
  const title = words.join(" ");

  return (
    <section className="relative h-[52vh] min-h-[340px] overflow-hidden sm:min-h-[400px] md:h-[60vh] md:max-h-[640px]">
      <Image
        src={about.bannerImage}
        alt="Port City International University Main Campus"
        fill
        preload
        sizes="100vw"
        className="object-cover motion-safe:animate-hero-zoom"
      />
      <div className="absolute inset-0 bg-linear-to-b from-primary/70 via-primary/40 to-primary/90" />
      {/* Decorative grid overlay */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='%23fff' fill-opacity='1'%3E%3Cpath d='M0 0h1v40H0zM39 0h1v40h-1zM0 0h40v1H0zM0 39h40v1H0z'/%3E%3C/g%3E%3C/svg%3E\")",
        }}
      />

      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <div className="mb-5 inline-flex items-center gap-2 rounded-full bg-accent/90 px-4 py-1.5 text-[11px] font-bold uppercase tracking-[0.2em] text-accent-foreground backdrop-blur-sm motion-safe:animate-fade-in-up sm:mb-6 sm:px-5 sm:py-2 sm:text-xs">
            <Building2 className="w-3.5 h-3.5" />
            {about.badge}
          </div>
          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] text-white motion-safe:animate-fade-in-up motion-safe:[animation-delay:120ms] motion-safe:[animation-fill-mode:both] sm:text-5xl md:text-6xl lg:text-7xl">
            {title} <span className="text-accent">{titleAccent}</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-base font-light text-white/85 motion-safe:animate-fade-in-up motion-safe:[animation-delay:240ms] motion-safe:[animation-fill-mode:both] sm:text-lg md:text-xl">
            {about.subtitle}
          </p>
        </div>
      </div>
    </section>
  );
}
