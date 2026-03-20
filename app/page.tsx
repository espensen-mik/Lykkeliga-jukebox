"use client";

import React, { useEffect, useRef, useState } from "react";

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

export default function Page() {
  const audioRef = useRef<HTMLAudioElement | null>(null);

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

  const toggle = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (playing) {
      audio.pause();
      setPlaying(false);
    } else {
      await audio.play();
      setPlaying(true);
    }
  };

  const next = () => setIndex((i) => (i + 1) % tracks.length);
  const prev = () => setIndex((i) => (i - 1 + tracks.length) % tracks.length);

  const startRadio = () => {
    setRadioMode(true);
    setPlaying(true);
  };

  const progress = duration ? (time / duration) * 100 : 0;

  return (
    <main className="min-h-screen bg-[#F6F3EB] pb-40">
      <audio ref={audioRef} />

      <div className="mx-auto max-w-6xl px-6 pt-10">
        {/* HEADER */}
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <img src={logoUrl} className="h-10" />
            <h1 className="text-2xl font-semibold text-[#0B1B46]">
              LykkeLiga JukeBox
            </h1>
          </div>

          <button
            onClick={startRadio}
            className="rounded-full bg-[#0B1B46] px-5 py-2 text-white"
          >
            LykkeLiga Radio
          </button>
        </div>

        {/* SWIPE AREA */}
        <div className="flex gap-6 overflow-x-auto pb-6 snap-x">
          {tracks.map((t, i) => (
            <div
              key={t.id}
              onClick={() => {
                setIndex(i);
                setPlaying(true);
              }}
              className="min-w-[260px] md:min-w-[340px] snap-center cursor-pointer"
            >
              <div
                className={`rounded-3xl overflow-hidden shadow ${
                  i === index ? "scale-100" : "scale-90 opacity-70"
                } transition`}
              >
                <img
                  src={t.coverUrl}
                  className="aspect-square object-cover w-full"
                />
              </div>

              <div className="mt-4 text-lg font-semibold">{t.title}</div>
              <div className="text-sm text-slate-500">
                Kunstner: {t.artist}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 bg-white border-t p-4">
        <div className="max-w-6xl mx-auto flex items-center gap-4">
          <img
            src={current.coverUrl}
            className="h-14 w-14 rounded-xl object-cover"
          />

          <div className="flex-1">
            <div className="font-semibold">{current.title}</div>
            <div className="text-sm text-slate-500">
              {current.artist}
            </div>

            <div className="flex items-center gap-2 text-xs mt-1">
              <span>{formatTime(time)}</span>
              <div className="flex-1 h-1 bg-slate-200 rounded">
                <div
                  className="h-1 bg-[#0B1B46] rounded"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <span>{formatTime(duration)}</span>
            </div>
          </div>

          <button onClick={prev}>⏮</button>
          <button
            onClick={toggle}
            className="h-10 w-10 bg-[#0B1B46] text-white rounded-full"
          >
            {playing ? "⏸" : "▶"}
          </button>
          <button onClick={next}>⏭</button>
        </div>
      </div>
    </main>
  );
}
