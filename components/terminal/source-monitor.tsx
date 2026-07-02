import { connectorRegistry } from "@/lib/intelligence/connectors/registry";
import { Panel, SectionHeader } from "./panel";
import { supabase } from "@/lib/supabase/server";

async function getLastRun(): Promise<{ ran_at: string; signal_count: number } | null> {
  const { data } = await supabase
    .from("signals")
    .select("observed_at")
    .order("observed_at", { ascending: false })
    .limit(1)
    .single();
  if (!data) return null;
  const { count } = await supabase
    .from("signals")
    .select("*", { count: "exact", head: true })
    .gte("observed_at", new Date(Date.now() - 86400000 * 3).toISOString());
  return {
    ran_at: (data as unknown as { observed_at: string }).observed_at,
    signal_count: count ?? 0,
  };
}

export async function SourceMonitor() {
  const lastRun = await getLastRun();

  return (
    <Panel className="p-4">
      <SectionHeader eyebrow="Collection Layer" title="Source Monitor" />
      {connectorRegistry.map((connector) => (
        <div key={connector.id} className="flex items-center justify-between border-t border-rune-border py-3 text-sm">
          <div>
            <p className="font-medium">{connector.label}</p>
            <p className="text-rune-muted capitalize">{connector.kind}</p>
          </div>
          <div className="text-right">
            <span className="block text-xs uppercase tracking-[0.22em] text-rune-muted">
              {connector.enabled ? "active" : "standby"}
            </span>
            {connector.enabled && (
              <span className="mt-0.5 block h-1.5 w-1.5 rounded-full bg-white ml-auto" />
            )}
          </div>
        </div>
      ))}
      {lastRun && (
        <div className="border-t border-rune-border pt-3">
          <p className="text-[10px] text-rune-muted">
            Last collection: {new Date(lastRun.ran_at).toLocaleString()} · {lastRun.signal_count} items (3d)
          </p>
        </div>
      )}
    </Panel>
  );
}
