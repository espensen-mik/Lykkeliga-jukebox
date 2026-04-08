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

  const { data: rows, error } = await admin.from("track_plays").select("track_id");
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

  const counts = new Map<string, number>();
  for (const r of rows ?? []) {
    const id = (r as { track_id: string }).track_id;
    counts.set(id, (counts.get(id) ?? 0) + 1);
  }

  const totalPlays = [...counts.values()].reduce((a, b) => a + b, 0);

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
      };
    })
    .sort((a, b) => b.playCount - a.playCount);

  return <AdminDashboard stats={stats} totalPlays={totalPlays} />;
}
