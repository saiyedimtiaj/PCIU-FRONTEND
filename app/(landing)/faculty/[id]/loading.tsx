export default function FacultyProfileLoading() {
  return (
    <div className="min-h-screen bg-slate-50/50 pb-20">
      <div className="h-62.5 md:h-87.5 w-full bg-[#1e3a8a]" />
      <div className="container mx-auto px-4 -mt-32 relative z-10">
        <div className="bg-white rounded-2xl shadow-xl p-6 md:p-10 border border-slate-100 flex flex-col md:flex-row gap-8 items-center md:items-start">
          <div className="w-48 sm:w-56 aspect-3/4 shrink-0 animate-pulse rounded-2xl bg-muted" />
          <div className="flex-1 w-full space-y-4">
            <div className="h-9 w-2/3 animate-pulse rounded bg-muted" />
            <div className="h-5 w-1/3 animate-pulse rounded bg-muted" />
            <div className="h-4 w-1/2 animate-pulse rounded bg-muted" />
            <div className="space-y-2 pt-4">
              {Array.from({ length: 3 }, (_, i) => (
                <div key={i} className="h-4 w-full animate-pulse rounded bg-muted" />
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 h-11 w-full max-w-xl animate-pulse rounded-lg bg-muted" />
        <div className="mt-6 h-64 animate-pulse rounded-2xl bg-muted" />
      </div>
    </div>
  );
}
