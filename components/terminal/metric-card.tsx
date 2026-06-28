import { Panel } from "./panel";
import { TrendSparkline } from "./trend-sparkline";

export function MetricCard({ label, value, suffix, detail, trend }: { label: string; value: number; suffix: string; detail: string; trend: number[] }) {
  return (
    <Panel className="p-4">
      <p className="text-xs uppercase tracking-[0.2em] text-rune-muted">{label}</p>
      <div className="mt-4 text-3xl font-semibold">{value}{suffix}</div>
      <TrendSparkline values={trend} label={`${label} trend`} />
      <p className="text-xs text-rune-muted">{detail}</p>
    </Panel>
  );
}
