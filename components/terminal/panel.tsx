import type { ReactNode } from "react";

export function Panel({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <section className={`border border-rune-border bg-rune-panel shadow-terminal ${className}`}>{children}</section>;
}

export function SectionHeader({ eyebrow, title, action }: { eyebrow?: string; title: string; action?: ReactNode }) {
  return (
    <div className="mb-4 flex items-start justify-between gap-4">
      <div>
        {eyebrow ? <p className="text-[10px] uppercase tracking-[0.28em] text-rune-muted">{eyebrow}</p> : null}
        <h2 className="mt-1 text-lg font-semibold tracking-tight text-white">{title}</h2>
      </div>
      {action}
    </div>
  );
}
