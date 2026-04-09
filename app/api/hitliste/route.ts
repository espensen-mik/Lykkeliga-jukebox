import { NextResponse } from "next/server";
import { tracks } from "@/lib/tracks";
import { createServiceSupabase } from "@/lib/supabase/service";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

type HitlisteItem = {
  id: string;
  title: string;
  artist: string;
  isRising: boolean;
};

function shuffledByTies(entries: Array<[string, number]>) {
  return entries.sort((a, b) => {
    if (b[1] !== a[1]) return b[1] - a[1];
    return Math.random() - 0.5;
  });
}

export async function GET() {
  const admin = createServiceSupabase();
  if (!admin) {
    return NextResponse.json(
      { ok: false, error: "Supabase is not configured" },
      { status: 503 },
    );
  }

  const now = Date.now();
  const sevenDaysMs = 7 * 24 * 60 * 60 * 1000;
  const currentFrom = new Date(now - sevenDaysMs);
  const previousFrom = new Date(now - sevenDaysMs * 2);

  const [{ data: currentRows, error: currentError }, { data: previousRows, error: previousError }] =
    await Promise.all([
      admin
        .from("track_plays")
        .select("track_id")
        .gte("created_at", currentFrom.toISOString()),
      admin
        .from("track_plays")
        .select("track_id")
        .gte("created_at", previousFrom.toISOString())
        .lt("created_at", currentFrom.toISOString()),
    ]);

  if (currentError || previousError) {
    return NextResponse.json(
      {
        ok: false,
        error:
          currentError?.message ??
          previousError?.message ??
          "Could not read track_plays",
      },
      { status: 500 },
    );
  }

  const validIds = new Set(tracks.map((t) => t.id));
  const currentCounts = new Map<string, number>();
  const previousCounts = new Map<string, number>();

  for (const row of currentRows ?? []) {
    const id = (row as { track_id: string }).track_id;
    if (!validIds.has(id)) continue;
    currentCounts.set(id, (currentCounts.get(id) ?? 0) + 1);
  }

  for (const row of previousRows ?? []) {
    const id = (row as { track_id: string }).track_id;
    if (!validIds.has(id)) continue;
    previousCounts.set(id, (previousCounts.get(id) ?? 0) + 1);
  }

  const currentRanking = shuffledByTies([...currentCounts.entries()]);
  const previousRanking = shuffledByTies([...previousCounts.entries()]);

  const currentRankById = new Map<string, number>();
  const previousRankById = new Map<string, number>();

  currentRanking.forEach(([id], idx) => currentRankById.set(id, idx + 1));
  previousRanking.forEach(([id], idx) => previousRankById.set(id, idx + 1));

  const top = currentRanking.slice(0, 5);
  const items: HitlisteItem[] = top.map(([id]) => {
    const track = tracks.find((t) => t.id === id);
    const currentRank = currentRankById.get(id) ?? Number.MAX_SAFE_INTEGER;
    const previousRank = previousRankById.get(id);
    return {
      id,
      title: track?.title ?? id,
      artist: track?.artist ?? "Ukendt",
      isRising: typeof previousRank === "number" && currentRank < previousRank,
    };
  });

  return NextResponse.json({
    ok: true,
    items,
    periodDays: 7,
  });
}
