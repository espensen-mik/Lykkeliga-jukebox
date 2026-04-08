import type { Track } from "@/lib/tracks";

export type StatRow = Track & { playCount: number; pct: number };

export function AdminDashboard({
  stats,
  totalPlays,
}: {
  stats: StatRow[];
  totalPlays: number;
}) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-[#050a14] via-[#0b1735] to-[#08132c] px-4 py-10 text-white">
      <div className="mx-auto max-w-3xl">
        <header className="mb-10">
          <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7CFF6B]/90">
            LykkeMusik
          </p>
          <h1 className="mt-1 text-3xl font-semibold tracking-tight text-white/95">
            Afspilningsstatistik
          </h1>
          <p className="mt-2 text-sm text-white/55">
            Samlet antal registrerede afspilninger:{" "}
            <span className="font-semibold text-[#7CFF6B]">{totalPlays}</span>
          </p>
        </header>

        <div className="space-y-3">
          {stats.map((row, i) => (
            <div
              key={row.id}
              className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.06] shadow-[0_12px_40px_rgba(0,0,0,0.25)] backdrop-blur-sm"
            >
              <div className="flex items-start gap-4 px-4 py-4 sm:px-5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[#7CFF6B]/15 text-sm font-bold text-[#7CFF6B]">
                  {i + 1}
                </div>
                <div className="min-w-0 flex-1">
                  <div className="font-semibold leading-snug text-white/95">
                    {row.title}
                  </div>
                  <div className="mt-0.5 text-sm text-white/50">{row.artist}</div>
                  <div className="mt-3 h-2.5 overflow-hidden rounded-full bg-white/10">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5ae84d] to-[#7CFF6B] transition-[width] duration-500 ease-out"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                </div>
                <div className="shrink-0 text-right">
                  <div className="text-2xl font-semibold tabular-nums text-[#7CFF6B]">
                    {row.playCount}
                  </div>
                  <div className="text-[11px] uppercase tracking-wide text-white/40">
                    afspilninger
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <p className="mt-10 text-center text-xs leading-relaxed text-white/35">
          Hvert afspilningsstart (når lyden begynder) tælles én gang pr. valgt
          nummer pr. session.
        </p>
      </div>
    </div>
  );
}
