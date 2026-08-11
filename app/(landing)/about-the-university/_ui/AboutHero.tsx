import Image from "next/image";
import { Building2 } from "lucide-react";
import heroData from "@/content/about/hero.json";
import type { AboutHeroContent } from "@/types/about";

const hero = heroData as AboutHeroContent;

export default function AboutHero() {
  return (
    <section className="relative h-[50vh] md:h-[65vh] overflow-hidden">
      <Image
        src={hero.image}
        alt="Port City International University Main Campus"
        fill
        preload
        sizes="100vw"
        className="object-cover scale-105"
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
          <div className="inline-flex items-center gap-2 bg-accent/90 text-accent-foreground text-xs font-bold uppercase tracking-[0.2em] px-5 py-2 rounded-full mb-6 backdrop-blur-sm">
            <Building2 className="w-3.5 h-3.5" />
            {hero.badge}
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-extrabold text-white leading-[1.1] max-w-4xl mx-auto">
            {hero.title} <span className="text-accent">{hero.titleAccent}</span>
          </h1>
          <p className="mt-4 text-lg md:text-xl text-white/80 max-w-2xl mx-auto font-light">
            {hero.subtitle}
          </p>
        </div>
      </div>

      {/* Bottom wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 60" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full">
          <path d="M0 60V20C240 45 480 5 720 20C960 35 1200 0 1440 20V60H0Z" className="fill-background" />
        </svg>
      </div>
    </section>
  );
}
