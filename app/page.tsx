"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { Radio } from "lucide-react";

type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

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

function PrevIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M7 6h2v12H7zM18 7.5 10.5 12 18 16.5z" />
    </svg>
  );
}

function NextIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current">
      <path d="M15 6h2v12h-2zM6 7.5 13.5 12 6 16.5z" />
    </svg>
  );
}

function PlayIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M8 6.5v11l9-5.5z" />
    </svg>
  );
}

function PauseIcon() {
  return (
    <svg viewBox="0 0 24 24" className="h-5 w-5 fill-current">
      <path d="M7 6h4v12H7zm6 0h4v12h-4z" />
    </svg>
  );
}

function RadioToggle({
  checked,
  onChange,
  id,
  "aria-label": ariaLabel,
}: {
  checked: boolean;
  onChange: () => void;
  id?: string;
  "aria-label"?: string;
}) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      id={id}
      aria-label={ariaLabel ?? "LykkeRadio"}
      onClick={onChange}
      className={[
        "relative h-9 w-14 shrink-0 rounded-full transition-colors duration-200",
        "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#0B1B46]",
        checked
          ? "bg-[#7CFF6B] shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_4px_14px_rgba(124,255,107,0.35)]"
          : "bg-slate-300/90",
      ].join(" ")}
    >
      <span
        className={[
          "absolute left-1 top-1 h-7 w-7 rounded-full bg-white shadow-[0_2px_6px_rgba(0,0,0,0.18)] ring-1 ring-black/5 transition-transform duration-200 ease-out",
          checked ? "translate-x-5" : "translate-x-0",
        ].join(" ")}
      />
    </button>
  );
}

function ProgressBar({
  value,
  onChange,
}: {
  value: number;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}) {
  return (
    <div className="relative flex h-7 w-full items-center">
      <div
        className="pointer-events-none absolute inset-x-0 top-1/2 h-1.5 -translate-y-1/2 rounded-full bg-white/10"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute left-0 top-1/2 h-1.5 -translate-y-1/2 rounded-l-full bg-[#7CFF6B] transition-[width] duration-150 ease-linear"
        style={{
          width: `${value}%`,
          borderRadius: value >= 99.5 ? "9999px" : undefined,
        }}
        aria-hidden
      />
      <input
        type="range"
        min={0}
        max={100}
        step={0.1}
        value={value}
        onChange={onChange}
        className="juke-progress relative z-10 w-full cursor-pointer"
      />
    </div>
  );
}

function ControlButton({
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
          ? "h-12 w-12 bg-[#7CFF6B] text-[#08132C] shadow-[0_8px_24px_rgba(124,255,107,0.35)]"
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
  const nextInRadio = tracks[(index + 1) % tracks.length];

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

    const onTime = () => setTime(audio.currentTime || 0);
    const onMeta = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (radioMode) {
        setIndex((prev) => (prev + 1) % tracks.length);
        setPlaying(true);
      } else {
        setPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTime);
    audio.addEventListener("loadedmetadata", onMeta);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTime);
      audio.removeEventListener("loadedmetadata", onMeta);
      audio.removeEventListener("ended", onEnded);
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

  const prev = () => {
    setIndex((prev) => (prev - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  };

  const next = () => {
    setIndex((prev) => (prev + 1) % tracks.length);
    setPlaying(true);
  };

  const selectTrack = (i: number) => {
    setIndex(i);
    setRadioMode(false);
    setPlaying(true);
  };

  const toggleRadio = async () => {
    const audio = audioRef.current;
    const nextMode = !radioMode;
    setRadioMode(nextMode);

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
    <main className="flex h-[100dvh] flex-col overflow-hidden bg-[#F5F0E6] text-slate-900">
      <audio ref={audioRef} preload="metadata" />

      <div className="safe-area-top flex min-h-0 flex-1 flex-col overflow-hidden">
        <header className="shrink-0 px-5 pt-7 text-center">
          <h1 className="text-[28px] font-semibold tracking-[-0.04em] text-[#0B1B46] md:text-[36px]">
            LykkeLiga JukeBox
          </h1>

          <div className="mt-5 flex flex-col items-center gap-3 px-5">
            <div className="flex w-full max-w-md flex-wrap items-center justify-center gap-x-4 gap-y-2">
              <div className="flex items-center gap-2">
                <Radio
                  className="h-6 w-6 shrink-0 text-[#0B1B46]"
                  strokeWidth={2}
                  aria-hidden
                />
                <span className="text-[17px] font-semibold tracking-[-0.03em] text-[#0B1B46]">
                  LykkeLiga Radio
                </span>
              </div>
              <RadioToggle
                checked={radioMode}
                onChange={toggleRadio}
                id="lykke-radio-toggle"
                aria-label={
                  radioMode ? "Sluk LykkeRadio" : "Tænd LykkeRadio"
                }
              />
            </div>
            <p className="max-w-[min(100%,22rem)] text-center text-[13px] leading-snug text-[#0B1B46]/70">
              Tænd for LykkeRadioen - så spiller den lykkelige musik i
              uendelighed
            </p>
          </div>
        </header>

        <section className="flex min-h-0 flex-1 flex-col justify-center pt-4">
          <div
            ref={stripRef}
            className="scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto px-[11vw] pb-3"
          >
            {tracks.map((track, i) => {
              const active = i === index;

              return (
                <button
                  key={track.id}
                  data-index={i}
                  onClick={() => selectTrack(i)}
                  className="w-[68vw] max-w-[300px] shrink-0 snap-center text-left"
                >
                  <div
                    className={[
                      "overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(11,27,70,0.08)] ring-1 ring-black/5 transition duration-300",
                      active
                        ? "scale-100 opacity-100"
                        : "scale-[0.93] opacity-60",
                    ].join(" ")}
                  >
                    <div className="aspect-square overflow-hidden">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        className="h-full w-full object-cover"
                      />
                    </div>
                  </div>

                  <div className="px-1 pb-1 pt-4">
                    <div className="line-clamp-2 text-[18px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0B1B46]">
                      {track.title}
                    </div>
                    <div className="mt-1.5 text-[14px] leading-snug text-slate-500">
                      Kunstner: {track.artist}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>
      </div>

      <div className="safe-area-bottom shrink-0 border-t border-slate-200 bg-[#08132C] text-white">
        <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center gap-3">
              <img
                src={current.coverUrl}
                alt={current.title}
                className="h-12 w-12 shrink-0 rounded-xl object-cover"
              />

              <div className="min-w-0 flex-1">
                <div className="truncate text-[15px] font-semibold leading-tight tracking-[-0.02em] text-white">
                  {current.title}
                </div>
                <div className="mt-0.5 truncate text-[13px] text-white/65">
                  {current.artist}
                </div>
              </div>

              <div className="flex items-center gap-2">
                <ControlButton onClick={prev}>
                  <PrevIcon />
                </ControlButton>
                <ControlButton onClick={togglePlay} primary>
                  {playing ? <PauseIcon /> : <PlayIcon />}
                </ControlButton>
                <ControlButton onClick={next}>
                  <NextIcon />
                </ControlButton>
              </div>
            </div>

            <div className="mt-3">
              <div className="mb-1.5 flex items-center justify-between text-[11px] text-white/55">
                <span>{formatTime(time)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <ProgressBar value={progress} onChange={seek} />

              <div className="mt-2 flex items-center gap-2 text-[11px] leading-none text-white/55">
                <span className="shrink-0">
                  {radioMode ? "Radio aktiv" : "Ét nummer"}
                </span>
                {radioMode ? (
                  <p
                    className="min-w-0 flex-1 truncate text-right text-white/80"
                    aria-live="polite"
                  >
                    <span className="text-white/40">Næste · </span>
                    <span className="font-medium text-white">
                      {nextInRadio.title}
                    </span>
                    <span className="text-white/40"> · </span>
                    <span className="text-white/55">{nextInRadio.artist}</span>
                  </p>
                ) : (
                  <span className="min-w-0 flex-1" aria-hidden />
                )}
                <span
                  className="inline-flex shrink-0 items-center justify-center"
                  title={radioMode ? "Radio til" : "Radio fra"}
                  aria-hidden
                >
                  <Radio
                    className={[
                      "h-5 w-5 transition-colors duration-200",
                      radioMode
                        ? "text-[#7CFF6B] drop-shadow-[0_0_10px_rgba(124,255,107,0.45)]"
                        : "text-white/25",
                    ].join(" ")}
                    strokeWidth={2}
                    aria-hidden
                  />
                </span>
              </div>
            </div>
          </div>
        </div>
    </main>
  );
}
