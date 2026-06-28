import type { ReactNode } from "react";
import { LeftSidebar } from "./sidebar";
import { RightRail } from "./right-rail";
import { Topbar } from "./topbar";

export function TerminalShell({ active, children }: { active: string; children: ReactNode }) {
  return (
    <main className="min-h-screen bg-rune-bg text-white">
      <div className="grid min-h-screen grid-cols-1 lg:grid-cols-[280px_minmax(0,1fr)_340px]">
        <LeftSidebar active={active} />
        <section className="min-w-0 p-4 md:p-6"><Topbar active={active} />{children}</section>
        <RightRail />
      </div>
    </main>
  );
}

export function PageTitle({ eyebrow, title, subtitle }: { eyebrow: string; title: string; subtitle: string }) {
  return (
    <div className="mb-6 flex flex-col justify-between gap-4 md:flex-row md:items-end">
      <div>
        <p className="text-xs uppercase tracking-[0.28em] text-rune-muted">{eyebrow}</p>
        <h1 className="mt-2 text-3xl font-semibold tracking-tight md:text-5xl">{title}</h1>
      </div>
      <div className="max-w-sm text-sm leading-6 text-rune-muted">{subtitle}</div>
    </div>
  );
}
