"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { saveWatchlistAction } from "@/app/actions";

export function AddWatchlistForm() {
  const router = useRouter();
  const [name, setName] = useState("My Watchlist");
  const [topicsInput, setTopicsInput] = useState("");
  const [status, setStatus] = useState<"idle" | "saving" | "done" | "error">("idle");
  const [message, setMessage] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const topics = topicsInput.split(",").map((t) => t.trim()).filter(Boolean);
    if (topics.length === 0) {
      setStatus("error");
      setMessage("Add at least one topic, comma-separated.");
      return;
    }

    setStatus("saving");
    const fd = new FormData();
    fd.append("name", name);
    fd.append("topics", topics.join(","));

    const result = await saveWatchlistAction(fd);
    if (result.ok) {
      setStatus("done");
      setMessage(`Saved ${result.topicCount} topics. Pipeline will pick them up on next run.`);
      setTopicsInput("");
      router.refresh();
    } else {
      setStatus("error");
      setMessage(result.message);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block mb-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-rune-muted">
          Watchlist name
        </label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white"
        />
      </div>
      <div>
        <label className="block mb-1.5 text-[10px] font-black uppercase tracking-[0.24em] text-rune-muted">
          Topics (comma-separated)
        </label>
        <input
          value={topicsInput}
          onChange={(e) => setTopicsInput(e.target.value)}
          placeholder="AI Agents, On-device Models, Synthetic Data"
          className="w-full border border-rune-border bg-rune-bg px-3 py-2 text-sm text-white placeholder:text-rune-muted"
        />
      </div>
      <button
        disabled={status === "saving"}
        className="w-full border border-white px-4 py-2.5 text-[11px] font-black uppercase tracking-[0.22em] transition hover:bg-white hover:text-black disabled:opacity-50"
      >
        {status === "saving" ? "Saving…" : "Save watchlist"}
      </button>
      {message && (
        <p className={`text-xs ${status === "error" ? "text-red-400" : "text-rune-muted"}`}>
          {status === "done" ? "✓ " : ""}{message}
        </p>
      )}
    </form>
  );
}
