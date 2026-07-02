import type { Metadata } from "next";
import "@fontsource/geist/400.css";
import "@fontsource/geist/500.css";
import "@fontsource/geist/600.css";
import "@fontsource/geist/700.css";
import "./globals.css";
import { Web3Provider } from "@/components/web3/web3-provider";

export const metadata: Metadata = {
  title: "RUNE — Signal Over Noise",
  description: "Reality Intelligence Terminal for signals, anomalies, and forecasts.",
  openGraph: {
    title: "RUNE — Signal Over Noise",
    description: "See what others miss.",
    siteName: "RUNE",
  },
  other: {
    "talentapp:project_verification": "8cffcec667351073cf0ecb1aedcc13b2ba3793c277fdd0547bf65df2cc56bf0b52b5c69d5ef5448984c32c7a1e4e9a6146b586145c0d5b79e0fcb8a22e4a9503",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">
        <Web3Provider>{children}</Web3Provider>
      </body>
    </html>
  );
}
