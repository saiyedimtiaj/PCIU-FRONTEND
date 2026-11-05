import { HeroBackdrop } from "@/components/shared/HeroBackdrop";

export default function ClubLoading() {
  return (
    <div className="min-h-screen bg-background" aria-busy="true" aria-label="Loading club">
      <section className="relative isolate overflow-hidden bg-primary">
        <HeroBackdrop />
        <div className="container mx-auto px-4 pt-6 pb-24 md:px-8 md:pt-8 md:pb-28">
          <div className="h-6 w-56 animate-pulse rounded-full bg-white/10" />
          <div className="mt-6 rounded-[2rem] border border-white/10 bg-white/5 p-1.5 sm:p-2 md:mt-8">
            <div className="aspect-[27/10] animate-pulse rounded-[1.6rem] bg-white/10" />
          </div>
        </div>
      </section>
      <div className="relative z-10 container mx-auto -mt-16 px-4 md:-mt-20 md:px-8">
        <div className="rounded-3xl border border-border bg-card p-5 shadow-xl shadow-primary/10 sm:p-7 lg:px-10">
          <div className="flex flex-col items-center gap-5 lg:flex-row lg:items-end lg:gap-8">
            <div className="-mt-16 size-28 shrink-0 animate-pulse rounded-full bg-muted ring-6 ring-card sm:-mt-20 sm:size-32 lg:-mt-24 lg:size-40" />
            <div className="flex w-full flex-1 flex-col items-center space-y-3 lg:items-start">
              <div className="h-5 w-20 animate-pulse rounded-full bg-muted" />
              <div className="h-9 w-full max-w-md animate-pulse rounded-lg bg-muted" />
              <div className="h-4 w-64 animate-pulse rounded bg-muted" />
            </div>
            <div className="h-10 w-56 animate-pulse rounded-full bg-muted" />
          </div>
          <div className="mt-6 grid grid-cols-2 gap-3 border-t border-border pt-6 sm:grid-cols-3">
            {Array.from({ length: 3 }, (_, i) => (
              <div key={i} className="h-18 animate-pulse rounded-2xl bg-muted last:col-span-2 sm:last:col-span-1" />
            ))}
          </div>
        </div>
      </div>
      <main className="container mx-auto grid gap-8 px-4 py-12 md:px-8 lg:grid-cols-[22rem_minmax(0,1fr)] lg:gap-10 lg:py-16">
        <div className="space-y-5">
          <div className="h-72 animate-pulse rounded-3xl bg-muted" />
          <div className="h-56 animate-pulse rounded-3xl bg-muted" />
        </div>
        <div>
          <div className="mb-5 h-8 w-48 animate-pulse rounded bg-muted" />
          <div className="mb-5 h-14 animate-pulse rounded-2xl bg-muted" />
          <div className="grid gap-5 sm:grid-cols-2">
            <div className="h-72 animate-pulse rounded-3xl bg-muted sm:col-span-2" />
            <div className="h-72 animate-pulse rounded-3xl bg-muted" />
            <div className="h-72 animate-pulse rounded-3xl bg-muted" />
          </div>
        </div>
      </main>
    </div>
  );
}
