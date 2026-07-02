import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { supabase } from "@/lib/supabase/server";

export const revalidate = 300;

async function getSignals() {
  const since = new Date(Date.now() - 86400000 * 3).toISOString();
  const { data } = await supabase
    .from("signals")
    .select("id, title, source, source_url, observed_at, topics(name), signal_scores(momentum, confidence, velocity)")
    .gte("observed_at", since)
    .order("observed_at", { ascending: false })
    .limit(40);
  return (data ?? []) as unknown as Array<{
    id: string;
    title: string;
    source: string;
    source_url: string;
    observed_at: string;
    topics: { name: string } | null;
    signal_scores: Array<{ momentum: number; confidence: number; velocity: number }> | null;
  }>;
}

function aggregateByTopic(rows: Awaited<ReturnType<typeof getSignals>>) {
  const map = new Map<string, { topic: string; sources: Set<string>; scores: number[]; count: number }>();
  for (const row of rows) {
    const topic = row.topics?.name ?? "Unknown";
    if (!map.has(topic)) map.set(topic, { topic, sources: new Set(), scores: [], count: 0 });
    const entry = map.get(topic)!;
    entry.sources.add(row.source);
    entry.count++;
    if (row.signal_scores?.[0]) entry.scores.push(row.signal_scores[0].momentum);
  }
  return [...map.values()].map((t) => ({
    topic: t.topic,
    sources: [...t.sources],
    count: t.count,
    momentum: t.scores.length ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0,
    confidence: Math.min(100, t.count * 5 + 60),
    velocity: Math.min(100, t.count * 4 + 50),
  })).sort((a, b) => b.momentum - a.momentum);
}

export default async function SignalsPage() {
  const rows = await getSignals();
  const signals = aggregateByTopic(rows);

  return (
    <TerminalShell active="Signals">
      <PageTitle eyebrow="Signal Registry" title="Signals" subtitle="Ranked source movement with momentum, confidence, velocity, and provenance." />
      <Panel className="p-4">
        <SectionHeader eyebrow={`${signals.length} active topics`} title="Signal Table" />
        {signals.length === 0 ? (
          <p className="py-8 text-sm text-rune-muted text-center">No signals yet — add topics to your watchlist to start tracking.</p>
        ) : (
          <div className="divide-y divide-rune-border">
            {signals.map((signal) => (
              <div key={signal.topic} className="grid gap-3 py-4 md:grid-cols-[1fr_140px_140px_160px] md:items-center">
                <div>
                  <h2 className="font-medium">{signal.topic}</h2>
                  <p className="text-sm text-rune-muted">{signal.sources.join(" / ")} · {signal.count} items</p>
                </div>
                <div className="text-sm">+{signal.momentum}% momentum</div>
                <div className="text-sm text-rune-muted">{signal.confidence}% confidence</div>
                <div className="h-1.5 bg-zinc-900">
                  <div className="h-full bg-white transition-all" style={{ width: `${signal.velocity}%` }} />
                </div>
              </div>
            ))}
          </div>
        )}
      </Panel>
    </TerminalShell>
  );
}
