import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";
import { supabase } from "@/lib/supabase/server";

export const revalidate = 60;

async function getWatchlists() {
  const { data } = await supabase
    .from("watchlists")
    .select("id, name, topic_ids, created_at")
    .order("created_at", { ascending: false });

  const watchlists = (data ?? []) as unknown as Array<{ id: string; name: string; topic_ids: string[]; created_at: string }>;

  const allTopicIds = [...new Set(watchlists.flatMap((w) => w.topic_ids))];
  let topicMap: Record<string, string> = {};

  if (allTopicIds.length > 0) {
    const { data: topics } = await supabase
      .from("topics")
      .select("id, name")
      .in("id", allTopicIds);
    topicMap = Object.fromEntries(
      ((topics ?? []) as unknown as Array<{ id: string; name: string }>).map((t) => [t.id, t.name])
    );
  }

  const { data: anomalyRows } = await supabase
    .from("anomalies")
    .select("topic_id")
    .gte("detected_at", new Date(Date.now() - 86400000).toISOString());

  const anomalyCountByTopic: Record<string, number> = {};
  for (const row of (anomalyRows ?? []) as unknown as Array<{ topic_id: string }>) {
    anomalyCountByTopic[row.topic_id] = (anomalyCountByTopic[row.topic_id] ?? 0) + 1;
  }

  return watchlists.map((w) => ({
    ...w,
    topics: w.topic_ids.map((id) => topicMap[id] ?? id),
    alerts: w.topic_ids.reduce((sum, id) => sum + (anomalyCountByTopic[id] ?? 0), 0),
  }));
}

export default async function WatchlistsPage() {
  const watchlists = await getWatchlists();

  return (
    <TerminalShell active="Watchlists">
      <PageTitle eyebrow="Monitoring Workflow" title="Watchlists" subtitle="Persistent topic sets that turn the terminal into an always-on intelligence monitor." />
      {watchlists.length === 0 ? (
        <Panel className="p-8 text-center">
          <p className="text-sm text-rune-muted">No watchlists yet. Add topics from the Settings page to get started.</p>
        </Panel>
      ) : (
        <div className="grid gap-4 xl:grid-cols-3">
          {watchlists.map((watchlist) => (
            <Panel key={watchlist.id} className="p-5">
              <SectionHeader eyebrow={`${watchlist.alerts} alert${watchlist.alerts !== 1 ? "s" : ""}`} title={watchlist.name} />
              {watchlist.topics.map((topic) => (
                <p key={topic} className="border-t border-rune-border py-2 text-sm text-rune-muted">{topic}</p>
              ))}
            </Panel>
          ))}
        </div>
      )}
    </TerminalShell>
  );
}
