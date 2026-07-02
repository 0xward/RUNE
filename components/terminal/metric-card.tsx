interface MetricCardProps {
  label: string;
  value: number;
  suffix: string;
  detail: string;
  trend: number[];
}

export function MetricCard({ label, value, suffix, detail, trend }: MetricCardProps) {
  const min = Math.min(...trend);
  const max = Math.max(...trend);
  const range = max - min || 1;
  const w = 140;
  const h = 36;
  const pts = trend
    .map((v, i) => {
      const x = (i / (trend.length - 1)) * w;
      const y = h - ((v - min) / range) * h;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div className="border border-rune-border bg-rune-panel p-4">
      <p className="text-[10px] uppercase tracking-[0.24em] text-rune-muted">{label}</p>
      <div className="mt-3 flex items-end justify-between gap-2">
        <p className="text-4xl font-semibold tracking-tight">
          {value}{suffix}
        </p>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="mt-3 h-9 w-full">
        <polyline points={pts} fill="none" stroke="#ffffff" strokeWidth="1.2" strokeLinejoin="round" />
        {/* last dot */}
        {trend.length > 0 && (
          <circle
            cx={w}
            cy={h - ((trend[trend.length - 1] - min) / range) * h}
            r="2"
            fill="#fff"
          />
        )}
      </svg>
      <p className="mt-3 text-[10px] text-rune-muted">{detail}</p>
    </div>
  );
}
