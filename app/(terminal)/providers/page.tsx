import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { providers } from "@/lib/intelligence/mock-data";
import { ProviderConnectForm } from "@/components/terminal/provider-form";

export default function ProvidersPage() {
  return (
    <TerminalShell active="Providers">
      <PageTitle eyebrow="BYOK Control Plane" title="Providers" subtitle="Connect model providers without locking RUNE to any single inference vendor." />
      <ProviderConnectForm />
      <div className="mt-4 grid gap-4 xl:grid-cols-2">
        {providers.map((provider) => (
          <Panel key={provider.id} className="p-5">
            <SectionHeader eyebrow={provider.status.replace("_", " ")} title={provider.label} />
            <p className="break-all text-sm text-rune-muted">{provider.baseUrl}</p>
            <div className="mt-4 flex flex-wrap gap-2">
              {provider.capabilities.map((capability) => <span key={capability} className="border border-rune-border px-2 py-1 text-xs text-rune-muted">{capability}</span>)}
            </div>
            <button className="mt-5 w-full border border-rune-border px-4 py-2 text-sm transition hover:bg-white hover:text-black">Configure encrypted key</button>
          </Panel>
        ))}
      </div>
    </TerminalShell>
  );
}
