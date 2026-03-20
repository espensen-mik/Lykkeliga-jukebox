"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

const logoUrl =
  "https://lykkeliga.dk/wp-content/uploads/2025/12/lykkeliga_logo_blaa.svg";

const tracks: Track[] = [
  {
    id: "hop-hop-hop",
    title: "Hop hop hop",
    artist: "LykkeLiga",
    audioUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Hop-hop-hop.mp3",
    coverUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Hophophop.jpg",
  },
  {
    id: "nede-med-at-svede",
    title: "Nede med at svede",
    artist: "TMS Ringsted",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Nede-med-at-svede.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Nedemedatsvede.jpg",
  },
  {
    id: "sammen-med-lars",
    title: "Sammen med Lars er vi superstars",
    artist: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammen-med-Lars-er-vi-superstars.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammenmedlars.jpg",
  },
  {
    id: "scoresangen",
    title: "Scoresangen",
    artist: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.mp3",
    coverUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.jpg",
  },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}

function PlayerButton({
  onClick,
  children,
  primary = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  primary?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={[
        "inline-flex items-center justify-center rounded-full transition active:scale-95",
        primary
          ? "h-12 w-12 bg-[#7CFF6B] text-[#071126] shadow-[0_8px_20px_rgba(124,255,107,0.35)]"
          : "h-10 w-10 bg-white/8 text-white ring-1 ring-white/10 hover:bg-white/12",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

export default function Page() {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const stripRef = useRef<HTMLDivElement | null>(null);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [radioMode, setRadioMode] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const current = tracks[index];

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = current.audioUrl;
    audio.load();
    setTime(0);

    if (playing) {
      audio.play().catch(() => setPlaying(false));
    }
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setTime(audio.currentTime || 0);
    const meta = () => setDuration(audio.duration || 0);
    const ended = () => {
      if (radioMode) {
        setIndex((prev) => (prev + 1) % tracks.length);
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", update);
    audio.addEventListener("loadedmetadata", meta);
    audio.addEventListener("ended", ended);

    return () => {
      audio.removeEventListener("timeupdate", update);
      audio.removeEventListener("loadedmetadata", meta);
      audio.removeEventListener("ended", ended);
    };
  }, [radioMode]);

  useEffect(() => {
    const strip = stripRef.current;
    if (!strip) return;

    const card = strip.querySelector<HTMLElement>(`[data-index="${index}"]`);
    if (!card) return;

    const left = card.offsetLeft - (strip.clientWidth - card.clientWidth) / 2;
    strip.scrollTo({ left, behavior: "smooth" });
  }, [index]);

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % tracks.length);
    setPlaying(true);
  };

  const prev = () => {
    setIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  };

  const selectTrack = async (i: number) => {
    setIndex(i);
    setRadioMode(false);
    setPlaying(true);
  };

  const toggleRadio = async () => {
    const audio = audioRef.current;
    const nextValue = !radioMode;
    setRadioMode(nextValue);

    if (!playing && audio) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    }
  };

  const progress = useMemo(() => {
    if (!duration) return 0;
    return Math.min((time / duration) * 100, 100);
  }, [time, duration]);

  const seek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const pct = Number(e.target.value);
    const nextTime = (pct / 100) * duration;
    audio.currentTime = nextTime;
    setTime(nextTime);
  };

  return (
    <main className="min-h-screen bg-[#F6F3EB] text-slate-900">
      <audio ref={audioRef} preload="metadata" />

      <div className="mx-auto max-w-6xl px-5 pb-44 pt-7 md:px-8 md:pt-10">
        <header className="mb-8 text-center">
          <div className="flex justify-center">
            <h1 className="text-[36px] font-semibold leading-[0.95] tracking-[-0.04em] text-[#0B1B46] md:text-[56px]">
              LykkeLiga JukeBox
            </h1>
          </div>

          <div className="mt-4 flex justify-center">
            <button
              onClick={toggleRadio}
              className={[
                "rounded-full px-5 py-2.5 text-sm font-semibold tracking-[-0.01em] transition active:scale-[0.99]",
                radioMode
                  ? "bg-[#0B1B46] text-white"
                  : "bg-[#7CFF6B] text-[#071126] shadow-[0_10px_24px_rgba(124,255,107,0.25)]",
              ].join(" ")}
            >
              {radioMode ? "Stop LykkeLiga Radio" : "LykkeLiga Radio"}
            </button>
          </div>
        </header>

        <section>
          <div
            ref={stripRef}
            className="scrollbar-none -mx-5 flex snap-x snap-mandatory gap-4 overflow-x-auto px-5 pb-4 md:-mx-8 md:px-8"
          >
            {tracks.map((track, i) => {
              const active = i === index;

              return (
                <button
                  key={track.id}
                  data-index={i}
                  onClick={() => selectTrack(i)}
                  className="w-[78vw] max-w-[320px] shrink-0 snap-center text-left"
                >
                  <div
                    className={[
                      "overflow-hidden rounded-[28px] bg-white shadow-[0_10px_28px_rgba(11,27,70,0.08)] ring-1 ring-black/5 transition duration-300",
                      active
                        ? "scale-100 opacity-100"
                        : "scale-[0.96] opacity-80",
                    ].join(" ")}
                  >
                    <div className="aspect-square overflow-hidden bg-slate-100">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="px-1 pb-1 pt-4">
                    <div className="line-clamp-2 text-[20px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0B1B46] md:text-[24px]">
                      {track.title}
                    </div>
                    <div className="mt-1.5 text-[15px] leading-snug text-slate-500">
                      Kunstner: {track.artist}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <section className="mt-2 rounded-[28px] border border-slate-200/80 bg-white/80 p-5 shadow-sm backdrop-blur md:p-6">
          <div className="grid gap-5 md:grid-cols-[0.9fr_1.1fr] md:items-center">
            <div className="overflow-hidden rounded-[24px] shadow-sm ring-1 ring-black/5">
              <img
                src={current.coverUrl}
                alt={current.title}
                className="aspect-square w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between">
              <div>
                <div className="text-[11px] uppercase tracking-[0.24em] text-slate-500">
                  Nu spiller
                </div>
                <h2 className="mt-3 text-[30px] font-semibold leading-[0.98] tracking-[-0.04em] text-[#0B1B46] md:text-[46px]">
                  {current.title}
                </h2>
                <p className="mt-3 text-[16px] text-slate-500 md:text-[18px]">
                  Kunstner: {current.artist}
                </p>
              </div>

              <div className="mt-5 rounded-2xl bg-[#0B1B46] px-4 py-3 text-[13px] leading-relaxed text-white/90">
                {radioMode
                  ? "LykkeLiga Radio spiller numrene videre automatisk."
                  : "Vælg et cover for at spille et nummer."}
              </div>
            </div>
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-[#08132C] text-white shadow-[0_-10px_30px_rgba(0,0,0,0.15)]">
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1.4fr_0.9fr_1.1fr] md:items-center">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src={current.coverUrl}
                alt={current.title}
                className="h-14 w-14 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="truncate text-[17px] font-semibold leading-tight tracking-[-0.02em] text-white">
                  {current.title}
                </div>
                <div className="mt-0.5 truncate text-[14px] text-white/65">
                  {current.artist}
                </div>
              </div>

              <img
                src={logoUrl}
                alt="LykkeLiga logo"
                className="hidden h-7 w-auto opacity-90 md:block"
              />
            </div>

            <div className="flex items-center justify-center gap-3">
              <PlayerButton onClick={prev}>⏮</PlayerButton>
              <PlayerButton onClick={togglePlay} primary>
                {playing ? "⏸" : "▶"}
              </PlayerButton>
              <PlayerButton onClick={next}>⏭</PlayerButton>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-[12px] text-white/55">
                <span>{formatTime(time)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={progress}
                onChange={seek}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-white/10 accent-[#7CFF6B]"
              />

              <div className="mt-3 flex items-center justify-between text-[12px] text-white/55">
                <span>{radioMode ? "Radio aktiv" : "Ét nummer"}</span>
                <button
                  onClick={toggleRadio}
                  className={[
                    "rounded-full px-3 py-1.5 font-medium transition",
                    radioMode
                      ? "bg-[#7CFF6B] text-[#071126]"
                      : "bg-white/8 text-white hover:bg-white/12",
                  ].join(" ")}
                >
                  {radioMode ? "Stop radio" : "Radio"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
