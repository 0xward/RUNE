import { Activity, Clock3, Database, Radio } from "lucide-react";

export function Topbar({ active }: { active: string }) {
  return (
    <div className="mb-6 border border-rune-border bg-rune-panel px-4 py-3">
      <div className="flex flex-col justify-between gap-3 md:flex-row md:items-center">
        <div>
          <p className="text-[10px] uppercase tracking-[0.28em] text-rune-muted">Current Surface</p>
          <h1 className="text-lg font-semibold">{active}</h1>
        </div>
        <div className="grid grid-cols-2 gap-3 text-xs text-rune-muted md:flex md:items-center">
          <span className="flex items-center gap-2"><Radio className="h-3.5 w-3.5" /> live</span>
          <span className="flex items-center gap-2"><Database className="h-3.5 w-3.5" /> 11 sources</span>
          <span className="flex items-center gap-2"><Activity className="h-3.5 w-3.5" /> 4 anomalies</span>
          <span className="flex items-center gap-2"><Clock3 className="h-3.5 w-3.5" /> refreshed 42s ago</span>
        </div>
      </div>
    </div>
  );
}
