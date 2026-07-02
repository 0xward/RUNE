"use client";

import {
  useAccount,
  useReadContract,
  useWriteContract,
  useWaitForTransactionReceipt,
  useCapabilities,
  useSendCalls,
  useCallsStatus,
} from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import { CONTRACTS, PAYMASTER_URL, ACTIVE_CHAIN } from "@/lib/web3/config";
import { RUNEPASS_ABI } from "@/lib/web3/abi";
import { RuneLogo } from "@/components/brand/rune-logo";
import Link from "next/link";
import { parseEther, encodeFunctionData } from "viem";

export default function MintPage() {
  const router = useRouter();
  const { address, isConnected, chainId } = useAccount();
  const [mintStatus, setMintStatus] = useState<"idle" | "minting" | "success" | "error">("idle");
  const [errorMsg, setErrorMsg] = useState("");

  // ── Read contract state ─────────────────────────────────────────────────
  const { data: hasPass, refetch: refetchHasPass } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "hasPass",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: totalSupply } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "totalSupply",
  });

  const { data: remainingFree } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "remainingFree",
  });

  const { data: mintOpen } = useReadContract({
    address: CONTRACTS.runePass,
    abi: RUNEPASS_ABI,
    functionName: "mintOpen",
  });

  const isFree = Number(remainingFree ?? 0) > 0;
  const slotsUsed = Number(totalSupply ?? 0);
  const slotsTotal = 100;
  const progressPct = Math.min(100, (slotsUsed / slotsTotal) * 100);

  // ── Gasless (Paymaster) capability detection ─────────────────────────────
  // Only wallets that support EIP-5792 batched calls (e.g. Coinbase Smart
  // Wallet) can receive sponsored transactions. Regular EOA wallets like
  // MetaMask fall back to the normal path automatically.
  const { data: availableCapabilities } = useCapabilities({
    account: address,
    query: { enabled: !!address && !!PAYMASTER_URL },
  });

  const supportsGasless = useMemo(() => {
    if (!availableCapabilities || !chainId) return false;
    const chainCaps = availableCapabilities[chainId];
    return Boolean(chainCaps?.paymasterService?.supported);
  }, [availableCapabilities, chainId]);

  // ── Standard mint path (pays gas normally) ──────────────────────────────
  const { writeContract, data: txHash, isPending } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({ hash: txHash });

  // ── Sponsored mint path (gasless via Paymaster) ─────────────────────────
  const { sendCalls, data: callsId, isPending: isSendingCalls } = useSendCalls();
  const { data: callsStatus } = useCallsStatus({
    id: callsId?.id as string,
    query: {
      enabled: !!callsId,
      refetchInterval: (data) => (data.state.data?.status === "success" ? false : 1000),
    },
  });

  const isGaslessConfirmed = callsStatus?.status === "success";

  useEffect(() => {
    if (isConfirmed || isGaslessConfirmed) {
      setMintStatus("success");
      refetchHasPass();
      const t = setTimeout(() => router.push("/overview"), 2500);
      return () => clearTimeout(t);
    }
  }, [isConfirmed, isGaslessConfirmed, refetchHasPass, router]);

  function handleMint() {
    setMintStatus("minting");
    setErrorMsg("");

    const mintValue = isFree ? 0n : parseEther("0.001");

    // Try gasless path first if the connected wallet supports it
    if (supportsGasless && PAYMASTER_URL) {
      try {
        sendCalls({
          calls: [
            {
              to: CONTRACTS.runePass,
              data: encodeFunctionData({ abi: RUNEPASS_ABI, functionName: "mint" }),
              value: mintValue,
            },
          ],
          capabilities: {
            paymasterService: { url: PAYMASTER_URL },
          },
        });
        return;
      } catch (err) {
        // Fall through to standard path below
        console.warn("Sponsored mint failed, falling back to standard mint:", err);
      }
    }

    // Standard path — wallet pays gas directly
    try {
      writeContract({
        address: CONTRACTS.runePass,
        abi: RUNEPASS_ABI,
        functionName: "mint",
        value: mintValue,
      });
    } catch (err) {
      setMintStatus("error");
      setErrorMsg(String(err));
    }
  }

  const isMinting = isPending || isConfirming || isSendingCalls || (!!callsId && !isGaslessConfirmed);

  return (
    <div className="min-h-screen bg-rune-bg text-white flex flex-col">
      {/* Nav */}
      <nav className="border-b border-rune-border px-6 py-4 flex items-center justify-between">
        <Link href="/" className="text-white">
          <RuneLogo size={22} />
        </Link>
        <ConnectButton showBalance={false} chainStatus="icon" />
      </nav>

      <div className="flex-1 flex items-center justify-center px-4 py-12">
        <div className="w-full max-w-xl">

          {/* Heading */}
          <div className="mb-8 text-center">
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.42em] text-rune-muted">
              · Soulbound Membership
            </p>
            <h1 className="text-4xl font-black uppercase leading-tight tracking-tight">
              Mint your RUNE Pass
            </h1>
            <p className="mt-3 text-sm leading-6 text-rune-muted">
              A soulbound intelligence passport on Base. Non-transferable proof of membership in the RUNE network.
            </p>
          </div>

          {/* SBT Preview */}
          <div className="mb-8 flex justify-center">
            <div className="relative w-64 aspect-[3/4] border border-rune-border bg-black overflow-hidden">
              <div className="absolute top-3 left-3 w-3 h-3 border-l border-t border-zinc-700" />
              <div className="absolute top-3 right-3 w-3 h-3 border-r border-t border-zinc-700" />
              <div className="absolute bottom-3 left-3 w-3 h-3 border-l border-b border-zinc-700" />
              <div className="absolute bottom-3 right-3 w-3 h-3 border-r border-b border-zinc-700" />

              <div className="flex flex-col items-center justify-center h-1/2 pt-8">
                <RuneLogo size={42} />
                <p className="mt-2 text-[8px] tracking-[0.5em] text-zinc-600">P A S S</p>
              </div>

              <div className="px-6 pt-4 border-t border-zinc-900">
                <p className="text-[8px] tracking-[0.3em] text-zinc-700">PASS ID</p>
                <p className="text-lg font-bold tracking-tight">#{isFree ? slotsUsed + 1 : "—"}</p>
                <p className="mt-3 text-[8px] tracking-[0.3em] text-zinc-700">TIER</p>
                <p className="text-xs font-bold tracking-wider text-zinc-300">
                  {isFree ? "GENESIS" : "STANDARD"}
                </p>
              </div>

              <div className="absolute bottom-5 left-6 right-6 flex items-center justify-between">
                <span className="border border-zinc-800 px-2 py-1 text-[7px] tracking-[0.2em] text-zinc-600">
                  SOULBOUND
                </span>
                <span className="flex items-center gap-1 text-[7px] tracking-wider text-zinc-600">
                  <span className="h-1 w-1 rounded-full bg-white" />
                  ACTIVE
                </span>
              </div>
            </div>
          </div>

          {/* FCFS Progress */}
          <div className="mb-6 border border-rune-border p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.28em] text-rune-muted">
                Free Mint Progress
              </span>
              <span className="text-[10px] font-black tracking-[0.2em] tabular-nums">
                {slotsUsed} / {slotsTotal}
              </span>
            </div>
            <div className="h-1.5 w-full bg-zinc-900 overflow-hidden">
              <div
                className="h-full bg-white transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
            <p className="mt-3 text-xs leading-5 text-rune-muted">
              {isFree
                ? `${Number(remainingFree)} free passes remaining — first come, first served.`
                : "Free allocation exhausted. Minting now costs 0.001 ETH."}
            </p>
          </div>

          {/* Gasless indicator */}
          {isConnected && PAYMASTER_URL && (
            <div className="mb-6 flex items-center justify-center gap-2 border border-rune-border bg-white/[0.02] px-4 py-2.5">
              <span className={`h-1.5 w-1.5 rounded-full ${supportsGasless ? "bg-white" : "bg-zinc-700"}`} />
              <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-rune-muted">
                {supportsGasless
                  ? "Gas sponsored by RUNE — this mint is free to sign"
                  : "This wallet pays gas directly (still under a cent on Base)"}
              </span>
            </div>
          )}

          {/* Mint action */}
          {!isConnected ? (
            <div className="text-center">
              <ConnectButton.Custom>
                {({ openConnectModal }) => (
                  <button
                    onClick={openConnectModal}
                    className="w-full border border-white bg-white text-black px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.22em] transition hover:bg-transparent hover:text-white"
                  >
                    Connect Wallet to Mint
                  </button>
                )}
              </ConnectButton.Custom>
              <p className="mt-3 text-[10px] text-rune-muted">
                Works with any wallet on Base. Coinbase Smart Wallet gets sponsored gas.
              </p>
            </div>
          ) : hasPass ? (
            <div className="text-center border border-white/30 bg-white/5 p-5">
              <p className="text-sm font-bold">✓ You already hold a RUNE Pass</p>
              <Link
                href="/overview"
                className="mt-3 inline-block border border-white px-6 py-2.5 text-[11px] font-black uppercase tracking-[0.2em] transition hover:bg-white hover:text-black"
              >
                Enter Terminal →
              </Link>
            </div>
          ) : !mintOpen ? (
            <div className="text-center border border-rune-border p-5">
              <p className="text-sm text-rune-muted">Minting is currently closed.</p>
            </div>
          ) : (
            <div className="text-center">
              <button
                onClick={handleMint}
                disabled={isMinting}
                className="w-full border border-white bg-white text-black px-6 py-3.5 text-[12px] font-black uppercase tracking-[0.22em] transition hover:bg-transparent hover:text-white disabled:opacity-50"
              >
                {isMinting
                  ? "Confirming…"
                  : supportsGasless
                  ? "Mint Free — Gas Sponsored →"
                  : isFree
                  ? "Mint Free Pass →"
                  : "Mint for 0.001 ETH →"}
              </button>

              {mintStatus === "success" && (
                <p className="mt-3 text-xs text-white">✓ Pass minted! Redirecting to terminal…</p>
              )}
              {mintStatus === "error" && (
                <p className="mt-3 text-xs text-red-400">{errorMsg || "Transaction failed."}</p>
              )}
              <p className="mt-3 text-[10px] text-rune-muted">
                One pass per wallet. Non-transferable. Deployed on Base.
              </p>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}
