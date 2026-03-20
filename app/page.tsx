"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  subtitle: string;
  audioUrl: string;
  coverUrl: string;
};

const logoUrl =
  "https://lykkeliga.dk/wp-content/uploads/2025/12/lykkeliga_logo_blaa.svg";

const tracks: Track[] = [
  {
    id: "hop-hop-hop",
    title: "Hop hop hop",
    subtitle: "LykkeLiga",
    audioUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Hop-hop-hop.mp3",
    coverUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Hophophop.jpg",
  },
  {
    id: "nede-med-at-svede",
    title: "Nede med at svede",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Nede-med-at-svede.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Nedemedatsvede.jpg",
  },
  {
    id: "sammen-med-lars",
    title: "Sammen med Lars er vi superstars",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammen-med-Lars-er-vi-superstars.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammenmedlars.jpg",
  },
  {
    id: "scoresangen",
    title: "Scoresangen",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.mp3",
    coverUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.jpg",
  },
];

function formatTime(seconds: number) {
  if (!Number.isFinite(seconds)) return "0:00";
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60);
  return `${mins}:${secs.toString().padStart(2, "0")}`;
}

function IconButton({
  onClick,
  children,
  big = false,
  disabled = false,
}: {
  onClick: () => void;
  children: React.ReactNode;
  big?: boolean;
  disabled?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={[
        "inline-flex items-center justify-center rounded-full transition active:scale-95",
        big
          ? "h-14 w-14 bg-[#0B1B46] text-white shadow-lg"
          : "h-11 w-11 border border-slate-200 bg-white text-[#0B1B46] shadow-sm",
        disabled ? "cursor-not-allowed opacity-35" : "hover:opacity-90",
      ].join(" ")}
    >
      {children}
    </button>
  );
}

function TrackCard({
  track,
  isActive,
  isPlaying,
  onSelect,
}: {
  track: Track;
  isActive: boolean;
  isPlaying: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      onClick={onSelect}
      className={[
        "group overflow-hidden rounded-[28px] border bg-white text-left shadow-sm transition duration-200 hover:-translate-y-0.5 hover:shadow-md",
        isActive ? "border-[#0B1B46] ring-1 ring-[#0B1B46]/10" : "border-slate-200",
      ].join(" ")}
    >
      <div className="relative aspect-square overflow-hidden bg-slate-100">
        <img
          src={track.coverUrl}
          alt={track.title}
          className="h-full w-full object-cover transition duration-500 group-hover:scale-[1.02]"
        />
        <div className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/30 to-transparent" />

        {isActive && (
          <div className="absolute right-3 top-3 rounded-full bg-white/92 px-3 py-1 text-xs font-semibold text-[#0B1B46] shadow-sm">
            {isPlaying ? "Spiller" : "Valgt"}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="line-clamp-2 text-lg font-semibold leading-tight text-slate-900">
          {track.title}
        </div>
        <div className="mt-1 text-sm text-slate-500">{track.subtitle}</div>
      </div>
    </button>
  );
}

export default function Page() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [playAllMode, setPlayAllMode] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const currentTrack = tracks[currentIndex];

  const progressPercent = useMemo(() => {
    if (!duration || !Number.isFinite(duration)) return 0;
    return Math.min((currentTime / duration) * 100, 100);
  }, [currentTime, duration]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.audioUrl;
    audio.load();

    setCurrentTime(0);
    setDuration(0);

    if (isPlaying) {
      audio.play().catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentIndex, currentTrack.audioUrl, isPlaying]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const onTimeUpdate = () => setCurrentTime(audio.currentTime || 0);
    const onLoadedMetadata = () => setDuration(audio.duration || 0);
    const onEnded = () => {
      if (playAllMode && currentIndex < tracks.length - 1) {
        setCurrentIndex((prev) => prev + 1);
        setIsPlaying(true);
      } else if (playAllMode && currentIndex === tracks.length - 1) {
        setCurrentIndex(0);
        setIsPlaying(false);
        setPlayAllMode(false);
      } else {
        setIsPlaying(false);
      }
    };

    audio.addEventListener("timeupdate", onTimeUpdate);
    audio.addEventListener("loadedmetadata", onLoadedMetadata);
    audio.addEventListener("ended", onEnded);

    return () => {
      audio.removeEventListener("timeupdate", onTimeUpdate);
      audio.removeEventListener("loadedmetadata", onLoadedMetadata);
      audio.removeEventListener("ended", onEnded);
    };
  }, [currentIndex, playAllMode]);

  const togglePlayPause = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch {
        setIsPlaying(false);
      }
    }
  };

  const playTrack = async (index: number) => {
    setCurrentIndex(index);
    setPlayAllMode(false);
    setIsPlaying(true);
  };

  const playAll = async () => {
    setCurrentIndex(0);
    setPlayAllMode(true);
    setIsPlaying(true);
  };

  const prevTrack = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setIsPlaying(true);
    }
  };

  const nextTrack = () => {
    if (currentIndex < tracks.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setIsPlaying(true);
    }
  };

  const onSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const value = Number(e.target.value);
    const newTime = (value / 100) * duration;
    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  return (
    <main className="min-h-screen bg-[#F6F3EB] text-slate-900">
      <audio ref={audioRef} preload="metadata" />

      <div className="mx-auto max-w-7xl px-5 pb-40 pt-6 md:px-8 md:pt-10">
        <header className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <img
              src={logoUrl}
              alt="LykkeLiga logo"
              className="h-11 w-auto md:h-12"
            />
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Musik
              </div>
              <div className="text-xl font-semibold tracking-tight text-[#0B1B46] md:text-2xl">
                LykkeLiga JukeBox
              </div>
            </div>
          </div>

          <div className="hidden rounded-full border border-slate-200 bg-white px-4 py-2 text-sm text-slate-500 md:block">
            {tracks.length} numre
          </div>
        </header>

        <section className="grid gap-8 rounded-[36px] border border-slate-200 bg-white p-6 shadow-sm md:grid-cols-[1.1fr_0.9fr] md:p-8 lg:p-10">
          <div className="flex flex-col justify-between">
            <div>
              <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-600">
                LykkeLiga Musik
              </div>

              <h1 className="mt-5 max-w-3xl text-4xl font-semibold tracking-tight text-[#0B1B46] md:text-6xl">
                Et sted for alle jeres sange
              </h1>

              <p className="mt-5 max-w-2xl text-base leading-8 text-slate-600 md:text-lg">
                Spil en enkelt sang, eller lad LykkeLiga JukeBox køre videre gennem hele samlingen.
              </p>
            </div>

            <div className="mt-8 flex flex-wrap gap-3">
              <button
                onClick={playAll}
                className="rounded-full bg-[#0B1B46] px-6 py-3 text-base font-semibold text-white shadow-md transition hover:opacity-90 active:scale-[0.99]"
              >
                Spil alle
              </button>

              <button
                onClick={togglePlayPause}
                className="rounded-full border border-slate-200 bg-white px-6 py-3 text-base font-semibold text-[#0B1B46] transition hover:bg-slate-50 active:scale-[0.99]"
              >
                {isPlaying ? "Pause" : "Afspil"}
              </button>
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-[0.9fr_1.1fr]">
            <div className="overflow-hidden rounded-[28px] bg-slate-100 shadow-sm">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="aspect-square h-full w-full object-cover"
              />
            </div>

            <div className="flex flex-col justify-between rounded-[28px] bg-[#0B1B46] p-6 text-white shadow-sm">
              <div>
                <div className="text-sm text-white/70">Spiller nu</div>
                <h2 className="mt-4 text-3xl font-semibold leading-tight">
                  {currentTrack.title}
                </h2>
                <p className="mt-2 text-white/75">{currentTrack.subtitle}</p>
              </div>

              <div className="mt-8">
                <div className="rounded-2xl bg-white/10 px-4 py-3 text-sm text-white/85">
                  {playAllMode ? "Playlist er slået til" : "Ét nummer ad gangen"}
                </div>
              </div>
            </div>
          </div>
        </section>

        <section className="mt-10">
          <div className="mb-5 flex items-end justify-between">
            <div>
              <div className="text-sm uppercase tracking-[0.2em] text-slate-500">
                Samling
              </div>
              <h2 className="mt-2 text-3xl font-semibold tracking-tight text-[#0B1B46]">
                Sange
              </h2>
            </div>

            <div className="hidden text-sm text-slate-500 md:block">
              {tracks.length} udgivelser
            </div>
          </div>

          <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
            {tracks.map((track, index) => (
              <TrackCard
                key={track.id}
                track={track}
                isActive={index === currentIndex}
                isPlaying={index === currentIndex && isPlaying}
                onSelect={() => playTrack(index)}
              />
            ))}
          </div>
        </section>
      </div>

      <div className="fixed inset-x-0 bottom-0 z-50 border-t border-slate-200 bg-white/95 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1.25fr_0.9fr_1.1fr] md:items-center">
            <div className="flex min-w-0 items-center gap-4">
              <img
                src={currentTrack.coverUrl}
                alt={currentTrack.title}
                className="h-16 w-16 shrink-0 rounded-2xl object-cover shadow-sm"
              />

              <div className="min-w-0">
                <div className="truncate text-lg font-semibold text-[#0B1B46]">
                  {currentTrack.title}
                </div>
                <div className="truncate text-sm text-slate-500">
                  {currentTrack.subtitle}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <IconButton onClick={prevTrack} disabled={currentIndex === 0}>
                ⏮
              </IconButton>

              <IconButton onClick={togglePlayPause} big>
                {isPlaying ? "⏸" : "▶"}
              </IconButton>

              <IconButton
                onClick={nextTrack}
                disabled={currentIndex === tracks.length - 1}
              >
                ⏭
              </IconButton>
            </div>

            <div>
              <div className="mb-2 flex items-center justify-between text-sm text-slate-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>

              <input
                type="range"
                min={0}
                max={100}
                value={progressPercent}
                onChange={onSeek}
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-[#0B1B46]"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{playAllMode ? "Playlist aktiv" : "Ét nummer"}</span>
                <button
                  onClick={() => setPlayAllMode((prev) => !prev)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700 transition hover:bg-slate-200"
                >
                  {playAllMode ? "Slå playlist fra" : "Slå playlist til"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
