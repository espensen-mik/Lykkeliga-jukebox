"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";

type Track = {
  id: string;
  title: string;
  subtitle: string;
  audioUrl: string;
  color: string;
  emoji: string;
};

const tracks: Track[] = [
  {
    id: "hop-hop-hop",
    title: "Hop hop hop",
    subtitle: "LykkeLiga",
    audioUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Hop-hop-hop.mp3",
    color: "from-orange-400 to-pink-400",
    emoji: "🧡",
  },
  {
    id: "nede-med-at-svede",
    title: "Nede med at svede",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Nede-med-at-svede.mp3",
    color: "from-cyan-400 to-blue-500",
    emoji: "💦",
  },
  {
    id: "sammen-med-lars",
    title: "Sammen med Lars er vi superstars",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammen-med-Lars-er-vi-superstars.mp3",
    color: "from-fuchsia-400 to-purple-500",
    emoji: "⭐",
  },
  {
    id: "scoresangen",
    title: "Scoresangen",
    subtitle: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.mp3",
    color: "from-lime-400 to-emerald-500",
    emoji: "🥳",
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
          ? "h-16 w-16 bg-slate-900 text-white shadow-lg"
          : "h-12 w-12 bg-white text-slate-900 shadow-sm border border-slate-200",
        disabled ? "opacity-40 cursor-not-allowed" : "hover:opacity-90",
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
        "text-left rounded-[28px] overflow-hidden border shadow-sm bg-white transition hover:-translate-y-0.5 active:scale-[0.99]",
        isActive ? "border-slate-900 ring-2 ring-slate-900/10" : "border-slate-200",
      ].join(" ")}
    >
      <div className={`h-40 bg-gradient-to-br ${track.color} relative`}>
        <div className="absolute inset-0 flex items-center justify-center text-6xl">
          {track.emoji}
        </div>
        {isActive && (
          <div className="absolute top-3 right-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-slate-900">
            {isPlaying ? "Spiller" : "Valgt"}
          </div>
        )}
      </div>

      <div className="p-5">
        <div className="text-lg font-semibold leading-tight text-slate-900">
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
      audio
        .play()
        .then(() => {})
        .catch(() => {
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
    <main className="min-h-screen bg-gradient-to-b from-yellow-50 via-white to-pink-50 pb-44 text-slate-900">
      <audio ref={audioRef} preload="metadata" />

      <div className="mx-auto max-w-6xl px-5 py-6 md:px-8 md:py-10">
        <section className="rounded-[32px] bg-white border border-slate-200 shadow-sm overflow-hidden">
          <div className="grid gap-8 p-8 md:grid-cols-[1.2fr_0.8fr] md:p-10">
            <div>
              <div className="inline-flex rounded-full bg-slate-100 px-4 py-2 text-sm font-medium text-slate-700">
                LykkeLiga Musik
              </div>

              <h1 className="mt-4 text-4xl font-semibold tracking-tight text-slate-950 md:text-6xl">
                En glad lille jukebox
              </h1>

              <p className="mt-4 max-w-2xl text-base leading-7 text-slate-600 md:text-lg">
                Tryk på en sang og spil. Eller tryk på “Spil alle” og lad musikken køre.
              </p>

              <div className="mt-6 flex flex-wrap gap-3">
                <button
                  onClick={playAll}
                  className="rounded-full bg-slate-900 px-6 py-3 text-base font-semibold text-white shadow-lg transition hover:opacity-90 active:scale-[0.99]"
                >
                  Spil alle
                </button>

                <button
                  onClick={togglePlayPause}
                  className="rounded-full bg-slate-100 px-6 py-3 text-base font-semibold text-slate-900 transition hover:bg-slate-200 active:scale-[0.99]"
                >
                  {isPlaying ? "Pause" : "Play"}
                </button>
              </div>
            </div>

            <div className={`rounded-[28px] bg-gradient-to-br ${currentTrack.color} p-6 text-white shadow-inner`}>
              <div className="text-sm font-medium opacity-90">Spiller nu</div>
              <div className="mt-6 text-7xl">{currentTrack.emoji}</div>
              <div className="mt-6 text-2xl font-semibold leading-tight">
                {currentTrack.title}
              </div>
              <div className="mt-2 text-white/85">{currentTrack.subtitle}</div>

              <div className="mt-8 rounded-2xl bg-white/20 px-4 py-3 text-sm">
                {playAllMode ? "Playlist mode er slået til" : "Enkelt nummer"}
              </div>
            </div>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-2xl font-semibold tracking-tight">Sange</h2>
            <div className="text-sm text-slate-500">{tracks.length} numre</div>
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
        <div className="mx-auto max-w-6xl px-4 py-4 md:px-6">
          <div className="grid gap-4 md:grid-cols-[1.3fr_1fr_1.1fr] md:items-center">
            <div className="flex items-center gap-4 min-w-0">
              <div
                className={`h-16 w-16 shrink-0 rounded-2xl bg-gradient-to-br ${currentTrack.color} flex items-center justify-center text-3xl`}
              >
                {currentTrack.emoji}
              </div>

              <div className="min-w-0">
                <div className="truncate text-lg font-semibold text-slate-900">
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
                className="h-2 w-full cursor-pointer appearance-none rounded-full bg-slate-200 accent-slate-900"
              />

              <div className="mt-3 flex items-center justify-between text-xs text-slate-500">
                <span>{playAllMode ? "Spil alle er aktiv" : "Ét nummer ad gangen"}</span>
                <button
                  onClick={() => setPlayAllMode((prev) => !prev)}
                  className="rounded-full bg-slate-100 px-3 py-1.5 font-medium text-slate-700"
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

