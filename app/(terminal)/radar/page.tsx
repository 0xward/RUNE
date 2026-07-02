import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { SignalNetwork } from "@/components/terminal/signal-network";
import { supabase } from "@/lib/supabase/server";

export const revalidate = 300;

async function getTopicData() {
  const since = new Date(Date.now() - 86400000 * 3).toISOString();
  const { data } = await supabase
    .from("signals")
    .select("topic_id, topics(name), signal_scores(momentum, confidence, velocity)")
    .gte("observed_at", since)
    .limit(60);

  const rows = (data ?? []) as unknown as Array<{
    topic_id: string;
    topics: { name: string } | null;
    signal_scores: Array<{ momentum: number; confidence: number; velocity: number }> | null;
  }>;

  const map = new Map<string, { id: string; label: string; scores: number[] }>();
  for (const row of rows) {
    const id = row.topic_id;
    const label = row.topics?.name ?? "Unknown";
    if (!map.has(id)) map.set(id, { id, label, scores: [] });
    if (row.signal_scores?.[0]) map.get(id)!.scores.push(row.signal_scores[0].momentum);
  }

  return [...map.values()]
    .map((t) => ({
      id: t.id,
      label: t.label,
      momentum: t.scores.length ? Math.round(t.scores.reduce((a, b) => a + b, 0) / t.scores.length) : 0,
    }))
    .sort((a, b) => b.momentum - a.momentum);
}

export default async function RadarPage() {
  const topics = await getTopicData();

  return (
    <TerminalShell active="Radar">
      <PageTitle eyebrow="Relationship Intelligence" title="Radar" subtitle="Map the adjacency between topics, infrastructure, sources, and second-order consequences." />
      <div className="grid gap-4 xl:grid-cols-[1fr_360px]">
        <Panel className="p-4">
          <SectionHeader eyebrow="Graph" title="Topic Relationships" />
          <SignalNetwork topics={topics} />
        </Panel>
        <Panel className="p-4">
          <SectionHeader eyebrow="Proximity" title="Nearest Movers" />
          {topics.length === 0 ? (
            <p className="py-8 text-sm text-rune-muted text-center">No topic data yet.</p>
          ) : (
            topics.map((topic) => (
              <div key={topic.id} className="border-t border-rune-border py-3">
                <p className="font-medium">{topic.label}</p>
                <p className="text-sm text-rune-muted">Momentum {topic.momentum}%</p>
              </div>
            ))
          )}
        </Panel>
      </div>
    </TerminalShell>
  );
}
