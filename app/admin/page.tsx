import { tracks } from "@/lib/tracks";
import { createServiceSupabase } from "@/lib/supabase/service";
import { AdminDashboard, type StatRow } from "./AdminDashboard";

/** Altid server-render: miljøvariabler skal læses ved request (fx Vercel), ikke ved statisk build. */
export const dynamic = "force-dynamic";
/** Undgå at Next.js cacher Supabase-fetch i denne route (sammen med no-store i createServiceSupabase). */
export const fetchCache = "force-no-store";
export const revalidate = 0;

export default async function AdminPage() {
  const admin = createServiceSupabase();
  if (!admin) {
    return (
      <div className="min-h-screen bg-[#040814] px-6 py-16 text-center text-white/80">
        <p className="text-lg font-semibold">Supabase er ikke konfigureret</p>
        <p className="mt-2 text-sm text-white/55">
          Tilføj{" "}
          <code className="rounded bg-white/10 px-1">NEXT_PUBLIC_SUPABASE_URL</code> og{" "}
          <code className="rounded bg-white/10 px-1">SUPABASE_SERVICE_ROLE_KEY</code> i
          miljøvariabler (lokalt: <code className="rounded bg-white/10 px-1">.env.local</code>
          , på Vercel: Project → Settings → Environment Variables). Tjek at URL&apos;en er
          kopieret korrekt tegn for tegn.
        </p>
      </div>
    );
  }

  const { data: rows, error } = await admin
    .from("track_plays")
    .select("track_id, created_at");
  if (error) {
    return (
      <div className="min-h-screen bg-[#040814] px-6 py-16 text-center text-red-300">
        <p className="font-semibold">Kunne ikke hente statistik</p>
        <p className="mt-2 text-sm opacity-80">{error.message}</p>
        <p className="mt-4 text-xs text-white/50">
          Har du kørt SQL fra <code className="rounded bg-white/10 px-1">supabase/migrations</code>?
        </p>
      </div>
    );
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const recentFrom = now - sevenDaysMs;
  const previousFrom = now - sevenDaysMs * 2;

  const counts = new Map<string, number>();
  const recentCounts = new Map<string, number>();
  const previousRecentCounts = new Map<string, number>();
  for (const r of rows ?? []) {
    const row = r as { track_id: string; created_at: string | null };
    const id = row.track_id;
    counts.set(id, (counts.get(id) ?? 0) + 1);

    const ts = row.created_at ? Date.parse(row.created_at) : Number.NaN;
    if (!Number.isFinite(ts)) continue;

    if (ts >= recentFrom) {
      recentCounts.set(id, (recentCounts.get(id) ?? 0) + 1);
    } else if (ts >= previousFrom && ts < recentFrom) {
      previousRecentCounts.set(id, (previousRecentCounts.get(id) ?? 0) + 1);
    }
  }

  const totalPlays = [...counts.values()].reduce((a, b) => a + b, 0);
  const byRecentThenTotalThenTitle = (a: (typeof tracks)[number], b: (typeof tracks)[number]) => {
    const recentDiff = (recentCounts.get(b.id) ?? 0) - (recentCounts.get(a.id) ?? 0);
    if (recentDiff !== 0) return recentDiff;
    const totalDiff = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
    if (totalDiff !== 0) return totalDiff;
    return a.title.localeCompare(b.title, "da");
  };
  const byPreviousRecentThenTotalThenTitle = (
    a: (typeof tracks)[number],
    b: (typeof tracks)[number],
  ) => {
    const recentDiff =
      (previousRecentCounts.get(b.id) ?? 0) - (previousRecentCounts.get(a.id) ?? 0);
    if (recentDiff !== 0) return recentDiff;
    const totalDiff = (counts.get(b.id) ?? 0) - (counts.get(a.id) ?? 0);
    if (totalDiff !== 0) return totalDiff;
    return a.title.localeCompare(b.title, "da");
  };

  const recentRankById = new Map<string, number>();
  const previousRecentRankById = new Map<string, number>();
  [...tracks].sort(byRecentThenTotalThenTitle).forEach((t, i) => {
    recentRankById.set(t.id, i + 1);
  });
  [...tracks].sort(byPreviousRecentThenTotalThenTitle).forEach((t, i) => {
    previousRecentRankById.set(t.id, i + 1);
  });

  const topRecentTrack = [...tracks].sort(byRecentThenTotalThenTitle)[0];
  const topRecentCount = topRecentTrack ? recentCounts.get(topRecentTrack.id) ?? 0 : 0;
  const topRecentLabel =
    topRecentTrack && topRecentCount > 0
      ? `${topRecentTrack.title} (${topRecentCount})`
      : "Ingen afspilninger de sidste 7 dage";

  const stats: StatRow[] = tracks
    .map((t) => {
      const playCount = counts.get(t.id) ?? 0;
      const pct =
        totalPlays > 0
          ? Math.round((playCount / totalPlays) * 100)
          : 0;
      return {
        ...t,
        playCount,
        pct,
        rankDelta: (previousRecentRankById.get(t.id) ?? 0) - (recentRankById.get(t.id) ?? 0),
      };
    })
    .sort((a, b) => b.playCount - a.playCount);

  return (
    <AdminDashboard
      stats={stats}
      totalPlays={totalPlays}
      topRecentLabel={topRecentLabel}
    />
  );
}
