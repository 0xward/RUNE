"use client";
import { Activity, Clock3, Database, Radio } from "lucide-react";
import { useEffect, useState } from "react";

export function Topbar({ active }: { active: string }) {
  const [time, setTime] = useState<string>("");
  const [sourceCount, setSourceCount] = useState<number | null>(null);
  const [anomalyCount, setAnomalyCount] = useState<number | null>(null);

  useEffect(() => {
    const update = () => setTime(new Date().toLocaleTimeString("en-US", { hour12: false }));
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  useEffect(() => {
    fetch("/api/signals")
      .then((r) => r.json())
      .then((res) => {
        const rows = (res.data ?? []) as Array<{ source: string }>;
        setSourceCount(new Set(rows.map((r) => r.source)).size);
      })
      .catch(() => setSourceCount(0));

    fetch("/api/anomalies")
      .then((r) => r.json())
      .then((res) => setAnomalyCount((res.data ?? []).length))
      .catch(() => setAnomalyCount(0));
  }, []);

  return (
    <div className="mb-6 border border-rune-border bg-rune-panel px-4 py-3">
      <div className="flex flex-col justify-between gap-3 lg:flex-row lg:items-center">
        <div className="flex items-center gap-4">
          <div>
            <p className="text-[10px] uppercase tracking-[0.28em] text-rune-muted">Current Surface</p>
            <h2 className="text-base font-semibold">{active}</h2>
          </div>
        </div>
        <div className="flex flex-wrap items-center gap-4 text-xs text-rune-muted">
          <span className="flex items-center gap-1.5">
            <Radio className="h-3 w-3 text-white" />
            <span className="text-white">live</span>
          </span>
          <span className="flex items-center gap-1.5">
            <Database className="h-3 w-3" />
            {sourceCount === null ? "…" : sourceCount} sources
          </span>
          <span className="flex items-center gap-1.5">
            <Activity className="h-3 w-3" />
            {anomalyCount === null ? "…" : anomalyCount} anomalies
          </span>
          <span className="flex items-center gap-1.5">
            <Clock3 className="h-3 w-3" />
            {time || "—"}
          </span>
        </div>
      </div>
    </div>
  );
}
