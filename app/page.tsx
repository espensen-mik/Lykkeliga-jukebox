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
    setTime(0);

    if (playing) audio.play().catch(() => setPlaying(false));
  }, [index]);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const update = () => setTime(audio.currentTime || 0);
    const meta = () => setDuration(audio.duration || 0);

    const ended = () => {
      if (radioMode) {
        setIndex((i) => (i + 1) % tracks.length);
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

  const next = () => {
    setIndex((i) => (i + 1) % tracks.length);
    setPlaying(true);
  };

  const prev = () => {
    setIndex((i) => (i - 1 + tracks.length) % tracks.length);
    setPlaying(true);
  };

  const toggleRadio = async () => {
    setRadioMode((r) => !r);
    if (!playing) {
      await audioRef.current?.play();
      setPlaying(true);
    }
  };

  const progress = useMemo(() => {
    if (!duration) return 0;
    return (time / duration) * 100;
  }, [time, duration]);

  const seek = (e: any) => {
    const audio = audioRef.current;
    if (!audio || !duration) return;
    const pct = e.target.value;
    audio.currentTime = (pct / 100) * duration;
  };

  return (
    <main className="min-h-screen bg-[#F6F3EB] pb-40">
      <audio ref={audioRef} />

      {/* HEADER */}
      <div className="pt-6 text-center">
        <h1 className="text-4xl font-semibold tracking-tight text-[#0B1B46]">
          LykkeLiga JukeBox
        </h1>

        <button
          onClick={toggleRadio}
          className={`mt-4 rounded-full px-5 py-2 text-sm font-semibold ${
            radioMode
              ? "bg-[#7CFF6B] text-[#071126]"
              : "bg-[#0B1B46] text-white"
          }`}
        >
          {radioMode ? "Radio aktiv" : "LykkeLiga Radio"}
        </button>
      </div>

      {/* CAROUSEL */}
      <div className="mt-10 flex justify-center overflow-hidden">
        <div className="flex items-center gap-6 px-6">
          {tracks.map((t, i) => {
            const offset = i - index;

            return (
              <div
                key={t.id}
                onClick={() => {
                  setIndex(i);
                  setPlaying(true);
                }}
                className="cursor-pointer transition-all duration-500"
                style={{
                  transform: `
                    translateX(${offset * 40}px)
                    scale(${i === index ? 1 : 0.8})
                  `,
                  opacity: i === index ? 1 : 0.4,
                }}
              >
                <img
                  src={t.coverUrl}
                  className="h-[260px] w-[260px] rounded-3xl object-cover shadow-xl"
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* TITLE */}
      <div className="mt-6 text-center">
        <h2 className="text-2xl font-semibold text-[#0B1B46]">
          {current.title}
        </h2>
        <p className="text-slate-500">Kunstner: {current.artist}</p>
      </div>

      {/* PLAYER */}
      <div className="fixed bottom-0 left-0 right-0 border-t bg-white p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <img
              src={current.coverUrl}
              className="h-12 w-12 rounded-xl object-cover"
            />
            <div>
              <div className="text-sm font-semibold">{current.title}</div>
              <div className="text-xs text-slate-500">
                {current.artist}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={prev}>⏮</button>
            <button
              onClick={toggle}
              className="h-12 w-12 rounded-full bg-[#0B1B46] text-white"
            >
              {playing ? "⏸" : "▶"}
            </button>
            <button onClick={next}>⏭</button>
          </div>
        </div>

        <input
          type="range"
          value={progress}
          onChange={seek}
          className="mt-3 w-full accent-[#7CFF6B]"
        />
      </div>
    </main>
  );
}
