import { getHeroSlides } from "@/lib/api/home";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  const slides = await getHeroSlides();

  if (slides.length === 0) {
    return (
      <section
        className="relative w-full h-[50vh] sm:h-[55vh] min-h-[380px] flex items-center justify-center bg-primary"
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
      className="relative w-full h-[50vh] sm:h-[55vh] md:h-[58vh] lg:h-[62vh] min-h-[340px] sm:min-h-[380px] md:min-h-[420px] lg:min-h-[460px] max-h-[560px] overflow-hidden"
      id="home"
    >
      <HeroCarousel slides={slides} />
    </section>
  );
}
