import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { supabase } from "@/lib/supabase/server";

export const revalidate = 600;

async function getForecasts() {
  const { data } = await supabase
    .from("forecasts")
    .select("id, probability, horizon, summary, evidence, model_provider, created_at, topics(name)")
    .order("created_at", { ascending: false })
    .limit(9);
  return (data ?? []) as unknown as Array<{
    id: string;
    probability: number;
    horizon: string;
    summary: string;
    evidence: string[];
    model_provider: string;
    topics: { name: string } | null;
  }>;
}

export default async function ForecastPage() {
  const forecasts = await getForecasts();

  return (
    <TerminalShell active="Forecast">
      <PageTitle eyebrow="Predictive Layer" title="Forecast" subtitle="Probabilistic theses generated from signal strength, source diversity, trend velocity, and provider consensus." />
      {forecasts.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-sm text-rune-muted">No forecasts yet. Connect a provider and run the intelligence pipeline to generate AI forecasts.</p>
        </Panel>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {forecasts.map((forecast) => (
            <Panel key={forecast.id} className="p-5">
              <SectionHeader eyebrow={forecast.horizon} title={forecast.topics?.name ?? ""} />
              <div className="text-5xl font-semibold">{forecast.probability}%</div>
              <p className="mt-4 text-sm leading-6 text-rune-muted">{forecast.summary}</p>
              <div className="mt-5 border-t border-rune-border pt-4">
                {(forecast.evidence ?? []).map((driver) => (
                  <p key={driver} className="py-1 text-sm text-rune-muted">→ {driver}</p>
                ))}
              </div>
              <p className="mt-4 text-[10px] uppercase tracking-[0.2em] text-rune-muted">via {forecast.model_provider}</p>
            </Panel>
          ))}
        </div>
      )}
    </TerminalShell>
  );
}
