import type { Track } from "@/lib/tracks";
import {
  Activity,
  ArrowDown,
  ArrowUp,
  BarChart3,
  Disc3,
  Music2,
  Sparkles,
  Trophy,
} from "lucide-react";

/** Keep in sync with `ICON_VERSION` in `app/layout.tsx` (favicon cache-bust). */
const APP_ICON_SRC = "/icon.png?v=3";

export type StatRow = Track & { playCount: number; pct: number; rankDelta: number };

export function AdminDashboard({
  stats,
  totalPlays,
  topRecentLabel,
}: {
  stats: StatRow[];
  totalPlays: number;
  topRecentLabel: string;
}) {
  const topTrack = stats[0];
  const topLabel =
    topTrack && topTrack.playCount > 0
      ? topTrack.title
      : "Ingen afspilninger endnu";

  return (
    <div className="relative min-h-screen overflow-x-hidden bg-[#040814] text-white">
      {/* Ambient layers */}
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(124,255,107,0.12),transparent_55%)]"
      />
      <div
        aria-hidden
        className="pointer-events-none fixed inset-0 bg-[radial-gradient(ellipse_80%_50%_at_100%_50%,rgba(59,130,246,0.08),transparent_50%)]"
      />
      <div
        aria-hidden
        className="fixed inset-0 opacity-[0.35] [background-image:linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] [background-size:64px_64px]"
      />

      <div className="relative mx-auto max-w-6xl px-4 pb-12 pt-10 sm:px-6 lg:px-10 lg:pb-16 lg:pt-14">
        {/* Hero */}
        <header className="mb-10 lg:mb-14">
          <div className="grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10">
            <div className="lg:col-span-7">
              <div className="flex flex-col gap-5 sm:flex-row sm:items-start sm:gap-6">
                <div className="shrink-0">
                  <img
                    src={APP_ICON_SRC}
                    alt="LykkeMusik"
                    width={56}
                    height={56}
                    className="h-14 w-14 rounded-2xl border border-white/[0.1] bg-white/[0.04] object-cover shadow-[0_12px_40px_rgba(0,0,0,0.35)] ring-1 ring-white/[0.06]"
                  />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="inline-flex items-center gap-2 rounded-full border border-white/[0.08] bg-white/[0.04] px-3 py-1.5 backdrop-blur-md">
                    <BarChart3
                      className="h-3.5 w-3.5 text-[#7CFF6B]"
                      strokeWidth={2}
                      aria-hidden
                    />
                    <span className="text-[10px] font-semibold uppercase tracking-[0.22em] text-white/55">
                      LykkeMusik · admin
                    </span>
                  </div>

                  <h1 className="mt-5 text-[2rem] font-semibold leading-[1.08] tracking-[-0.03em] text-white sm:text-4xl lg:text-[2.75rem]">
                    Afspilningsstatistik
                  </h1>

                  <p className="mt-4 max-w-[34rem] text-[15px] leading-[1.65] text-white/48 sm:text-base">
                    Live overblik over, hvor ofte hvert nummer er blevet startet.
                    Hver gang en sang begynder at spille, tæller vi én gang for det
                    pågældende nummer — enkel og retvisende indsigt i jeres
                    LykkeMusik-brug.
                  </p>

                  <div className="mt-6 flex flex-wrap items-center gap-4 text-[13px] text-white/38">
                    <span className="inline-flex items-center gap-2">
                      <Music2 className="h-4 w-4 text-[#7CFF6B]/70" strokeWidth={1.75} />
                      {stats.length} numre i kataloget
                    </span>
                    <span className="hidden h-1 w-1 rounded-full bg-white/20 sm:inline" />
                    <span className="inline-flex items-center gap-2">
                      <Disc3 className="h-4 w-4 text-[#7CFF6B]/70" strokeWidth={1.75} />
                      Opdateret pr. sidevisning
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-col gap-4 lg:col-span-5">
              {/* Primary KPI */}
              <div className="relative overflow-hidden rounded-3xl border border-white/[0.1] bg-gradient-to-br from-white/[0.09] to-white/[0.02] p-6 shadow-[0_24px_80px_rgba(0,0,0,0.45),inset_0_1px_0_rgba(255,255,255,0.06)] backdrop-blur-xl sm:p-7">
                <div
                  aria-hidden
                  className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-[#7CFF6B]/15 blur-3xl"
                />
                <div className="relative flex items-start justify-between gap-4">
                  <div>
                    <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/40">
                      Total afspilninger
                    </p>
                    <p className="mt-3 text-5xl font-semibold tabular-nums tracking-tight text-white sm:text-6xl">
                      {totalPlays}
                    </p>
                    <p className="mt-2 text-[13px] text-white/45">
                      Alle starts siden målingen begyndte
                    </p>
                  </div>
                  <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl border border-[#7CFF6B]/25 bg-[#7CFF6B]/10 text-[#7CFF6B]">
                    <Activity className="h-6 w-6" strokeWidth={1.75} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                <div className="relative overflow-hidden rounded-2xl border border-[#7CFF6B]/20 bg-gradient-to-br from-[#7CFF6B]/[0.12] via-[#7CFF6B]/[0.06] to-white/[0.02] px-5 py-5 backdrop-blur-md">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-[#7CFF6B]/15 blur-2xl"
                  />
                  <p className="relative flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-[#c7ffbe]">
                    <Trophy className="h-3 w-3 text-[#7CFF6B]" strokeWidth={2} />
                    Mest afspillet total
                  </p>
                  <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    Alle afspilninger
                  </p>
                  <p className="relative mt-2 line-clamp-2 text-[17px] font-semibold leading-snug text-white">
                    {topLabel}
                  </p>
                </div>
                <div className="relative overflow-hidden rounded-2xl border border-blue-300/[0.22] bg-gradient-to-br from-blue-400/[0.13] via-blue-300/[0.06] to-white/[0.02] px-5 py-5 backdrop-blur-md">
                  <div
                    aria-hidden
                    className="pointer-events-none absolute -right-6 -top-6 h-20 w-20 rounded-full bg-blue-300/20 blur-2xl"
                  />
                  <p className="relative flex items-center gap-1.5 text-[10px] font-semibold uppercase tracking-[0.16em] text-blue-100/95">
                    <Sparkles className="h-3 w-3 text-blue-200" strokeWidth={2} />
                    Mest afspillet 7 dage
                  </p>
                  <p className="relative mt-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-white/55">
                    Seneste uge
                  </p>
                  <p className="relative mt-2 line-clamp-2 text-[17px] font-semibold leading-snug text-white">
                    {topRecentLabel}
                  </p>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Desktop / tablet table */}
        <section
          className="hidden overflow-hidden rounded-[1.75rem] border border-white/[0.09] bg-white/[0.04] shadow-[0_32px_120px_rgba(0,0,0,0.5)] backdrop-blur-xl md:block"
          aria-label="Afspilninger pr. nummer"
        >
          <div className="flex flex-col gap-1 border-b border-white/[0.06] px-6 py-5 sm:px-8 sm:py-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <h2 className="text-lg font-semibold tracking-tight text-white/95">
                Alle numre
              </h2>
              <p className="mt-1 text-[13px] text-white/40">
                Rangeret efter antal afspilninger. Andel = sangens del af alle
                afspilninger i alt.
              </p>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full min-w-[720px] border-collapse text-left">
              <thead>
                <tr className="text-[10px] font-semibold uppercase tracking-[0.14em] text-white/38">
                  <th className="w-16 px-6 py-4 pl-8 lg:pl-10">#</th>
                  <th className="px-4 py-4">Titel</th>
                  <th className="hidden w-[22%] px-4 py-4 lg:table-cell">Kunstner</th>
                  <th className="min-w-[220px] px-4 py-4 xl:min-w-[280px]">
                    Andel
                  </th>
                  <th className="w-32 px-6 py-4 pr-8 text-right tabular-nums lg:pr-10">
                    Antal
                  </th>
                </tr>
              </thead>
              <tbody>
                {stats.map((row, i) => {
                  const isTop = i === 0 && row.playCount > 0;
                  return (
                    <tr
                      key={row.id}
                      className={[
                        "group border-t border-white/[0.05] transition-colors duration-200",
                        isTop
                          ? "bg-gradient-to-r from-[#7CFF6B]/[0.07] via-transparent to-transparent"
                          : "hover:bg-white/[0.03]",
                      ].join(" ")}
                    >
                      <td className="px-6 py-5 pl-8 align-middle lg:pl-10">
                        <span
                          className={[
                            "inline-flex h-9 min-w-[2.25rem] items-center justify-center rounded-xl text-sm font-semibold tabular-nums",
                            isTop
                              ? "border border-[#7CFF6B]/30 bg-[#7CFF6B]/15 text-[#7CFF6B] shadow-[0_0_20px_rgba(124,255,107,0.12)]"
                              : "border border-white/[0.06] bg-white/[0.04] text-white/55",
                          ].join(" ")}
                        >
                          {i + 1}
                        </span>
                      </td>
                      <td className="max-w-[12rem] px-4 py-5 align-middle font-medium text-white/95 lg:max-w-none">
                        <div className="flex items-center gap-2">
                          <span className="truncate">{row.title}</span>
                          {row.rankDelta > 0 ? (
                            <span
                              className="inline-flex shrink-0 items-center rounded-full border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-1.5 py-0.5 text-[#7CFF6B]"
                              title={`Op ${row.rankDelta} plads${row.rankDelta > 1 ? "er" : ""} siden sidste afspilning`}
                            >
                              <ArrowUp className="h-3 w-3" strokeWidth={2.25} />
                            </span>
                          ) : null}
                          {row.rankDelta < 0 ? (
                            <span
                              className="inline-flex shrink-0 items-center rounded-full border border-red-400/35 bg-red-400/10 px-1.5 py-0.5 text-red-300"
                              title={`Ned ${Math.abs(row.rankDelta)} plads${Math.abs(row.rankDelta) > 1 ? "er" : ""} siden sidste afspilning`}
                            >
                              <ArrowDown className="h-3 w-3" strokeWidth={2.25} />
                            </span>
                          ) : null}
                        </div>
                      </td>
                      <td className="hidden px-4 py-5 align-middle text-[14px] text-white/42 lg:table-cell">
                        {row.artist}
                      </td>
                      <td className="px-4 py-5 align-middle">
                        <div className="flex items-center gap-3 lg:gap-4">
                          <div className="relative h-1.5 min-w-[100px] flex-1 overflow-hidden rounded-full bg-white/[0.07] lg:min-w-[160px]">
                            <div
                              className="h-full rounded-full bg-gradient-to-r from-[#5fd94f] via-[#7CFF6B] to-[#b4ff9e] shadow-[0_0_14px_rgba(124,255,107,0.28)] transition-[width] duration-500 ease-out"
                              style={{ width: `${row.pct}%` }}
                            />
                          </div>
                          <span className="w-11 shrink-0 text-right text-[11px] font-medium tabular-nums text-white/45">
                            {row.pct}%
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-5 pr-8 text-right align-middle lg:pr-10">
                        <span
                          className={[
                            "text-xl font-semibold tabular-nums lg:text-2xl",
                            row.playCount > 0 ? "text-[#7CFF6B]" : "text-white/25",
                          ].join(" ")}
                        >
                          {row.playCount}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>

        {/* Mobile: stacked cards */}
        <section
          className="space-y-3 md:hidden"
          aria-label="Afspilninger pr. nummer"
        >
          <div className="mb-4 px-1">
            <h2 className="text-lg font-semibold tracking-tight text-white/95">
              Alle numre
            </h2>
            <p className="mt-1 text-[13px] text-white/40">
              Rangeret efter antal. Andel = del af alle afspilninger i alt.
            </p>
          </div>
          {stats.map((row, i) => {
            const isTop = i === 0 && row.playCount > 0;
            return (
              <article
                key={row.id}
                className={[
                  "rounded-2xl border p-4 backdrop-blur-md transition-shadow duration-200",
                  isTop
                    ? "border-[#7CFF6B]/25 bg-gradient-to-br from-[#7CFF6B]/[0.1] to-white/[0.04] shadow-[0_0_32px_rgba(124,255,107,0.08)]"
                    : "border-white/[0.08] bg-white/[0.04] active:bg-white/[0.06]",
                ].join(" ")}
              >
                <div className="flex items-start justify-between gap-3">
                  <span
                    className={[
                      "inline-flex h-8 min-w-[2rem] items-center justify-center rounded-lg text-xs font-semibold tabular-nums",
                      isTop
                        ? "bg-[#7CFF6B]/20 text-[#7CFF6B]"
                        : "bg-white/[0.06] text-white/50",
                    ].join(" ")}
                  >
                    {i + 1}
                  </span>
                  <span
                    className={[
                      "text-2xl font-semibold tabular-nums",
                      row.playCount > 0 ? "text-[#7CFF6B]" : "text-white/25",
                    ].join(" ")}
                  >
                    {row.playCount}
                  </span>
                </div>
                <h3 className="mt-3 text-[15px] font-semibold leading-snug text-white/95">
                  <span className="inline-flex items-center gap-2">
                    <span>{row.title}</span>
                    {row.rankDelta > 0 ? (
                      <span
                        className="inline-flex items-center rounded-full border border-[#7CFF6B]/30 bg-[#7CFF6B]/10 px-1.5 py-0.5 text-[#7CFF6B]"
                        title={`Op ${row.rankDelta} plads${row.rankDelta > 1 ? "er" : ""} siden sidste afspilning`}
                      >
                        <ArrowUp className="h-3 w-3" strokeWidth={2.25} />
                      </span>
                    ) : null}
                    {row.rankDelta < 0 ? (
                      <span
                        className="inline-flex items-center rounded-full border border-red-400/35 bg-red-400/10 px-1.5 py-0.5 text-red-300"
                        title={`Ned ${Math.abs(row.rankDelta)} plads${Math.abs(row.rankDelta) > 1 ? "er" : ""} siden sidste afspilning`}
                      >
                        <ArrowDown className="h-3 w-3" strokeWidth={2.25} />
                      </span>
                    ) : null}
                  </span>
                </h3>
                <p className="mt-1 text-[13px] text-white/42">{row.artist}</p>
                <div className="mt-4 flex items-center gap-3">
                  <div className="relative h-1.5 min-h-[6px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-[#5fd94f] via-[#7CFF6B] to-[#b4ff9e] shadow-[0_0_12px_rgba(124,255,107,0.25)]"
                      style={{ width: `${row.pct}%` }}
                    />
                  </div>
                  <span className="shrink-0 text-[11px] font-medium tabular-nums text-white/45">
                    {row.pct}%
                  </span>
                </div>
              </article>
            );
          })}
        </section>

        <p className="mt-10 max-w-lg text-[13px] leading-relaxed text-white/32">
          Tip: Gem{" "}
          <code className="rounded-md border border-white/[0.08] bg-white/[0.06] px-2 py-0.5 text-[12px] text-white/55">
            /admin
          </code>{" "}
          som bogmærke på din computer.
        </p>

        <div className="mt-10 flex justify-center pb-2">
          <img
            src="/lykkeliga-logo.svg"
            alt="LykkeLiga"
            className="h-7 w-auto brightness-0 invert opacity-90"
          />
        </div>
      </div>
    </div>
  );
}
