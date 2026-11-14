export default function IqacLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-linear-to-br from-primary via-primary/95 to-secondary pt-16 pb-28 md:pt-20 md:pb-32">
        <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 flex flex-col items-center gap-4">
          <div className="h-6 w-36 animate-pulse rounded-full bg-white/20" />
          <div className="h-10 w-full max-w-xl animate-pulse rounded bg-white/20" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-white/15" />
          <div className="mt-4 flex flex-wrap justify-center gap-2">
            {Array.from({ length: 6 }, (_, i) => (
              <div key={i} className="h-8 w-20 animate-pulse rounded-full bg-white/10" />
            ))}
          </div>
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 -mt-16 relative z-10 grid lg:grid-cols-5 gap-4 md:gap-6">
        <div className="lg:col-span-3 h-64 animate-pulse rounded-2xl border border-border bg-muted" />
        <div className="lg:col-span-2 grid sm:grid-cols-2 lg:grid-cols-1 gap-4 md:gap-6">
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
          <div className="h-28 animate-pulse rounded-2xl bg-muted" />
        </div>
      </div>
      <div className="container mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-14 grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }, (_, i) => (
          <div key={i} className="h-24 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  );
}
