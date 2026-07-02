"use client";

import { useAccount, useReadContract } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useRouter } from "next/navigation";
import { CONTRACTS } from "@/lib/web3/config";
import { RUNEPASS_ABI } from "@/lib/web3/abi";
import { RuneLogo } from "@/components/brand/rune-logo";
import { ReactNode } from "react";
import Link from "next/link";

export function RunePassGate({ children }: { children: ReactNode }) {
  const router = useRouter();
  const { address, isConnected } = useAccount();

  const { data: hasPass, isLoading } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "hasPass",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  // Not connected — show connect screen
  if (!isConnected) {
    return (
      <div className="min-h-screen bg-rune-bg text-white flex flex-col items-center justify-center px-4">
        <RuneLogo size={36} className="mb-6" />
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.42em] text-rune-muted">
          · Access Required
        </p>
        <h1 className="mb-3 text-2xl font-black uppercase tracking-tight text-center">
          Connect your wallet
        </h1>
        <p className="mb-8 max-w-sm text-center text-sm leading-6 text-rune-muted">
          The RUNE terminal requires a RunePass — a soulbound membership token on Base.
        </p>
        <ConnectButton.Custom>
          {({ openConnectModal }) => (
            <button
              onClick={openConnectModal}
              className="border border-white bg-white text-black px-8 py-3 text-[12px] font-black uppercase tracking-[0.22em] transition hover:bg-transparent hover:text-white"
            >
              Connect Wallet
            </button>
          )}
        </ConnectButton.Custom>
      </div>
    );
  }

  // Loading
  if (isLoading) {
    return (
      <div className="min-h-screen bg-rune-bg text-white flex items-center justify-center">
        <p className="text-sm text-rune-muted animate-pulse">Verifying RunePass…</p>
      </div>
    );
  }

  // Connected but no pass — redirect to mint
  if (!hasPass) {
    return (
      <div className="min-h-screen bg-rune-bg text-white flex flex-col items-center justify-center px-4">
        <RuneLogo size={36} className="mb-6" />
        <p className="mb-2 text-[10px] font-black uppercase tracking-[0.42em] text-rune-muted">
          · No RunePass Found
        </p>
        <h1 className="mb-3 text-2xl font-black uppercase tracking-tight text-center">
          You need a RunePass
        </h1>
        <p className="mb-8 max-w-sm text-center text-sm leading-6 text-rune-muted">
          This wallet doesn&apos;t hold a RUNE Pass yet. Mint one to access the terminal.
        </p>
        <Link
          href="/mint"
          className="border border-white bg-white text-black px-8 py-3 text-[12px] font-black uppercase tracking-[0.22em] transition hover:bg-transparent hover:text-white"
        >
          Mint RunePass →
        </Link>
      </div>
    );
  }

  // Has pass — show terminal
  return <>{children}</>;
}
