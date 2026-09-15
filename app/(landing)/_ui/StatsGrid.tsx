import { getStatIcon } from "@/lib/icons/stats";
import type { StatItem } from "@/types/home";
import StatCounter from "./StatCounter";

export default function StatsGrid({ stats }: { stats: StatItem[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-y md:divide-y-0 divide-white/10">
      {stats.map((stat) => {
        const Icon = getStatIcon(stat.key);
        return (
          <div
            key={stat.id}
            className="group relative flex flex-col items-center text-center py-7 sm:py-8 md:py-9 px-2 transition-all duration-300 hover:-translate-y-1 active:scale-[0.97] active:duration-100"
          >
            {/* Card background tint on hover */}
            <span className="pointer-events-none absolute inset-0 bg-white/[0.03] opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

            {/* Divider highlight — brightens the shared border on this card's edges */}
            <span className="pointer-events-none absolute inset-y-0 left-0 w-px bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-70" />
            <span className="pointer-events-none absolute inset-y-0 right-0 w-px bg-accent opacity-0 transition-opacity duration-300 group-hover:opacity-70" />

            <div className="relative flex items-center justify-center w-11 h-11 sm:w-9 sm:h-9 rounded-full border border-accent/40 bg-accent/10 mb-3 transition-all duration-300 group-hover:bg-accent/20 group-hover:border-accent group-hover:scale-105 group-hover:shadow-[0_0_20px_theme(colors.accent/45%)]">
              <Icon
                className="w-5 h-5 sm:w-4.5 sm:h-4.5 text-accent"
                strokeWidth={1.75}
                aria-hidden="true"
              />
            </div>

            <StatCounter
              value={`${stat.value}+`}
              className="relative font-heading font-extrabold text-2xl sm:text-3xl text-white tabular-nums tracking-tight leading-none transition-colors duration-300 group-hover:text-accent"
            />

            <span className="sr-only">
              {stat.value}+ {stat.label}
            </span>

            <span className="relative mt-2.5 text-[11px] sm:text-xs md:text-sm font-extrabold text-white/90 uppercase tracking-[0.08em] transition-colors duration-300 group-hover:text-white">
              {stat.label}
            </span>

            <span className="relative bottom-0 mt-2 h-px w-0 bg-accent transition-all duration-300 group-hover:w-8" />
          </div>
        );
      })}
    </div>
  );
}
