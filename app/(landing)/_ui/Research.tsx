import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { iconMap } from "@/lib/icons";
import { getResearchSettings } from "@/lib/api/home";
import { resolveUploadUrl } from "@/lib/upload-url";
import StatCounter from "./StatCounter";

const STAT_ICONS = {
  "research projects": "award",
  citations: "trending-up",
  "research centers": "users",
  "active grants": "microscope",
} as const;

export default async function Research() {
  const settings = await getResearchSettings();
  const settingsByKey = new Map(
    settings.map((setting) => [
      setting.key.trim().replace(/\s+/g, " ").toLowerCase(),
      setting,
    ]),
  );
  const researchCell = settingsByKey.get("research cell");
  const image = resolveUploadUrl(researchCell?.value);
  const stats = Object.entries(STAT_ICONS).flatMap(([key, icon]) => {
    const setting = settingsByKey.get(key);
    return setting
      ? [{ key, icon, label: setting.key.trim(), value: setting.value }]
      : [];
  });

  if (!researchCell && stats.length === 0) {
    return null;
  }

  return (
    <section
      className="relative overflow-hidden bg-white py-16 sm:py-20 md:py-24"
      id="research"
    >
      {/* Crescent glow — white center fading into light gold */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-x-0 top-0 h-[380px] overflow-hidden"
      ></div>

      <div className="container relative mx-auto px-4 sm:px-4 md:px-8">
        <div className="mb-8 text-center sm:mb-10">
          <h2 className="font-heading mb-3 text-3xl font-bold text-primary sm:mb-4 sm:text-4xl md:text-5xl">
            Research Excellence
          </h2>
          <p className="mx-auto max-w-2xl text-sm text-muted-foreground sm:text-base md:text-lg">
            Advancing innovation from coast to campus
          </p>
        </div>
      </div>

      <div className="container relative mx-auto px-4 sm:px-6 md:px-12">
        <div
          className={`grid grid-cols-1 gap-6 lg:gap-8 ${
            image && stats.length > 0 ? "lg:grid-cols-[1.6fr_1fr]" : ""
          }`}
        >
          {image && (
            <div className="group relative min-h-72 overflow-hidden rounded-2xl shadow-md transition-shadow duration-500 hover:shadow-2xl sm:min-h-80">
              <Image
                src={image}
                alt={researchCell?.key.trim() || "Research"}
                fill
                loading="lazy"
                sizes="(min-width: 1024px) 55vw, 100vw"
                className="object-cover transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/80 via-primary/10 to-transparent" />
              {researchCell && (
                <div className="absolute inset-x-0 bottom-0 p-6 sm:p-8">
                  <span className="inline-flex rounded-full border border-white/30 bg-white/15 px-3 py-1 text-xs font-semibold uppercase tracking-[0.18em] text-white backdrop-blur-sm">
                    {researchCell.key.trim()}
                  </span>
                </div>
              )}
            </div>
          )}

          {stats.length > 0 && (
            <div className="grid grid-cols-2 gap-3 sm:gap-4">
              {stats.map((stat, index) => {
                const Icon = iconMap[stat.icon];
                const isLast = index === stats.length - 1;
                return (
                  <div
                    key={stat.key}
                    className={`flex flex-col justify-center rounded-2xl p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-md  ${
                      isLast
                        ? "bg-primary text-white"
                        : "border border-primary/10 bg-secondary-light/40 text-primary"
                    }`}
                  >
                    <Icon
                      className={`mb-3 h-6 w-6 ${isLast ? "text-accent" : "text-primary/50"}`}
                    />
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
              <div className="relative col-span-2 overflow-hidden rounded-2xl border border-primary/10 bg-gradient-to-br from-white via-white to-secondary-light/50 p-5 shadow-sm sm:p-6 transition-all duration-400  hover:-translate-y-1 hover:shadow-md">
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute -right-8 -top-10 h-32 w-32 rounded-full bg-accent/10 blur-2xl"
                />
                <div className="relative">
                  <div className="mb-3 flex items-start gap-3">
                    <span className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
                      <iconMap.microscope className="size-5" />
                    </span>
                    <div>
                      <h3 className="font-heading text-base font-bold text-primary sm:text-lg">
                        Open research calls
                      </h3>
                      <p className="mt-1 text-xs leading-relaxed text-muted-foreground sm:text-sm">
                        Seed grants for faculty-led interdisciplinary projects.
                        Two cycles a year, reviewed by the university research
                        board.
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-3">
                    <Button
                      size="cta"
                      render={<Link href="/research?section=centres" />}
                      nativeButton={false}
                    >
                      Explore Centers
                    </Button>
                    <Button
                      variant="outlinePrimary"
                      size="cta"
                      render={<Link href="/research?section=publications" />}
                      nativeButton={false}
                    >
                      Publications
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
