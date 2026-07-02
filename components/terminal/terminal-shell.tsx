"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { LeftSidebar } from "./sidebar";
import { RightRail } from "./right-rail";
import { Topbar } from "./topbar";
import { Activity, AlertTriangle, BarChart2, BookOpen, Eye, Home, Radio, Settings, Zap } from "lucide-react";

const NAV = [
  { label: "Overview",   href: "/overview",   icon: Home },
  { label: "Signals",    href: "/signals",    icon: Radio },
  { label: "Radar",      href: "/radar",      icon: Eye },
  { label: "Anomalies",  href: "/anomalies",  icon: AlertTriangle },
  { label: "Forecast",   href: "/forecast",   icon: BarChart2 },
  { label: "Watchlists", href: "/watchlists", icon: BookOpen },
  { label: "Providers",  href: "/providers",  icon: Zap },
  { label: "Settings",   href: "/settings",   icon: Settings },
];

export function TerminalShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <div className="min-h-screen bg-rune-bg text-white">
      <div className="flex min-h-screen">

        {/* Sidebar — desktop only */}
        <div className="hidden lg:block lg:w-[260px] lg:shrink-0">
          <LeftSidebar active={active} />
        </div>

        {/* Main content */}
        <div className="flex min-w-0 flex-1 flex-col">

          {/* Mobile topbar */}
          <div className="flex items-center justify-between border-b border-rune-border bg-rune-bg px-4 py-3 lg:hidden">
            <Link href="/" className="text-base font-black tracking-[0.32em] uppercase">RUNE</Link>
            <span className="text-[10px] font-black tracking-[0.28em] uppercase text-rune-muted">{active}</span>
          </div>

          {/* Page content — bottom padding so content isn't hidden behind mobile nav */}
          <main className="flex-1 overflow-x-hidden p-4 pb-24 md:p-6 md:pb-28 lg:pb-6">
            <Topbar active={active} />
            {children}
          </main>
        </div>

        {/* Right rail — xl only */}
        <div className="hidden xl:block xl:w-[300px] xl:shrink-0">
          <RightRail />
        </div>
      </div>

      {/* ── MOBILE BOTTOM NAV ── */}
      <nav className="fixed bottom-0 inset-x-0 z-50 border-t border-rune-border bg-rune-bg/95 backdrop-blur-sm lg:hidden">
        <div className="grid grid-cols-8 h-14">
          {NAV.map(({ label, href, icon: Icon }) => {
            const isActive = label === active;
            return (
              <Link
                key={label}
                href={href}
                className={`flex flex-col items-center justify-center gap-0.5 transition-colors ${
                  isActive ? "text-white" : "text-rune-muted hover:text-white"
                }`}
              >
                <Icon className={`h-4 w-4 shrink-0 ${isActive ? "opacity-100" : "opacity-50"}`} />
                <span className="text-[7px] font-black uppercase tracking-[0.15em] leading-none">
                  {label.slice(0, 3)}
                </span>
                {isActive && (
                  <span className="absolute bottom-0 h-0.5 w-6 bg-white" />
                )}
              </Link>
            );
          })}
        </div>
      </nav>
    </div>
  );
}

export function PageTitle({
  eyebrow,
  title,
  subtitle,
}: {
  eyebrow: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-[10px] uppercase tracking-[0.28em] text-rune-muted">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      </div>
      <p className="max-w-sm text-sm leading-6 text-rune-muted">{subtitle}</p>
    </div>
  );
}
