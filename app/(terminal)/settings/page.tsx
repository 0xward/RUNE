import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { TriggerPipelineButton } from "@/components/terminal/trigger-pipeline-button";
import { AddWatchlistForm } from "@/components/terminal/add-watchlist-form";
import { supabase } from "@/lib/supabase/server";

export const revalidate = 0;

async function getStats() {
  const [topics, watchlists, providers] = await Promise.all([
    supabase.from("topics").select("*", { count: "exact", head: true }),
    supabase.from("watchlists").select("*", { count: "exact", head: true }),
    supabase.from("providers").select("*", { count: "exact", head: true }).eq("status", "connected"),
  ]);
  return {
    topics: topics.count ?? 0,
    watchlists: watchlists.count ?? 0,
    providers: providers.count ?? 0,
  };
}

export default async function SettingsPage() {
  const stats = await getStats();

  return (
    <TerminalShell active="Settings">
      <PageTitle eyebrow="Terminal Configuration" title="Settings" subtitle="Configure pipeline, manage topics, and monitor system health." />
      <div className="grid gap-4 xl:grid-cols-2">

        {/* Pipeline control */}
        <Panel className="p-5">
          <SectionHeader eyebrow="Engine" title="Pipeline Control" />
          <div className="mt-3 space-y-3">
            {[
              { label: "Topics being tracked", value: String(stats.topics) },
              { label: "Active watchlists", value: String(stats.watchlists) },
              { label: "Connected providers", value: String(stats.providers) },
              { label: "Cron schedule", value: "Daily, 06:00 UTC" },
              { label: "Max pipeline duration", value: "300s" },
            ].map((item) => (
              <div key={item.label} className="flex items-center justify-between border-t border-rune-border py-3 text-sm">
                <span className="text-rune-muted">{item.label}</span>
                <span className="font-medium">{item.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-rune-border pt-4">
            <TriggerPipelineButton />
          </div>
        </Panel>

        {/* Operating parameters */}
        <Panel className="p-5">
          <SectionHeader eyebrow="Defaults" title="Operating Parameters" />
          {[
            "Minimum confidence: 72%",
            "Anomaly threshold: 2.5σ",
            "Forecast horizons: 30D / 90D / 180D",
            "Provider consensus: majority weighted",
            "Signal decay window: 7 days",
            "Batch size: 4 topics per run",
          ].map((item) => (
            <p key={item} className="border-t border-rune-border py-3 text-sm text-rune-muted">{item}</p>
          ))}
        </Panel>

        {/* Watchlist creation */}
        <Panel className="p-5 xl:col-span-2">
          <SectionHeader eyebrow="Tracking" title="Add Topics to Watchlist" />
          <div className="mt-3">
            <AddWatchlistForm />
          </div>
        </Panel>

      </div>
    </TerminalShell>
  );
}
