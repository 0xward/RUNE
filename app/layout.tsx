import type { Metadata } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });
export const metadata: Metadata = { title: "RUNE — Signal Over Noise", description: "Reality Intelligence Terminal for signals, anomalies, and forecasts." };
export default function RootLayout({ children }: { children: React.ReactNode }) { return <html lang="en"><body className={`${geist.variable} font-sans antialiased`}>{children}</body></html>; }
