import type { Metadata, Viewport } from "next";
import type { ReactNode } from "react";

export const metadata: Metadata = {
  title: "Admin · LykkeMusik",
  robots: { index: false, follow: false },
};

/** God læsebredde på desktop; ikke optimeret som mobil-app */
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  themeColor: "#040814",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  /* Root body uses overflow:hidden for the jukebox; admin needs its own scroll layer. */
  return (
    <div className="fixed inset-0 overflow-y-auto overflow-x-hidden bg-[#040814] antialiased [color-scheme:dark]">
      {children}
    </div>
  );
}
