// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { iconMap } from "@/lib/icons";
// import researchData from "@/content/home/research.json";
// import type { ResearchContent } from "@/types/home";

// const research = researchData as ResearchContent;

// export default function Research() {
//   return (
//     <section
//       className="py-20 bg-linear-to-br from-accent/5 via-secondary/10 to-primary/5"
//       id="research"
//     >
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12 animate-fade-in">
//           <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
//             Research Excellence
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Advancing innovation from coast to campus
//           </p>
//         </div>

//         {/* Research Image & Stats */}
//         <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-16">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg min-h-80">
//             <Image
//               src={research.image}
//               alt="Students and professors conducting research in modern laboratory"
//               fill
//               sizes="(min-width: 1024px) 50vw, 100vw"
//               className="object-cover"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent" />
//             <div className="absolute bottom-6 left-6 right-6 text-white">
//               <h3 className="font-heading font-bold text-2xl mb-2">
//                 State-of-the-Art Facilities
//               </h3>
//               <p className="text-white/90">
//                 Equipped with cutting-edge technology for groundbreaking research
//               </p>
//             </div>
//           </div>

//           <div className="grid grid-cols-2 gap-6">
//             {research.stats.map((stat) => {
//               const Icon = iconMap[stat.icon];
//               return (
//                 <Card
//                   key={stat.label}
//                   className="text-center hover:shadow-lg transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30"
//                 >
//                   <CardContent className="p-6">
//                     <Icon className="w-10 h-10 text-accent mx-auto mb-4" />
//                     <div className="font-heading font-bold text-4xl text-primary mb-2">
//                       {stat.value}
//                     </div>
//                     <div className="text-muted-foreground font-medium">{stat.label}</div>
//                   </CardContent>
//                 </Card>
//               );
//             })}
//           </div>
//         </div>

//         {/* Research Highlights */}
//         <div className="mb-12">
//           <h3 className="font-heading font-bold text-3xl text-primary mb-8 text-center">
//             Featured Research Centers
//           </h3>
//           <div className="max-w-md mx-auto">
//             {research.highlights.map((highlight) => (
//               <Card
//                 key={highlight.title}
//                 className="hover:shadow-xl transition-all duration-300 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-secondary hover:bg-white/30"
//               >
//                 <CardContent className="p-6">
//                   <h4 className="font-heading font-semibold text-xl text-primary mb-3">
//                     {highlight.title}
//                   </h4>
//                   <p className="text-muted-foreground mb-4">{highlight.description}</p>
//                   <div className="flex flex-wrap gap-2">
//                     {highlight.tags.map((tag) => (
//                       <span
//                         key={tag}
//                         className="text-xs bg-accent-light text-accent px-3 py-1 rounded-full"
//                       >
//                         {tag}
//                       </span>
//                     ))}
//                   </div>
//                 </CardContent>
//               </Card>
//             ))}
//           </div>
//         </div>

//         <div className="text-center">
//           <Button variant="secondary" size="cta">
//             Explore Research
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }


import Image from "next/image";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import researchData from "@/content/home/research.json";
import type { ResearchContent } from "@/types/home";
import StatCounter from "./StatCounter";

const research = researchData as ResearchContent;

export default function Research() {
  const featuredHighlight = research.highlights[0];

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24"
      id="research"
    >
      {/* Crescent glow — white center fading into light gold */}
      <div aria-hidden className="pointer-events-none absolute inset-x-0 top-0 h-[380px] overflow-hidden">
        <div
          className="absolute left-1/2 top-[-140px] h-[380px] w-[1000px] -translate-x-1/2"
          style={{
            background:
              "radial-gradient(ellipse 500px 260px at center, rgba(255,255,255,0.95) 0%, hsl(42 85% 82% / 0.55) 55%, transparent 78%)",
            filter: "blur(45px)",
          }}
        />
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Research Excellence
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Advancing innovation from coast to campus
          </p>
        </div>

        {/* Featured image + stats */}
        <div className="mb-12 grid grid-cols-1 gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
          {/* Featured research image with overlay */}
          <div className="group relative min-h-72 overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 hover:shadow-2xl sm:min-h-80">
            <Image
              src={research.image}
              alt="Students and professors conducting research in modern laboratory"
              fill
              sizes="(min-width: 1024px) 55vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/30 to-transparent" />
            {featuredHighlight && (
              <div className="absolute bottom-0 left-0 right-0 p-6 text-white sm:p-8">
                <span className="mb-1.5 block text-xs font-bold uppercase tracking-wider text-accent">
                  Featured Center
                </span>
                <h3 className="font-heading mb-2 text-xl font-bold sm:text-2xl">
                  {featuredHighlight.title}
                </h3>
                <p className="max-w-md text-sm text-white/85 sm:text-base">
                  {featuredHighlight.description}
                </p>
              </div>
            )}
          </div>

          {/* Stats grid */}
          <div className="grid grid-cols-2 gap-4 sm:gap-5">
            {research.stats.map((stat, index) => {
              const Icon = iconMap[stat.icon];
              const isLast = index === research.stats.length - 1;
              return (
                <div
                  key={stat.label}
                  className={`flex flex-col justify-center rounded-2xl p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md sm:p-6 ${
                    isLast
                      ? "bg-primary text-white"
                      : "border border-primary/10 bg-secondary-light/40 text-primary"
                  }`}
                >
                  {Icon && (
                    <Icon
                      className={`mb-3 h-6 w-6 ${isLast ? "text-accent" : "text-primary/50"}`}
                    />
                  )}
                  <StatCounter
                    value={stat.value}
                    className={`font-heading text-2xl font-bold sm:text-3xl ${
                      isLast ? "text-accent" : "text-primary"
                    }`}
                  />
                  <div
                    className={`mt-0.5 text-xs font-medium sm:text-sm ${
                      isLast ? "text-white/80" : "text-muted-foreground"
                    }`}
                  >
                    {stat.label}
                  </div>
                </div>
              );
            })}

            {/* Open research calls — static info panel */}
            <div className="col-span-2 rounded-2xl border border-primary/10 bg-white p-5 shadow-sm sm:p-6">
              <h3 className="font-heading mb-1.5 text-base font-bold text-primary">
                Open research calls
              </h3>
              <p className="mb-4 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                Seed grants for faculty-led interdisciplinary projects. Two cycles a year,
                reviewed by the university research board.
              </p>
              <div className="flex flex-wrap gap-3">
                <Button
                  size="sm"
                  style={{ backgroundColor: "#0b2a5b", color: "#ffffff" }}
                >
                  Explore Research
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  style={{ borderColor: "#0b2a5b", color: "#0b2a5b" }}
                >
                  Publications
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}