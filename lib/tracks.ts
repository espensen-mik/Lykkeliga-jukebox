export type Track = {
  id: string;
  title: string;
  artist: string;
  audioUrl: string;
  coverUrl: string;
};

export const tracks: Track[] = [
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
  {
    id: "lykken-er-haandbold",
    title: "Lykken er håndbold",
    artist: "Kviesø YoungStars",
    audioUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/04/Lykken-er-haandbold.mp3",
    coverUrl:
      "https://lykkeliga.dk/wp-content/uploads/2026/04/lykkenerhaandbold.jpg",
  },
];

export const TRACK_IDS = new Set(tracks.map((t) => t.id));
