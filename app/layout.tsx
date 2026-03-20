import "./globals.css";
import React from "react";

export const metadata = {
  title: "LykkeLiga Jukebox",
  description: "En glad lille jukebox til LykkeLiga-musik",
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
