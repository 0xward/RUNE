"use client";

import Link from "next/link";
import { Activity, AlertTriangle, BarChart2, BookOpen, Circle, Eye, Home, Radio, Settings, Zap } from "lucide-react";
import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { RuneLogo } from "@/components/brand/rune-logo";
import { CONTRACTS } from "@/lib/web3/config";
import { RUNEPASS_ABI } from "@/lib/web3/abi";
import { useEffect, useState } from "react";

const navItems = [
  { label: "Overview",   href: "/overview",   icon: Home },
  { label: "Signals",    href: "/signals",    icon: Radio },
  { label: "Radar",      href: "/radar",      icon: Eye },
  { label: "Anomalies",  href: "/anomalies",  icon: AlertTriangle },
  { label: "Forecast",   href: "/forecast",   icon: BarChart2 },
  { label: "Watchlists", href: "/watchlists", icon: BookOpen },
  { label: "Providers",  href: "/providers",  icon: Zap },
  { label: "Settings",   href: "/settings",   icon: Settings },
];

interface ConnectedProvider {
  name: string;
  status: string;
}

export function LeftSidebar({ active }: { active: string }) {
  const { address } = useAccount();
  const [providers, setProviders] = useState<ConnectedProvider[]>([]);

  const { data: passId } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "passOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  useEffect(() => {
    fetch("/api/providers")
      .then((r) => r.json())
      .then((res) => {
        const data = (res.data ?? []) as Array<{ name: string; status: string }>;
        setProviders(data.map((p) => ({ name: p.name, status: p.status })));
      })
      .catch(() => setProviders([]));
  }, []);

  return (
    <aside className="flex h-screen flex-col border-r border-rune-border bg-rune-bg overflow-y-auto sticky top-0">
      {/* Logo */}
      <div className="border-b border-rune-border px-6 py-5">
        <Link href="/" className="block">
          <RuneLogo size={20} />
          <p className="mt-1 text-[10px] uppercase tracking-[0.28em] text-rune-muted">Signal Over Noise</p>
        </Link>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        {navItems.map(({ label, href, icon: Icon }) => {
          const isActive = label === active;
          return (
            <Link
              key={label}
              href={href}
              className={`flex items-center justify-between border px-3 py-2.5 text-sm transition-colors ${
                isActive
                  ? "border-rune-border bg-rune-panel text-white"
                  : "border-transparent text-rune-muted hover:border-rune-border hover:bg-rune-panel/50 hover:text-white"
              }`}
            >
              <span className="flex items-center gap-3">
                <Icon className="h-3.5 w-3.5 shrink-0" />
                {label}
              </span>
              {isActive && <Circle className="h-1.5 w-1.5 fill-white text-white" />}
            </Link>
          );
        })}
      </nav>

      {/* Connected Models */}
      <div className="border-t border-rune-border px-6 py-5">
        <p className="mb-4 text-[10px] uppercase tracking-[0.24em] text-rune-muted">Connected Models</p>
        {providers.length === 0 ? (
          <p className="text-xs text-rune-muted">
            None yet ·{" "}
            <Link href="/providers" className="text-white underline">connect one</Link>
          </p>
        ) : (
          <div className="space-y-2.5">
            {providers.map((provider) => (
              <div key={provider.name} className="flex items-center justify-between">
                <span className="text-sm font-medium capitalize">{provider.name}</span>
                <span className="flex items-center gap-2 text-[10px] text-rune-muted">
                  <span className={`h-1.5 w-1.5 rounded-full ${
                    provider.status === "connected" ? "bg-white" : "bg-zinc-700"
                  }`} />
                  {provider.status}
                </span>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Wallet / RunePass */}
      <div className="border-t border-rune-border px-6 py-5">
        <p className="mb-3 text-[10px] uppercase tracking-[0.24em] text-rune-muted">RunePass</p>
        <div className="flex items-center justify-between mb-3">
          <span className="text-sm font-medium">
            {passId ? `#${passId.toString()}` : "—"}
          </span>
          <Activity className="h-3.5 w-3.5 text-white" />
        </div>
        <ConnectButton showBalance={false} chainStatus="none" accountStatus="address" />
      </div>
    </aside>
  );
}
