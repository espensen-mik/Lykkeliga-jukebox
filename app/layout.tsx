import type { Metadata, Viewport } from "next";
import "./globals.css";
import React from "react";

const APP_TITLE = "LykkeLiga Jukebox";

/** Bump when replacing public/icon.png so favicon / Add to Home Screen pick up the new asset */
const ICON_VERSION = "2";

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
    icon: `/icon.png?v=${ICON_VERSION}`,
    apple: `/icon.png?v=${ICON_VERSION}`,
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="da" className="h-full">
      <body className="flex h-full min-h-0 min-h-[100dvh] flex-col overflow-hidden overscroll-none">
        {children}
      </body>
    </html>
  );
}
