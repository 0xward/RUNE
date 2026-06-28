import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";
import { Panel, SectionHeader } from "@/components/terminal/panel";

const watchlists = [
  { name: "Agentic Workflows", topics: ["AI Agents", "Browser Automation", "Model Routing"], alerts: 8 },
  { name: "Private Inference", topics: ["On-device Models", "Edge Hardware", "Compliance"], alerts: 4 },
  { name: "Synthetic Data", topics: ["Data Generation", "Benchmarks", "Evaluation"], alerts: 3 },
];

export default function WatchlistsPage() {
  return (
    <TerminalShell active="Watchlists">
      <PageTitle eyebrow="Monitoring Workflow" title="Watchlists" subtitle="Persistent topic sets that turn the terminal into an always-on intelligence monitor." />
      <div className="grid gap-4 xl:grid-cols-3">
        {watchlists.map((watchlist) => (
          <Panel key={watchlist.name} className="p-5">
            <SectionHeader eyebrow={`${watchlist.alerts} alerts`} title={watchlist.name} />
            {watchlist.topics.map((topic) => <p key={topic} className="border-t border-rune-border py-2 text-sm text-rune-muted">{topic}</p>)}
          </Panel>
        ))}
      </div>
    </TerminalShell>
  );
}
