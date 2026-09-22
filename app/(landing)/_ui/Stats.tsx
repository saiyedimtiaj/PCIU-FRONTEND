import { getStats } from "@/lib/api/home";
import StatsGrid from "./StatsGrid";

export default async function Stats() {
  const stats = await getStats();

  if (stats.length === 0) return null;

  return (
    <section className="w-full bg-primary" aria-label="University at a glance">
      <div className="container mx-auto px-4 sm:px-6 md:px-10">
        <StatsGrid stats={stats} />
      </div>
    </section>
  );
}
