// import Image from "next/image";
// import { Card, CardContent } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { iconMap } from "@/lib/icons";
// import campusLifeData from "@/content/home/campus-life.json";
// import type { CampusLifeContent } from "@/types/home";

// const campusLife = campusLifeData as CampusLifeContent;

// export default function CampusLife() {
//   return (
//     <section
//       className="py-20 bg-linear-to-br from-primary/5 via-accent/10 to-secondary/5"
//       id="campus-life"
//     >
//       <div className="container mx-auto px-4">
//         <div className="text-center mb-12 animate-fade-in">
//           <h2 className="font-heading font-bold text-4xl md:text-5xl text-primary mb-4">
//             Campus Life
//           </h2>
//           <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
//             Grow, explore, and lead beyond the classroom
//           </p>
//         </div>

//         {/* Image Gallery */}
//         <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
//           <div className="relative rounded-2xl overflow-hidden shadow-lg group h-96">
//             <Image
//               src={campusLife.libraryImage}
//               alt="Students collaborating in university library"
//               fill
//               sizes="(min-width: 768px) 50vw, 100vw"
//               className="object-cover group-hover:scale-105 transition-transform duration-500"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-primary/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//               <h3 className="font-heading font-bold text-xl">Academic Excellence</h3>
//               <p className="text-white/90">World-class learning environments</p>
//             </div>
//           </div>

//           <div className="relative rounded-2xl overflow-hidden shadow-lg group h-96">
//             <Image
//               src={campusLife.sportsImage}
//               alt="Students playing football on modern sports field"
//               fill
//               sizes="(min-width: 768px) 50vw, 100vw"
//               className="object-cover group-hover:scale-105 transition-transform duration-500"
//             />
//             <div className="absolute inset-0 bg-linear-to-t from-accent/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
//             <div className="absolute bottom-6 left-6 right-6 text-white opacity-0 group-hover:opacity-100 transition-opacity">
//               <h3 className="font-heading font-bold text-xl">Athletic Excellence</h3>
//               <p className="text-white/90">State-of-the-art sports facilities</p>
//             </div>
//           </div>
//         </div>

//         {/* Activities Grid */}
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12 max-w-4xl mx-auto">
//           {campusLife.activities.map((activity) => {
//             const Icon = iconMap[activity.icon];
//             return (
//               <Card
//                 key={activity.title}
//                 className="text-center hover:shadow-lg transition-all duration-300 hover:-translate-y-1 border border-white/30 bg-white/20 backdrop-blur-md shadow-lg hover:border-accent hover:bg-white/30"
//               >
//                 <CardContent className="p-6">
//                   <div className="w-16 h-16 bg-gradient-accent rounded-full flex items-center justify-center mx-auto mb-4">
//                     <Icon className="w-8 h-8 text-white" />
//                   </div>
//                   <h3 className="font-semibold text-primary mb-2">{activity.title}</h3>
//                   <p className="text-sm text-muted-foreground">{activity.description}</p>
//                 </CardContent>
//               </Card>
//             );
//           })}
//         </div>

//         {/* Video Section */}
//         <div className="bg-white/20 backdrop-blur-md border border-white/30 rounded-2xl p-8 shadow-lg text-center">
//           <div className="max-w-3xl mx-auto">
//             <h3 className="font-heading font-bold text-2xl text-primary mb-4">
//               Experience PCIU Life
//             </h3>
//             <p className="text-muted-foreground mb-6">
//               Watch our campus tour to see what makes Port City International University a
//               vibrant community
//             </p>
//             <Button variant="highlight" size="cta">
//               Watch Campus Tour
//             </Button>
//           </div>
//         </div>

//         <div className="text-center mt-12">
//           <Button variant="outlineSecondary" size="cta">
//             Explore Student Life
//           </Button>
//         </div>
//       </div>
//     </section>
//   );
// }



import Image from "next/image";
import { iconMap } from "@/lib/icons";
import { Button } from "@/components/ui/button";
import campusLifeData from "@/content/home/campus-life.json";
import type { CampusLifeContent } from "@/types/home";

const campusLife = campusLifeData as CampusLifeContent;

export default function CampusLife() {
  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24"
      id="campus-life"
    >
      {/* Layered thin arcs behind the heading with a gentle 180-degree turn */}
      <div
        aria-hidden
        className="pointer-events-none absolute left-1/2 top-0 z-0 h-24 w-[min(820px,90vw)] -translate-x-1/2"
      >
        <svg
          className="h-full w-full motion-safe:animate-arc-rotate"
          viewBox="0 0 820 110"
          fill="none"
          preserveAspectRatio="none"
        >
          <path d="M20 6 Q410 82 800 6" stroke="hsl(42 85% 58%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.42" />
          <path d="M10 18 Q410 94 810 18" stroke="hsl(230 70% 50%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.24" />
          <path d="M28 30 Q410 102 792 30" stroke="hsl(42 85% 72%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.38" />
          <path d="M45 42 Q410 108 775 42" stroke="hsl(231 77% 22%)" strokeWidth="0.9" strokeLinecap="round" opacity="0.16" />
          <path d="M36 12 Q410 76 784 12" stroke="hsl(230 70% 50%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.18" />
          <path d="M18 26 Q410 100 802 26" stroke="hsl(42 85% 58%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.25" />
          <path d="M54 38 Q410 106 766 38" stroke="hsl(42 85% 72%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.22" />
          <path d="M68 50 Q410 110 752 50" stroke="hsl(231 77% 22%)" strokeWidth="0.7" strokeLinecap="round" opacity="0.12" />
        </svg>
      </div>

      {/* Content */}
      <div className="container relative z-10 mx-auto px-4 sm:px-6 md:px-12">
        <div className="mb-10 text-center sm:mb-14">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Campus Life
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Grow, explore, and lead beyond the classroom
          </p>
        </div>

        {/* Image Gallery */}
        <div className="mb-6 grid grid-cols-1 gap-5 sm:gap-6 md:grid-cols-2">
          <div className="group relative h-64 overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 hover:shadow-2xl sm:h-72 md:h-80">
            <Image
              src={campusLife.libraryImage}
              alt="Students collaborating in university library"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
              <h3 className="font-heading text-lg font-bold sm:text-xl">Academic Excellence</h3>
              <p className="text-sm text-white/85 sm:text-base">
                World-class learning environments
              </p>
            </div>
          </div>

          <div className="group relative h-64 overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 hover:shadow-2xl sm:h-72 md:h-80">
            <Image
              src={campusLife.sportsImage}
              alt="Students playing football on modern sports field"
              fill
              sizes="(min-width: 768px) 50vw, 100vw"
              className="object-cover transition-transform duration-700 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/25 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-5 text-white sm:p-6">
              <h3 className="font-heading text-lg font-bold sm:text-xl">Athletic Excellence</h3>
              <p className="text-sm text-white/85 sm:text-base">
                State-of-the-art sports facilities
              </p>
            </div>
          </div>
        </div>

         {/* Activities row — compact info cards */}
    <div className="mb-10 grid grid-cols-1 gap-4 sm:mb-12 sm:grid-cols-2 lg:grid-cols-4">
      {campusLife.activities.map((activity) => {
        const Icon = iconMap[activity.icon];
        return (
          <div
            key={activity.title}
            className="group flex items-start gap-3 rounded-xl border-3  border-l-primary border-r-primary  border-primary/10 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/40 hover:shadow-md"
          >
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-white">
              {Icon && <Icon className="h-4.5 w-4.5" />}
            </div>
            <div>
              <h3 className="mb-1 text-sm font-bold text-primary">{activity.title}</h3>
              <p className="text-xs leading-relaxed text-muted-foreground">
                {activity.description}
              </p>
            </div>
          </div>
        );
      })}
    </div> 

        {/* CTA block */}
        <div className="relative overflow-hidden rounded-2xl bg-primary p-8 text-center shadow-lg sm:p-10 md:p-12">
          <div
            aria-hidden
            className="pointer-events-none absolute -right-16 -top-16 h-56 w-56 rounded-full bg-accent/15 blur-3xl"
          />
          <div
            aria-hidden
            className="pointer-events-none absolute inset-0 opacity-[0.05]"
            style={{
              backgroundImage:
                "repeating-linear-gradient(45deg, white 0, white 1px, transparent 1px, transparent 12px)",
            }}
          />
          <div className="relative mx-auto max-w-2xl">
            <h3 className="font-heading mb-3 text-xl font-bold text-white sm:mb-4 sm:text-2xl md:text-3xl">
              Experience PCIU Life
            </h3>
            <p className="mb-7 text-sm text-white/75 sm:text-base">
              Watch our campus tour to see what makes Port City International University a
              vibrant community
            </p>
            <div className="flex flex-col items-center justify-center gap-3 sm:flex-row sm:gap-4">
              <Button variant="highlight" size="cta">
                Watch Campus Tour
              </Button>
              <Button
                variant="outline"
                size="cta"
                className="border-white/30 bg-transparent text-white hover:bg-white/10 hover:text-white"
              >
                Explore Student Life
              </Button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}