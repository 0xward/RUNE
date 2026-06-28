import { connectorRegistry } from "@/lib/intelligence/connectors/registry";
import { Panel, SectionHeader } from "./panel";

export function SourceMonitor() {
  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Collection Layer" title="Source Monitor" />
      {connectorRegistry.map((connector) => (
        <div key={connector.id} className="flex items-center justify-between border-t border-rune-border py-3 text-sm">
          <div>
            <p className="font-medium">{connector.label}</p>
            <p className="text-rune-muted">{connector.kind}</p>
          </div>
          <span className="text-xs uppercase tracking-[0.22em] text-rune-muted">{connector.enabled ? "active" : "standby"}</span>
        </div>
      ))}
    </Panel>
  );
}
