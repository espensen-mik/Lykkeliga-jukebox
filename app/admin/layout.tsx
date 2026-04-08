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
  themeColor: "#050a14",
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#050a14] antialiased [color-scheme:dark]">
      {children}
    </div>
  );
}
