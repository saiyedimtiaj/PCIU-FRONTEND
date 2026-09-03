// "use client";

// import { useState, useEffect, useCallback } from "react";
// import Image from "next/image";
// import { ChevronLeft, ChevronRight } from "lucide-react";
// import { iconMap } from "@/lib/icons";
// import heroContent from "@/content/home/hero.json";
// import type { HeroContent } from "@/types/home";

// const hero = heroContent as HeroContent;

// export default function HeroSection() {
//   const { slides, stats } = hero;
//   const [current, setCurrent] = useState(0);
//   const [isTransitioning, setIsTransitioning] = useState(false);

//   const goTo = useCallback(
//     (index: number) => {
//       if (isTransitioning) return;
//       setIsTransitioning(true);
//       setCurrent(index);
//       setTimeout(() => setIsTransitioning(false), 700);
//     },
//     [isTransitioning]
//   );

//   const next = useCallback(() => {
//     goTo((current + 1) % slides.length);
//   }, [current, slides.length, goTo]);

//   const prev = useCallback(() => {
//     goTo((current - 1 + slides.length) % slides.length);
//   }, [current, slides.length, goTo]);

//   // Auto-play
//   useEffect(() => {
//     const timer = setInterval(next, 5000);
//     return () => clearInterval(timer);
//   }, [next]);

//   return (
//     <section className="relative w-full h-[85vh] md:h-[90vh] overflow-hidden" id="home">
//       {/* Slides */}
//       {slides.map((slide, index) => (
//         <div
//           key={slide.image}
//           className={`absolute inset-0 transition-opacity duration-700 ease-in-out ${
//             index === current ? "opacity-100 z-10" : "opacity-0 z-0"
//           }`}
//         >
//           <Image
//             src={slide.image}
//             alt={slide.title || `Slide ${index + 1}`}
//             fill
//             sizes="100vw"
//             priority={index === 0}
//             loading={index === 0 ? "eager" : "lazy"}
//             fetchPriority={index === 0 ? "high" : "auto"}
//             className="object-cover"
//           />
//           {/* Gradient overlay */}
//           <div className="absolute inset-0 bg-gradient-to-t from-primary/70 via-primary/20 to-transparent" />

//           {/* Text overlay */}
//           {(slide.title || slide.subtitle) && (
//             <div className="absolute inset-0 z-10 flex items-end pb-32 md:pb-40">
//               <div className="container mx-auto px-6 md:px-12">
//                 <div className="max-w-3xl">
//                   {slide.title && (
//                     <h2
//                       className={`font-heading font-bold text-xl md:text-5xl lg:text-6xl text-white mb-4 drop-shadow-lg transition-all duration-700 ${
//                         index === current
//                           ? "translate-y-0 opacity-100"
//                           : "translate-y-8 opacity-0"
//                       }`}
//                     >
//                       {slide.title}
//                     </h2>
//                   )}
//                   {slide.subtitle && (
//                     <p
//                       className={`text-lg md:text-xl text-white/90 max-w-2xl drop-shadow-md transition-all duration-700 delay-150 ${
//                         index === current
//                           ? "translate-y-0 opacity-100"
//                           : "translate-y-8 opacity-0"
//                       }`}
//                     >
//                       {slide.subtitle}
//                     </p>
//                   )}
//                 </div>
//               </div>
//             </div>
//           )}
//         </div>
//       ))}

//       {/* Navigation Arrows */}
//       <div className="absolute right-6 md:right-10 top-1/2 -translate-y-1/2 z-20 flex flex-col gap-3">
//         <button
//           onClick={prev}
//           className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
//           aria-label="Previous slide"
//         >
//           <ChevronLeft className="w-5 h-5" />
//         </button>
//         <button
//           onClick={next}
//           className="w-11 h-11 rounded-full bg-white/20 backdrop-blur-sm border border-white/30 flex items-center justify-center text-white hover:bg-white/40 transition-colors"
//           aria-label="Next slide"
//         >
//           <ChevronRight className="w-5 h-5" />
//         </button>
//       </div>

//       {/* Dots */}
//       <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex gap-2">
//         {slides.map((slide, index) => (
//           <button
//             key={slide.image}
//             onClick={() => goTo(index)}
//             className={`h-2 rounded-full transition-all duration-300 ${
//               index === current ? "w-8 bg-accent" : "w-2 bg-white/50 hover:bg-white/80"
//             }`}
//             aria-label={`Go to slide ${index + 1}`}
//           />
//         ))}
//       </div>

//       {/* Stats Bar */}
//       <div className="absolute bottom-0 left-0 right-0 z-20 bg-primary/90 backdrop-blur-sm">
//         <div className="container mx-auto px-6 md:px-12 py-4 grid grid-cols-2 md:grid-cols-4 gap-4 text-white text-center">
//           {stats.map((stat) => {
//             const Icon = iconMap[stat.icon];
//             return (
//               <div key={stat.label} className="flex flex-col items-center gap-1">
//                 <Icon className="w-6 h-6 text-accent" />
//                 <span className="text-2xl md:text-3xl font-bold">{stat.value}</span>
//                 <span className="text-xs md:text-sm text-white/80">{stat.label}</span>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </section>
//   );
// }

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