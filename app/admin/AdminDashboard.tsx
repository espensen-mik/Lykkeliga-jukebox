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
    <div className="min-h-screen bg-gradient-to-br from-[#050a14] via-[#0b1735] to-[#08132c] text-white">
      {/* Desktop-first: komfortabel læsebredde på stor skærm */}
      <div className="mx-auto max-w-5xl px-8 py-10 lg:px-12 lg:py-12">
        <header className="mb-8 border-b border-white/10 pb-8">
          <div className="flex flex-col gap-2 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-[#7CFF6B]/90">
                LykkeMusik · admin
              </p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight text-white/95 lg:text-4xl">
                Afspilningsstatistik
              </h1>
              <p className="mt-3 max-w-xl text-[15px] leading-relaxed text-white/50">
                Oversigt over hvor ofte hvert nummer er startet (én tælling pr.
                afspilningsstart pr. valgt sang).
              </p>
            </div>
            <div className="mt-4 rounded-2xl border border-white/10 bg-white/[0.04] px-6 py-4 text-center lg:mt-0 lg:text-right">
              <p className="text-[11px] font-medium uppercase tracking-wider text-white/45">
                Total
              </p>
              <p className="mt-1 text-4xl font-semibold tabular-nums text-[#7CFF6B]">
                {totalPlays}
              </p>
              <p className="text-xs text-white/40">afspilninger</p>
            </div>
          </div>
        </header>

        {/* Tabel: bedst på desktop; stadig brugbar på mindre vinduer */}
        <div className="overflow-x-auto rounded-2xl border border-white/10 bg-white/[0.04] shadow-[0_20px_60px_rgba(0,0,0,0.35)]">
          <table className="w-full min-w-[640px] border-collapse text-left">
            <thead>
              <tr className="border-b border-white/10 text-[11px] font-semibold uppercase tracking-wider text-white/45">
                <th className="w-14 px-4 py-4 pl-5 lg:pl-6">#</th>
                <th className="px-4 py-4">Titel</th>
                <th className="hidden px-4 py-4 md:table-cell">Kunstner</th>
                <th className="min-w-[200px] px-4 py-4 lg:min-w-[280px]">
                  Andel
                </th>
                <th className="w-28 px-4 py-4 pr-5 text-right lg:w-32 lg:pr-6">
                  Antal
                </th>
              </tr>
            </thead>
            <tbody>
              {stats.map((row, i) => (
                <tr
                  key={row.id}
                  className="border-b border-white/[0.06] transition hover:bg-white/[0.03]"
                >
                  <td className="px-4 py-4 pl-5 align-middle lg:pl-6">
                    <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[#7CFF6B]/12 text-sm font-bold text-[#7CFF6B]">
                      {i + 1}
                    </span>
                  </td>
                  <td className="max-w-[14rem] px-4 py-4 align-middle lg:max-w-none">
                    <span className="font-medium text-white/95">{row.title}</span>
                  </td>
                  <td className="hidden px-4 py-4 align-middle text-[15px] text-white/50 md:table-cell">
                    {row.artist}
                  </td>
                  <td className="px-4 py-4 align-middle">
                    <div className="flex items-center gap-3">
                      <div className="h-2.5 min-w-[120px] flex-1 overflow-hidden rounded-full bg-white/10 lg:min-w-[200px]">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-[#5ae84d] to-[#7CFF6B]"
                          style={{ width: `${row.pct}%` }}
                        />
                      </div>
                      <span className="w-10 shrink-0 text-right text-xs tabular-nums text-white/40">
                        {row.pct}%
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-4 pr-5 text-right align-middle lg:pr-6">
                    <span className="text-xl font-semibold tabular-nums text-[#7CFF6B] lg:text-2xl">
                      {row.playCount}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-8 text-[13px] leading-relaxed text-white/35">
          Tip: Gem{" "}
          <code className="rounded bg-white/10 px-1.5 py-0.5 text-[12px] text-white/60">
            /admin
          </code>{" "}
          som bogmærke på din computer.
        </p>
      </div>
    </div>
  );
}
