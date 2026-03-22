import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";

const APP_TITLE = "LykkeLiga Jukebox";

/** Warm cream — matches page background and iOS theme / splash tint */
const THEME_COLOR = "#F5F0E6";

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: THEME_COLOR,
};

export const metadata: Metadata = {
  title: APP_TITLE,
  description: "En glad lille jukebox til LykkeLiga-musik",
  applicationName: APP_TITLE,
  appleWebApp: {
    capable: true,
    title: APP_TITLE,
    statusBarStyle: "black-translucent",
  },
  icons: {
    apple: "/icon.png",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da">
      <body>{children}</body>
    </html>
  );
}
