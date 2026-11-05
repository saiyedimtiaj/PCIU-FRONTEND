import { HeroBackdrop } from "@/components/shared/HeroBackdrop";
import ClubCardSkeleton from "./_ui/ClubCardSkeleton";

export default function ClubsLoading() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading clubs">
      <section className="relative isolate overflow-hidden bg-primary">
        <HeroBackdrop />
        <div className="container mx-auto px-4 pt-6 pb-28 md:px-8 md:pt-8 md:pb-32">
          <div className="h-6 w-40 animate-pulse rounded-full bg-white/10" />
          <div className="mt-8 grid items-center gap-8 md:mt-10 lg:grid-cols-[minmax(0,1fr)_auto] lg:gap-16">
            <div className="space-y-4">
              <div className="h-4 w-44 animate-pulse rounded bg-white/15" />
              <div className="h-12 w-72 animate-pulse rounded-lg bg-white/20" />
              <div className="h-4 w-full max-w-xl animate-pulse rounded bg-white/10" />
              <div className="h-4 w-4/5 max-w-lg animate-pulse rounded bg-white/10" />
            </div>
            <div className="grid grid-cols-2 gap-2 rounded-2xl border border-white/10 bg-white/5 p-2 lg:w-sm">
              <div className="h-30 animate-pulse rounded-xl bg-white/10" />
              <div className="h-30 animate-pulse rounded-xl bg-white/10" />
            </div>
          </div>
        </div>
      </section>
      <main className="relative z-10 container mx-auto -mt-16 space-y-8 px-4 pb-16 md:-mt-20 md:px-8">
        <div className="space-y-3 rounded-2xl border border-border bg-card p-4 shadow-xl shadow-primary/10">
          <div className="grid gap-3 sm:grid-cols-[minmax(0,1fr)_13rem]">
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
            <div className="h-11 animate-pulse rounded-lg bg-muted" />
          </div>
          <div className="flex gap-2 border-t border-border/70 pt-3">
            {Array.from({ length: 4 }, (_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-muted" />
            ))}
          </div>
        </div>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }, (_, i) => (
            <ClubCardSkeleton key={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
