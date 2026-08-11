import { iconMap } from "@/lib/icons";
import foundationData from "@/content/about/foundation.json";
import type { FoundationContent } from "@/types/about";

const foundation = foundationData as FoundationContent;
const [vision, mission, strategy, values] = foundation.cards;

export default function VisionMissionValues() {
  const VisionIcon = iconMap[vision.icon];
  const MissionIcon = iconMap[mission.icon];
  const StrategyIcon = iconMap[strategy.icon];
  const ValuesIcon = iconMap[values.icon];

  return (
    <section className="py-16 md:py-24 bg-muted/40">
      <div className="container mx-auto px-4">
        <div className="text-center mb-14">
          <span className="inline-block bg-primary/10 text-primary text-xs font-bold uppercase tracking-[0.15em] px-4 py-1.5 rounded-full mb-4">
            {foundation.eyebrow}
          </span>
          <h2 className="text-3xl md:text-4xl font-extrabold text-foreground">
            {foundation.heading} <span className="text-accent">{foundation.headingAccent}</span>
          </h2>
        </div>

        {/* Vision & Mission — Side by side large cards */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6 mb-6">
          {/* Vision */}
          <div className="relative bg-primary rounded-2xl p-8 md:p-10 text-primary-foreground overflow-hidden group">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/10 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-white/10 flex items-center justify-center mb-6">
                <VisionIcon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold mb-4">{vision.title}</h3>
              <p className="text-primary-foreground/80 leading-relaxed">{vision.description}</p>
            </div>
          </div>

          {/* Mission */}
          <div className="relative bg-card rounded-2xl p-8 md:p-10 border border-border overflow-hidden group shadow-sm">
            <div className="absolute top-0 right-0 w-40 h-40 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent/10 flex items-center justify-center mb-6">
                <MissionIcon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{mission.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{mission.description}</p>
            </div>
          </div>
        </div>

        {/* Strategy & Values — Side by side */}
        <div className="max-w-6xl mx-auto grid md:grid-cols-2 gap-6">
          {/* Strategy */}
          <div className="relative bg-card rounded-2xl p-8 md:p-10 border border-border overflow-hidden group shadow-sm">
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 group-hover:scale-150 transition-transform duration-700" />
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                <StrategyIcon className="w-7 h-7 text-primary" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{strategy.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{strategy.description}</p>
            </div>
          </div>

          {/* Guiding Values */}
          <div className="relative bg-linear-to-br from-accent/10 to-primary/5 rounded-2xl p-8 md:p-10 border border-accent/20 overflow-hidden group">
            <div className="relative z-10">
              <div className="w-14 h-14 rounded-2xl bg-accent/20 flex items-center justify-center mb-6">
                <ValuesIcon className="w-7 h-7 text-accent" />
              </div>
              <h3 className="text-2xl font-bold text-foreground mb-4">{values.title}</h3>
              <p className="text-muted-foreground leading-relaxed mb-5">{values.description}</p>
              <ul className="space-y-3">
                {values.values?.map((val) => (
                  <li key={val} className="flex items-start gap-3 text-sm text-muted-foreground">
                    <span className="w-5 h-5 rounded-full bg-accent/20 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent" />
                    </span>
                    {val}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
