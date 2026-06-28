import { anomalies, forecasts, signals } from "@/lib/intelligence/mock-data";
import { Panel, SectionHeader } from "./panel";

const dossierRows = [
  { label: "What changed", value: `${signals[0].topic} momentum accelerated to +${signals[0].momentum}% across ${signals[0].sources.length} source clusters.` },
  { label: "Why it matters", value: "Browser automation, model routing, and enterprise workflow replacement are converging into a single adoption curve." },
  { label: "What is unusual", value: anomalies[0].explanation },
  { label: "Next likely move", value: forecasts[0].thesis },
];

export function IntelligenceDossier() {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Executive Synthesis" title="Intelligence Dossier" />
      <div className="grid gap-3 xl:grid-cols-2">
        {dossierRows.map((row) => (
          <div key={row.label} className="border border-rune-border p-4">
            <p className="text-[10px] uppercase tracking-[0.24em] text-rune-muted">{row.label}</p>
            <p className="mt-3 text-sm leading-6 text-white">{row.value}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
