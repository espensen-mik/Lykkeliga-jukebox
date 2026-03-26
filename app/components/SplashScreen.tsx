"use client";

import React, { useEffect, useState } from "react";
import styles from "./SplashScreen.module.css";

type Phase = "visible" | "fading" | "hidden";

export default function SplashScreen() {
  const [phase, setPhase] = useState<Phase>("visible");

  useEffect(() => {
    // Avoid replaying the splash on quick reloads during the same session.
    if (window.sessionStorage.getItem("splashDone") === "1") {
      setPhase("hidden");
      return;
    }

    const FADE_START_MS = 1350; // ~1.2-1.5s
    const HIDE_MS = 1850; // allow fade transition to finish

    const t1 = window.setTimeout(() => setPhase("fading"), FADE_START_MS);
    const t2 = window.setTimeout(() => {
      setPhase("hidden");
      window.sessionStorage.setItem("splashDone", "1");
    }, HIDE_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
    };
  }, []);

  if (phase === "hidden") return null;

  return (
    <div
      className={[
        styles.overlay,
        phase === "fading" ? styles.fading : "",
      ].join(" ")}
      aria-hidden="true"
    >
      <img
        src="/icon.svg"
        alt=""
        draggable={false}
        className={styles.icon}
      />
      <img
        src="/lykkeliga-logo.svg"
        alt=""
        draggable={false}
        className={styles.logo}
      />
    </div>
  );
}

