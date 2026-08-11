import Image from "next/image";
import campusBannerData from "@/content/about/campus-banner.json";
import type { CampusBannerContent } from "@/types/about";

const banner = campusBannerData as CampusBannerContent;

export default function CampusBanner() {
  return (
    <section className="relative h-[280px] md:h-[380px] overflow-hidden">
      <Image
        src={banner.image}
        alt="PCIU Campus Life"
        fill
        sizes="100vw"
        className="object-cover"
      />
      <div className="absolute inset-0 bg-primary/70" />
      <div className="absolute inset-0 flex items-center justify-center text-center">
        <div className="container mx-auto px-4">
          <p className="text-xl md:text-3xl font-bold text-white max-w-3xl mx-auto leading-relaxed">
            {banner.quotePrefix} <span className="text-accent">{banner.quoteAccent}</span>{" "}
            {banner.quoteSuffix}
          </p>
        </div>
      </div>
    </section>
  );
}
