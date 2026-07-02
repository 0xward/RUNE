import { Panel, SectionHeader } from "./panel";

interface DossierProps {
  rows: Array<{ label: string; value: string }>;
}

export function IntelligenceDossier({ rows }: DossierProps) {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Executive Synthesis" title="Intelligence Dossier" />
      <div className="grid gap-3 xl:grid-cols-2">
        {rows.map((row) => (
          <div key={row.label} className="border border-rune-border p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-rune-muted">{row.label}</p>
            <p className="mt-3 text-sm leading-6 text-white">{row.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
