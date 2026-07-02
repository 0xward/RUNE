"use client";

import { useState } from "react";

export function TriggerPipelineButton() {
  const [status, setStatus] = useState<"idle" | "running" | "done" | "error">("idle");
  const [result, setResult] = useState<string>("");

  async function handleTrigger() {
    setStatus("running");
    setResult("");
    try {
      const res = await fetch("/api/intelligence/snapshot", { method: "GET" });
      const data = await res.json() as { generatedAt?: string; signals?: unknown[]; error?: string };
      if (res.ok) {
        setStatus("done");
        setResult(`Pipeline complete · ${new Date(data.generatedAt ?? "").toLocaleTimeString()}`);
      } else {
        setStatus("error");
        setResult(data.error ?? "Unknown error");
      }
    } catch (err) {
      setStatus("error");
      setResult(String(err));
    }
  }

  return (
    <div>
      <button
        onClick={handleTrigger}
        disabled={status === "running"}
        className="w-full border border-white bg-white text-black px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] transition hover:bg-transparent hover:text-white disabled:opacity-50"
      >
        {status === "running" ? "Running pipeline…" : "Run pipeline now"}
      </button>
      {result && (
        <p className={`mt-2 text-xs ${status === "error" ? "text-red-400" : "text-rune-muted"}`}>
          {status === "done" ? "✓ " : "✗ "}{result}
        </p>
      )}
      <p className="mt-2 text-[10px] text-rune-muted">
        Pipeline runs automatically every 6 hours via cron. Use this to trigger manually.
      </p>
    </div>
  );
}
