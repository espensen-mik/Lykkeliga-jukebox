"use client";

import React, {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { createPortal } from "react-dom";
import { MicVocal, Menu, Radio, X } from "lucide-react";

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
    artist: "TMS Ringsted",
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
    artist: "Ravnsborg Vikings",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammen-med-Lars-er-vi-superstars.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Sammenmedlars.jpg",
  },
  {
    id: "scoresangen",
    title: "Scoresangen",
    artist: "Ravnsborg Vikings",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.mp3",
    coverUrl: "https://lykkeliga.dk/wp-content/uploads/2026/03/Scoresangen.jpg",
  },
  {
    id: "se-mine-muller",
    title: "Se mine muller",
    artist: "Skive FH",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Se-mine-muller.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Se-mine-muller-mp3-image.jpg",
  },
  {
    id: "vi-er-sammenholdet",
    title: "Vi er Sammenholdet",
    artist: "Guldgåsen",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Vi-er-Sammenholdet.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Vi-er-Sammenholdet-mp3-image.png",
  },
  {
    id: "vi-vinder-lykkecup",
    title: "Vi vinder LykkeCup",
    artist: "Guldgåsen",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Vi-vinder-LykkeCup.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Vi-vinder-LykkeCup-mp3-image.png",
  },
  {
    id: "vi-spiller-klassebold",
    title: "Vi spiller KlasseBold",
    artist: "LykkeLiga",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Vi-spiller-KlasseBold.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/klassebold_cover.png",
  },
  {
    id: "venner-viser-taender",
    title: "Venner viser tænder",
    artist: "Skive FH",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Venner-viser-taender.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/VENNER-VISER-TAeNDER.png",
  },
  {
    id: "vi-er-lykkeliga",
    title: "Vi er LykkeLiga",
    artist: "Gritt Møller",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Gritt-Moeller-Lykkeliga.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/vierlykkeliga.png",
  },
  {
    id: "tre-skridt",
    title: "Tre skridt",
    artist: "Souvenirs",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/Tre-Skridt-Mix.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/03/cover_3skridt.jpg",
  },
];

const lyricsByTrackId: Record<string, string> = {
  "hop-hop-hop":
    "Her kommer sangteksten for “Hop hop hop”.\n\n(Indhold er en simpel placeholder, så vi kan teste UI-funktionen.)",
  "nede-med-at-svede":
    "Er I nede med at svede LykkeLiga\n\nPerler på panden, det drypper\nDer er en flod ned af min ryg\nBriller der dugger, jeg sveder\nVi gir den endnu et nyk\n\nEr du nede, med at svede\nPulsen op - og kom i gang\nHvis du er nede, med at svede\nSå syng med på, vores sang\n\nHåret er vådt, det sprøjter\nMan sku tro jeg havde været i bad\nHåndbold er hårdt, jeg sveder\nMit hold det gør mig glad\n\nKampråb\nVenner,\nVi griner\nDet er verdens bedste sammenhold\n3-2-1\n\nEr du nede, med at svede\nPulsen op - og kom i gang\nHvis du er nede, med at svede\nSå syng med på, vores sang\n\nRingsted er nede med at svede\nVi er nede med at svede",
  "sammen-med-lars":
    "Er I klar til LykkeLars\n\nLykken er lars\nLars er lykken\nLykke Lars han sørger, altid for hyggen\nHan kender alle tricks, alle finter\nHan kan gå i shorts når det er vinter\nNår Lars er med, så bli’r der fest  \nKom nu alle sammen “Lykke Lars er bedst!”\n\nSammen med Lars \nblir vi superstars \nLykke Lars kan kaste \nbolden helt til Mars \nHan er vores ven, vores kammerat \nOg Sammen med Lars \ner vi superstars\n\nLars er Smart\nLars er klog\nLykke Lars kan løfte et gammeldags tog\nHan kan være artig, han kan fjante\nHan kan kramme bedre end din tante\nNår Lars er med, så bli’r der fest  \nKom nu alle sammen “Lykke Lars er bedst!”\n\nSammen med Lars \nblir vi superstars \nLykke Lars kan kaste \nbolden helt til Mars \nHan er vores ven, vores kammerat \nOg Sammen med Lars \ner vi superstars\n\nLars han er flot og Lars han er høj\nLykke Lars har\ndet flotteste tøj\nHan er din ven, dit store idol\nLars han må gerne tage din stol\n\nSammen med Lars \nblir vi superstars \nLykke Lars kan kaste \nbolden helt til Mars \nHan er vores ven, vores kammerat \nOg Sammen med Lars \ner vi superstars\n\nLars han er den bedste\nHam kan ingen tæske\nRavnsborg er de bedste\nLykkeLiga er de bedste",
  scoresangen:
    "Vi er fra Ravnsborg - og vi er kommet for at score\n\nVi vil, vi vil score, vi vil score\nVi er nummer et og ikke toer\nDamer og mål-rekord, Vi skyder ægte hårdt\nfrikast til morgenmad, der er byfest i mester stad?\n\nVi vil, vi vil score, vi vil score\nVi er nummer et og ikke toer\nVi vil, Vi vil score, vi vil score\nVi er nummer ét og ikke toer\n\nVi vil, vi vil score, vi vil score\nVores statistikker de er store\nKan ikke tælle så højt, dommer ta' nu og fløjt\nDer er målmand til aftensmad, highlights på fintefad\n\nVi vil, vi vil score, vi vil score\nVi er nummer et og ikke toer\nVi vil, Vi vil score, vi vil score\nVi er nummer ét og ikke toer\n\nBaby så du den kasse, jeg har scoret en masse\nDet er liga med lykke her,  op med de arme dér\n\nVi er LykkeLiga\nVi er lykkeLiga\nVi vil score\nVi er nummer ét og ikke toer!",
  "se-mine-muller":
    "Denne her går ud til alle LykkeLiga spillere - direkte fra Skive FH\n\nFør der var jeg lille, men nu er jeg blevet stor\nMine arme de var slappe, nu løfter jeg min mor\nHåndbold gør mig stærk og nu har jeg fået guns\nVil du lægge arm, jeg er der med det vons\n\nSE MINE MULLER\nMÆRK MINE MULLER\nMens jeg spiller håndbold, kan du sidde på min skulder\nSE MINE MULLER\nMÆRK MINE MULLER\nArmene er kæmpe på mors lille nuller\n\nMine arme vokser, det er gået helt amok\nTrøjen er for lille, det er ved at være nok\nMusklerne er kæmpe og jeg kaster alt for hårdt\nNår jeg ikke rammer så er det noget…\n\nSE MINE MULLER\nMÆRK MINE MULLER\nMens jeg pumper jern kan du sidde på min skulder\nSE MINE MULLER\nMÆRK MINE MULLER\nSe mig løbe stærk så øjnene de ruller\n\nStærk som den kaffe din mormor hun drikker\nStærk som et gækkebrev med rigtigt mange prikker\nStærk som en ost, din far han æder\nStærk som en jakke der er lavet af læder\n\nSE MINE MULLER\nMÆRK MINE MULLER\nMens jeg pumper jern kan du sidde på min skulder\nSE MINE MULLER\nMÆRK MINE MULLER\nSe mig løbe stærk så øjnene de ruller\nSE MINE MULLER\nMÆRK MINE MULLER\nAlle os i LykkeLiga vi har kæmpe Muller!",
  "vi-er-sammenholdet":
    "Alting er på spil\nDet er sammenspil\nVi hepper på hinanden og vi griner\nLøfter venner op som trampoliner\n\nDu er med på holdet\nSammenholdet\nAlle sammen er på holdet\nSammenholdet\nVi er Sammenholdet\n\nGir du ik et kram\nDu kan dit kram\nVi træner allesammen og vi sveder\nRøde kinder lige som rødbeder\n\nDu er med på holdet\nSammenholdet\nAlle sammen er på holdet\nSammenholdet\nVi er Sammenholdet\n\nGåsen er på holdet\nSammenholdet\nLykkeLars på holdet\nSammenholdet\nAlle er på holdet\nSammenholdet\n\nAlting er på spil\nDet er sammenspil\nVi hepper på hinanden og vi griner\nLøfter venner op som trampoliner\n\nDu er med på holdet\nSammenholdet\nAlle sammen er på holdet\nSammenholdet\nVi er Sammenholdet",
  "vi-vinder-lykkecup":
    "I dag der blir vi mestre\nDet er os de klapper af\nSejren den er vores\nVi vinder guld i dag\n\nVi skruer lyden op\nFor der er LykkeCup\nI dag der blir vi mestre\nVi vinder LykkeCup\n\nDet kilder i min mave\nPokalen den er klar\nI dag er vi de kendte\nI dag er jeg en star\n\nVi skruer lyden op\nFor der er LykkeCup\nI dag der blir vi mestre\nVi vinder Lykke Cup\n\nVi er fra Vordingborg\ni dag der blir vi mestre\nAlle i vores liga\nDe vinder guld i år\n\nVi skruer lyden op\nFor der er LykkeCup\nI dag der blir vi mestre\nVi vinder Lykke Cup",
  "vi-spiller-klassebold":
    "Vi spiller Klassebold\n\nOp ad stolen\nBold I skolen\nVi vil meget hellere spille, \nend at sidde og pille\nBussemænd\nVi scorer igen og igen\n\nNår vi spiller er det klasse bold\nVores klasse den er blevet et hold\nVi står sammen og vi scorer mål\nVores muskler de er lavet af stål\n\nUd på banen\nSpis bananen\nVi vil meget hellere spille, \nend at sidde stille\nKom min ven\nVi scorer igen og igen\n\nVi spiller klasse bold\nVi gider ikke sidde stille\nklasse bold\nHåndbold gør os vilde",
  "venner-viser-taender":
    "Chippi chippi chappa chappa\n\nBrug dine læber\nStram i de kæber\nVis dine pløkker\nDet er dem som tygger\n\nGiv et smil\nDet er ægte lykke stil\nVenner viser tænder \nSom et kærligheds missil\n\nVenner  \nViser tænder  \nSmil til dine venner\nVis dem dine tænder\n\nFrem med dine gummer\nLyt til vores nummer\nSkive gir den op\nVi vil høre pop\n\nVis dit smil\nDet er ægte lykke stil\nVenner viser tænder \nSom et lykkeligt missil\n\nVenner  \nViser tænder  \nSmil til dine venner\nVis dem dine tænder\n\nChippi chippi, chippa chippa\nLykkeLiga wappa wappa\n\nBrug dine læber\nStram i de kæber\nVis dine pløkker\nDet er dem som tygger\n\nGiv et smil\nDet er ægte lykke stil\nVenner viser tænder \nSom et kærligheds missil\n\nVenner  \nViser tænder  \nSmil til dine venner\nVis dem dine tænder",
  "vi-er-lykkeliga":
    "Her kommer sangteksten for “Vi er LykkeLiga”.\n\n(Indhold er en simpel placeholder, så vi kan teste UI-funktionen.)",
};

function getLyrics(trackId: string) {
  return (
    lyricsByTrackId[trackId] ??
    "Ingen lyrics er indlæst endnu for denne sang."
  );
}

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
  const suppressCoverClickRef = useRef<number>(0);

  const [index, setIndex] = useState(0);
  const [playing, setPlaying] = useState(false);
  const [radioMode, setRadioMode] = useState(false);
  const [time, setTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [menuOpen, setMenuOpen] = useState(false);
  const [infoOpen, setInfoOpen] = useState(false);
  const [musicInfoOpen, setMusicInfoOpen] = useState(false);
  const [saveAsAppOpen, setSaveAsAppOpen] = useState(false);
  const [lyricsOpen, setLyricsOpen] = useState(false);
  const [lyricsTrackId, setLyricsTrackId] = useState<string>("");
  const [isLandscape, setIsLandscape] = useState(false);

  const menuRef = useRef<HTMLDivElement | null>(null);
  const [menuDropdownPos, setMenuDropdownPos] = useState<{
    top: number;
    right: number;
  }>({ top: 0, right: 16 });
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Best-effort orientation lock for iOS web-app mode.
    // Note: browsers typically require a user gesture; we try on mount and on first tap.
    const updateLandscape = () => {
      setIsLandscape(window.innerWidth > window.innerHeight);
    };

    updateLandscape();

    const tryLockPortrait = async () => {
      try {
        const so: any = (window as any).screen?.orientation;
        if (!so?.lock) return;
        if (so.type && String(so.type).includes("portrait")) return;
        await so.lock("portrait");
      } catch {
        /* ignore */
      }
    };

    void tryLockPortrait();

    const onFirstTouch = () => {
      void tryLockPortrait();
      updateLandscape();
      window.removeEventListener("touchstart", onFirstTouch);
    };

    window.addEventListener("touchstart", onFirstTouch, { once: true });

    const onOrientationChange = () => {
      void tryLockPortrait();
      updateLandscape();
    };
    window.addEventListener("orientationchange", onOrientationChange);
    window.addEventListener("resize", updateLandscape);

    return () => {
      window.removeEventListener("orientationchange", onOrientationChange);
      window.removeEventListener("touchstart", onFirstTouch);
      window.removeEventListener("resize", updateLandscape);
    };
  }, []);

  useLayoutEffect(() => {
    if (!menuOpen) return;
    const measure = () => {
      const el = menuRef.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      setMenuDropdownPos({
        top: r.bottom + 6,
        right: Math.max(8, window.innerWidth - r.right),
      });
    };
    measure();
    window.addEventListener("resize", measure);
    window.addEventListener("orientationchange", measure);
    const vv = window.visualViewport;
    vv?.addEventListener("resize", measure);
    vv?.addEventListener("scroll", measure);
    return () => {
      window.removeEventListener("resize", measure);
      window.removeEventListener("orientationchange", measure);
      vv?.removeEventListener("resize", measure);
      vv?.removeEventListener("scroll", measure);
    };
  }, [menuOpen]);

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

  useEffect(() => {
    if (!infoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setInfoOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [infoOpen]);

  useEffect(() => {
    if (!lyricsOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setLyricsOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [lyricsOpen]);

  useEffect(() => {
    if (!musicInfoOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setMusicInfoOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [musicInfoOpen]);

  useEffect(() => {
    if (!saveAsAppOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSaveAsAppOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [saveAsAppOpen]);

  const shareApp = async () => {
    const url =
      typeof window !== "undefined" ? window.location.href : "";
    if (!url) return;
    setMenuOpen(false);
    try {
      if (navigator.share) {
        await navigator.share({
          title: "LykkeLiga Jukebox",
          text: "LykkeLiga Jukebox",
          url,
        });
      } else if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(url);
        window.alert("Linket er kopieret — du kan indsætte det, hvor du vil.");
      } else {
        window.prompt("Kopiér linket:", url);
      }
    } catch {
      /* user cancelled share or error */
    }
  };

  const togglePlay = async () => {
    const audio = audioRef.current;
    if (!audio) return;

    // Use the real audio state to avoid React state drifting.
    if (audio.paused) {
      try {
        await audio.play();
        setPlaying(true);
      } catch {
        setPlaying(false);
      }
    } else {
      audio.pause();
      setPlaying(false);
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
    <main className="h-[100dvh] overflow-hidden bg-gradient-to-b from-[#faf8f3] via-[#f5f0e6] to-[#ebe3d6] text-slate-900">
      <audio ref={audioRef} preload="metadata" className="hidden" />

      <div className="flex h-full min-h-0 flex-col">
        <header className="safe-area-top relative z-[200] shrink-0 px-5 pt-7">
          <div className="relative flex min-h-[2.25rem] items-center justify-center md:min-h-[2.75rem]">
            <h1 className="text-center text-[28px] font-semibold leading-tight tracking-[-0.04em] text-[#0B1B46] md:text-[36px]">
              LykkeLiga JukeBox
            </h1>
            <div ref={menuRef} className="absolute right-0 top-1/2 -translate-y-1/2">
              <button
                type="button"
                onClick={() => setMenuOpen((o) => !o)}
                className="relative z-[80] inline-flex h-10 w-10 items-center justify-center rounded-xl text-[#0B1B46] transition hover:bg-[#0B1B46]/5 active:bg-[#0B1B46]/10"
                aria-expanded={menuOpen}
                aria-haspopup="true"
                aria-label="Menu"
              >
                <Menu className="h-6 w-6" strokeWidth={2} />
              </button>
            </div>
          </div>

          <div className="relative z-0 mt-5 flex flex-col items-center gap-3 px-5">
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

        <section className="relative z-0 flex min-h-0 flex-1 flex-col justify-center overflow-hidden pt-4">
          <div
            ref={stripRef}
            className="juke-carousel-strip scrollbar-none flex snap-x snap-mandatory gap-4 overflow-x-auto overflow-y-hidden px-[11vw] pb-3"
          >
            {tracks.map((track, i) => {
              const active = i === index;

              return (
                <button
                  key={track.id}
                  data-index={i}
                  onClick={() => selectTrack(i)}
                  className="flex w-[68vw] max-w-[300px] shrink-0 snap-center flex-col text-left"
                >
                  <div
                    className={[
                      "shrink-0 overflow-hidden rounded-[28px] bg-white shadow-[0_12px_34px_rgba(11,27,70,0.08)] ring-1 ring-black/5 transition duration-300",
                      active
                        ? "scale-100 opacity-100"
                        : "scale-[0.93] opacity-60",
                    ].join(" ")}
                  >
                    <div className="relative aspect-square overflow-hidden">
                      <img
                        src={track.coverUrl}
                        alt={track.title}
                        draggable={false}
                        className="juke-cover-img block h-full w-full object-cover object-top"
                      />
                      <span
                        role="button"
                        tabIndex={0}
                        aria-label={`Se lyrics for ${track.title}`}
                        title="Lyrics"
                        className="absolute right-3 top-3 z-[50] inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#7CFF6B] text-[#08132C] shadow-[0_0_18px_rgba(124,255,107,0.35)] transition hover:brightness-[1.03] active:brightness-[0.98]"
                        onClick={(e) => {
                          e.preventDefault();
                          e.stopPropagation();
                          setLyricsTrackId(track.id);
                          setLyricsOpen(true);
                        }}
                        onKeyDown={(e) => {
                          if (e.key !== "Enter" && e.key !== " ") return;
                          e.preventDefault();
                          e.stopPropagation();
                          setLyricsTrackId(track.id);
                          setLyricsOpen(true);
                        }}
                      >
                        <MicVocal className="h-5 w-5" strokeWidth={2} />
                      </span>
                    </div>
                  </div>

                  <div className="flex flex-col pb-1 pl-3 pr-1 pt-2.5">
                    <div className="line-clamp-2 min-h-[2.1em] text-[18px] font-semibold leading-[1.05] tracking-[-0.03em] text-[#0B1B46]">
                      {track.title}
                    </div>
                    <div className="mt-1 min-h-[1.35rem] text-[14px] leading-snug text-slate-500">
                      Kunstner: {track.artist}
                    </div>
                  </div>
                </button>
              );
            })}
          </div>
        </section>

        <div
          className="shrink-0 border-t border-slate-200 bg-[#08132C] text-white [padding-bottom:env(safe-area-inset-bottom,0px)]"
          aria-label="Afspiller"
        >
          <div className="mx-auto max-w-6xl px-4 py-3">
            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => {
                  if (Date.now() - suppressCoverClickRef.current < 600) return;
                  suppressCoverClickRef.current = Date.now();
                  void togglePlay();
                }}
                onTouchStart={(e) => {
                  if (Date.now() - suppressCoverClickRef.current < 600) return;
                  if (e.cancelable) e.preventDefault();
                  e.stopPropagation();
                  suppressCoverClickRef.current = Date.now();
                  void togglePlay();
                }}
                aria-label={playing ? "Pause" : "Afspil"}
                className="h-12 w-12 shrink-0 overflow-hidden rounded-xl transition active:scale-95"
              >
                <img
                  src={current.coverUrl}
                  alt={current.title}
                  className="block h-full w-full object-cover object-top"
                />
              </button>

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
      </div>

      {mounted &&
        menuOpen &&
        createPortal(
          <>
            <button
              type="button"
              aria-label="Luk menu"
              className="fixed inset-0 z-[10000] cursor-default border-0 bg-black/35 p-0"
              onClick={() => setMenuOpen(false)}
            />
            <div
              className="fixed z-[10001] min-w-[13.75rem] overflow-hidden rounded-2xl border border-white/20 bg-[#08132C]/92 py-1.5 text-left shadow-[0_20px_56px_rgba(11,27,70,0.45)] backdrop-blur-xl ring-1 ring-white/10"
              role="menu"
              style={{
                top: menuDropdownPos.top,
                right: menuDropdownPos.right,
              }}
            >
              <div className="px-4 pb-3 pt-3">
                <img
                  src="/lykkeliga-logo.svg"
                  alt="LykkeLiga"
                  className="h-6 w-auto opacity-95"
                />
              </div>
              <div className="mx-3 h-px bg-white/15" />
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-[15px] font-medium text-white/90 transition hover:bg-white/10"
                onClick={() => {
                  setMenuOpen(false);
                  setInfoOpen(true);
                }}
              >
                Info
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-[15px] font-medium text-white/90 transition hover:bg-white/10"
                onClick={() => {
                  setMenuOpen(false);
                  setMusicInfoOpen(true);
                }}
              >
                Om musikken
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-[15px] font-medium text-white/90 transition hover:bg-white/10"
                onClick={() => {
                  setMenuOpen(false);
                  setSaveAsAppOpen(true);
                }}
              >
                Gem som app
              </button>
              <button
                type="button"
                role="menuitem"
                className="block w-full px-4 py-2.5 text-left text-[15px] font-medium text-white/90 transition hover:bg-white/10"
                onClick={shareApp}
              >
                Del
              </button>
              <a
                role="menuitem"
                href="https://lykkeliga.dk"
                target="_blank"
                rel="noopener noreferrer"
                className="block px-4 py-2.5 text-[15px] font-medium text-white/90 transition hover:bg-white/10"
                onClick={() => setMenuOpen(false)}
              >
                lykkeliga.dk
              </a>
            </div>
          </>,
          document.body
        )}

      {infoOpen && (
        <div
          className="fixed inset-0 z-[600] flex items-end justify-center bg-[#08132C]/35 p-4 backdrop-blur-xl sm:items-center"
          role="presentation"
          onClick={() => setInfoOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            aria-labelledby="info-dialog-title"
            className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[22px] border border-white/20 bg-white/10 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2
                id="info-dialog-title"
                className="text-lg font-semibold text-white/95"
              >
                Om LykkeLiga Jukebox
              </h2>
              <button
                type="button"
                onClick={() => setInfoOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Luk"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>
            <p className="mt-3 text-[15px] leading-relaxed text-white/75">
              LykkeLiga Jukebox er en lille musikafspiller med sange fra
              LykkeLiga. Vælg et nummer i karussellen, eller tænd for
              LykkeRadioen, så spiller den videre automatisk. God fornøjelse!
            </p>
            <button
              type="button"
              onClick={() => setInfoOpen(false)}
              className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-[15px] font-semibold text-white transition active:scale-[0.99] hover:bg-white/15"
            >
              Luk
            </button>
          </div>
        </div>
      )}

      {lyricsOpen && (
        <div
          className="fixed inset-0 z-[650] flex items-center justify-center bg-[#08132C]/30 p-4 backdrop-blur-md"
          role="presentation"
          onClick={() => setLyricsOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[22px] border border-white/20 bg-white/10 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <h2 className="text-lg font-semibold text-white/95">
                {tracks.find((t) => t.id === lyricsTrackId)?.title ?? "Lyrics"}
              </h2>
              <button
                type="button"
                onClick={() => setLyricsOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Luk"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <pre className="mt-3 max-w-[38rem] whitespace-pre-wrap break-words bg-transparent text-[15px] leading-relaxed text-white/75">
              {getLyrics(lyricsTrackId)}
            </pre>

            <button
              type="button"
              onClick={() => setLyricsOpen(false)}
              className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-[15px] font-semibold text-white transition active:scale-[0.99] hover:bg-white/15"
            >
              Luk
            </button>
          </div>
        </div>
      )}

      {musicInfoOpen && (
        <div
          className="fixed inset-0 z-[640] flex items-center justify-center bg-[#08132C]/30 p-4 backdrop-blur-md"
          role="presentation"
          onClick={() => setMusicInfoOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[22px] border border-white/20 bg-white/10 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-white/95">
                  Om musikken
                </h2>
                <p className="text-[12px] font-medium text-white/70">
                  Historier fra banen
                </p>
              </div>
              <button
                type="button"
                onClick={() => setMusicInfoOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Luk"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-white/75">
              <p>
                Sangene i LykkeLiga Jukebox er lavet af spillere, frivillige og
                klubmiljoer fra hele landet. De handler om holdaand, mod og
                glaeden ved at spille sammen.
              </p>
              <p>
                Hver sang har sin egen energi - fra kaempe omkvaed til
                hverdagslinjer, som alle kan synge med paa i hallen.
              </p>
            </div>

            <div className="mt-4 grid grid-cols-3 gap-2">
              <img
                src={tracks[2].coverUrl}
                alt={tracks[2].title}
                className="aspect-square w-full rounded-xl bg-white/10 object-cover"
              />
              <img
                src={tracks[7].coverUrl}
                alt={tracks[7].title}
                className="aspect-square w-full rounded-xl bg-white/10 object-cover"
              />
              <img
                src={tracks[10].coverUrl}
                alt={tracks[10].title}
                className="aspect-square w-full rounded-xl bg-white/10 object-cover"
              />
            </div>

            <button
              type="button"
              onClick={() => setMusicInfoOpen(false)}
              className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-[15px] font-semibold text-white transition active:scale-[0.99] hover:bg-white/15"
            >
              Luk
            </button>
          </div>
        </div>
      )}

      {saveAsAppOpen && (
        <div
          className="fixed inset-0 z-[641] flex items-center justify-center bg-[#08132C]/30 p-4 backdrop-blur-md"
          role="presentation"
          onClick={() => setSaveAsAppOpen(false)}
        >
          <div
            role="dialog"
            aria-modal="true"
            className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-[22px] border border-white/20 bg-white/10 px-5 py-5 shadow-[0_20px_60px_rgba(0,0,0,0.25)] backdrop-blur-md"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start justify-between gap-3">
              <div className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold text-white/95">
                  Gem som app
                </h2>
                <p className="text-[12px] font-medium text-white/70">
                  Hurtig guide til iPhone
                </p>
              </div>
              <button
                type="button"
                onClick={() => setSaveAsAppOpen(false)}
                className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-white/70 transition hover:bg-white/10 hover:text-white"
                aria-label="Luk"
              >
                <X className="h-5 w-5" strokeWidth={2} />
              </button>
            </div>

            <div className="mt-3 space-y-3 text-[15px] leading-relaxed text-white/75">
              <p>1. Aaben siden i Safari paa din iPhone.</p>
              <p>
                2. Tryk paa delingsikonet (firkant med pil op) nederst i
                Safari.
              </p>
              <p>3. Vaelg "Add to Home Screen" / "Foj til hjemmeskarm".</p>
              <p>4. Tryk "Add", og aaben appen fra hjemmeskarmen.</p>
            </div>

            <button
              type="button"
              onClick={() => setSaveAsAppOpen(false)}
              className="mt-5 w-full rounded-2xl border border-white/20 bg-white/10 py-3 text-[15px] font-semibold text-white transition active:scale-[0.99] hover:bg-white/15"
            >
              Luk
            </button>
          </div>
        </div>
      )}

      {isLandscape && (
        <div
          className="fixed inset-0 z-[100000] flex items-center justify-center bg-black/35 p-4"
          role="presentation"
        >
          <div className="max-w-md rounded-[28px] border border-white/20 bg-white/10 px-6 py-6 text-center backdrop-blur-md">
            <div className="text-[16px] font-semibold text-white/95">
              Drej tilbage til portræt
            </div>
            <div className="mt-2 text-[13px] leading-relaxed text-white/75">
              LykkeLiga Jukebox er designet til at køre i lodret visning.
            </div>
          </div>
        </div>
      )}
    </main>
  );
}
