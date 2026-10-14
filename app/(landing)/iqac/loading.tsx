export default function IqacLoading() {
  return (
    <div className="min-h-screen bg-background">
      <div className="bg-linear-to-br from-primary via-primary/95 to-secondary py-20 lg:py-28">
        <div className="container mx-auto px-4 flex flex-col items-center gap-4">
          <div className="h-6 w-36 animate-pulse rounded-full bg-white/20" />
          <div className="h-10 w-full max-w-xl animate-pulse rounded bg-white/20" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded bg-white/15" />
        </div>
      </div>
      <div className="container mx-auto px-4 py-12 grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
          <div className="grid sm:grid-cols-2 gap-4">
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
            <div className="h-36 animate-pulse rounded-xl bg-muted" />
          </div>
          <div className="h-56 animate-pulse rounded-xl bg-muted" />
        </div>
        <div className="space-y-6">
          <div className="h-48 animate-pulse rounded-xl bg-muted" />
          <div className="h-64 animate-pulse rounded-xl bg-muted" />
        </div>
      </div>
    </div>
  );
}
