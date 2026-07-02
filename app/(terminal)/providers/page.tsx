import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { ProviderConnectForm } from "@/components/terminal/provider-form";
import { supabase } from "@/lib/supabase/server";
import { PROVIDER_CONFIGS } from "@/lib/intelligence/providers";

export const revalidate = 0;

async function getConnectedProviders() {
  const { data } = await supabase
    .from("providers")
    .select("id, name, status, created_at, api_keys(key_hint, created_at)")
    .order("created_at", { ascending: false });
  return (data ?? []) as unknown as Array<{
    id: string;
    name: string;
    status: string;
    created_at: string;
    api_keys: Array<{ key_hint: string; created_at: string }>;
  }>;
}

export default async function ProvidersPage() {
  const connected = await getConnectedProviders();
  const connectedIds = new Set(connected.map((p) => p.name));

  return (
    <TerminalShell active="Providers">
      <PageTitle eyebrow="BYOK Control Plane" title="Providers" subtitle="Connect model providers without locking RUNE to any single inference vendor." />

      <ProviderConnectForm />

      {/* Connected providers */}
      {connected.length > 0 && (
        <div className="mt-4">
          <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-rune-muted">Connected</p>
          <div className="grid gap-3 xl:grid-cols-2">
            {connected.map((provider) => {
              const cfg = PROVIDER_CONFIGS[provider.name as keyof typeof PROVIDER_CONFIGS];
              return (
                <Panel key={provider.id} className="p-5">
                  <div className="flex items-center justify-between">
                    <SectionHeader eyebrow={provider.status} title={cfg?.label ?? provider.name} />
                    <span className="h-2 w-2 rounded-full bg-white" />
                  </div>
                  <p className="mt-2 break-all text-sm text-rune-muted">{cfg?.baseUrl}</p>
                  {provider.api_keys[0] && (
                    <p className="mt-2 text-xs text-rune-muted">
                      Key: {provider.api_keys[0].key_hint} · Added {new Date(provider.api_keys[0].created_at).toLocaleDateString()}
                    </p>
                  )}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {(cfg?.capabilities ?? []).map((cap) => (
                      <span key={cap} className="border border-rune-border px-2 py-1 text-xs text-rune-muted">{cap}</span>
                    ))}
                  </div>
                </Panel>
              );
            })}
          </div>
        </div>
      )}

      {/* Available but not connected */}
      <div className="mt-6">
        <p className="mb-3 text-[10px] font-black uppercase tracking-[0.32em] text-rune-muted">Available</p>
        <div className="grid gap-3 xl:grid-cols-2">
          {Object.values(PROVIDER_CONFIGS)
            .filter((cfg) => !connectedIds.has(cfg.id))
            .map((provider) => (
              <Panel key={provider.id} className="p-5 opacity-50">
                <SectionHeader eyebrow="not connected" title={provider.label} />
                <p className="break-all text-sm text-rune-muted">{provider.baseUrl}</p>
                <div className="mt-4 flex flex-wrap gap-2">
                  {provider.capabilities.map((cap) => (
                    <span key={cap} className="border border-rune-border px-2 py-1 text-xs text-rune-muted">{cap}</span>
                  ))}
                </div>
              </Panel>
            ))}
        </div>
      </div>
    </TerminalShell>
  );
}
