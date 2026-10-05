import { getHeroSlides } from "@/lib/api/home";
import HeroCarousel from "./HeroCarousel";

export default async function HeroSection() {
  const slides = await getHeroSlides();

  if (slides.length === 0) {
    return (
      <section
        className="relative w-full h-[300px] sm:h-[300px] min-h-[380px] flex items-center justify-center bg-primary"
        id="home"
      >
        <div className="container mx-auto px-4 sm:px-6 text-center text-white">
          <h1 className="font-heading font-bold text-3xl sm:text-4xl md:text-5xl mb-1">
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
      className="relative  h-[300px] w-full overflow-hidden bg-primary sm:h-[300px] md:h-[350px] lg:h-[380px] xl:h-[380px]"
      id="home"
    >
      <HeroCarousel slides={slides} />
    </section>
  );
}
