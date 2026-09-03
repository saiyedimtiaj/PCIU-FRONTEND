
import { getHeroSlides } from "@/lib/api/home";
import { iconMap } from "@/lib/icons";
import HeroCarousel from "./HeroCarousel";
import heroContent from "@/content/home/hero.json";
import type { HeroContent } from "@/types/home";

export default async function HeroSection() {
  const slides = await getHeroSlides();
  const { stats } = heroContent as HeroContent;

  if (slides.length === 0) {
    return (
      <section
        className="relative w-full h-[60vh] sm:h-[70vh] flex items-center justify-center bg-primary"
        id="home"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-3">
            Welcome to PCIU
          </h1>
          <p className="text-white/80 text-sm sm:text-base">
            Where the Bay Meets Brilliance
          </p>
        </div>
      </section>
    );
  }

  return (
    <section
      className="relative w-full h-[70vh] sm:h-[80vh] md:h-[85vh] lg:h-[90vh] overflow-hidden"
      id="home"
    >
      <HeroCarousel slides={slides} />

      {stats?.length > 0 && (
        <div className="absolute bottom-0 left-0 right-0 z-20 bg-primary/90 backdrop-blur-sm">
          <div className="container mx-auto px-4 sm:px-6 md:px-12 py-3 sm:py-4 grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 text-white text-center">
            {stats.map((stat) => {
              const Icon = iconMap[stat.icon];
              return (
                <div key={stat.label} className="flex flex-col items-center gap-1">
                  {Icon && <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-accent" />}
                  <span className="text-lg sm:text-2xl md:text-3xl font-bold">
                    {stat.value}
                  </span>
                  <span className="text-[10px] sm:text-xs md:text-sm text-white/80">
                    {stat.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </section>
  );
}