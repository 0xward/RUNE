import { Activity, Bell, Radar, Shield } from "lucide-react";
import { anomalies, providers, signals } from "@/lib/intelligence/mock-data";
import { Panel, SectionHeader } from "./panel";

export function RightRail() {
  return (
    <aside className="border-l border-rune-border p-5 lg:p-6">
      <SectionHeader eyebrow="Live Context" title="Intelligence Summary" />
      <Panel className="mb-4 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-medium"><Radar className="h-4 w-4" />Emerging Signals</h3>
        {signals.slice(0, 3).map((signal) => <p key={signal.id} className="py-1 text-sm text-rune-muted">{signal.topic} · +{signal.momentum}%</p>)}
      </Panel>
      <Panel className="mb-4 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-medium"><Activity className="h-4 w-4" />Top Opportunities</h3>
        {[
          "Agent workflow observability",
          "BYOK model routing",
          "Private intelligence workspaces",
        ].map((item) => <p key={item} className="py-1 text-sm text-rune-muted">{item}</p>)}
      </Panel>
      <Panel className="mb-4 p-4">
        <h3 className="mb-3 flex items-center gap-2 font-medium"><Bell className="h-4 w-4" />Latest Alerts</h3>
        {anomalies.map((anomaly) => <p key={anomaly.id} className="py-1 text-sm text-rune-muted">{anomaly.title}</p>)}
      </Panel>
      <Panel className="p-4">
        <h3 className="mb-3 flex items-center gap-2 font-medium"><Shield className="h-4 w-4" />Provider Status</h3>
        {providers.map((provider) => <p key={provider.id} className="py-1 text-sm text-rune-muted">{provider.label} · {provider.status.replace("_", " ")}</p>)}
      </Panel>
    </aside>
  );
}
