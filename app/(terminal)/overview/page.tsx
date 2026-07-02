import { OverviewTerminal } from "@/components/terminal/overview";
import { PageTitle, TerminalShell } from "@/components/terminal/terminal-shell";

export const revalidate = 300;

export default function OverviewPage() {
  return (
    <TerminalShell active="Overview">
      <PageTitle
        eyebrow="Reality Intelligence Terminal"
        title="Overview"
        subtitle="A live operating picture for signals, trends, anomalies, and forecasts. Built for source synthesis, not conversation."
      />
      <OverviewTerminal />
    </TerminalShell>
  );
}
