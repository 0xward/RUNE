"use client";

import { useState } from "react";

export function CliBlock({ code }: { code: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(code).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  }

  return (
    <div className="flex items-center justify-between border border-rune-border bg-black/30 px-4 py-3 group">
      <div className="flex items-center gap-3 min-w-0">
        {/* Terminal prompt */}
        <span className="shrink-0 text-rune-muted text-[12px] font-mono select-none">$</span>
        {/* Command */}
        <code className="text-[13px] font-mono text-white tracking-tight truncate">
          {code}
        </code>
      </div>

      {/* Copy button */}
      <button
        onClick={handleCopy}
        aria-label="Copy command"
        className="shrink-0 ml-4 text-[9px] font-black uppercase tracking-[0.28em] text-rune-muted hover:text-white transition-colors"
      >
        {copied ? "Copied ✓" : "Copy"}
      </button>
    </div>
  );
}
