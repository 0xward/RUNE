import { engineStages } from "@/lib/intelligence/engine";
import { Panel, SectionHeader } from "./panel";

export function EngineHealth() {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Pipeline" title="Engine Health" />
      <div className="space-y-3">
        {engineStages.map((stage, index) => (
          <div key={stage} className="grid grid-cols-[28px_1fr] gap-3 text-sm">
            <div className="flex h-7 w-7 items-center justify-center border border-rune-border text-xs">{index + 1}</div>
            <p className="leading-6 text-rune-muted">{stage}</p>
          </div>
        ))}
      </div>
    </Panel>
  );
}
