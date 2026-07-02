"use client";

import { getDefaultConfig } from "@rainbow-me/rainbowkit";
import { base, baseSepolia } from "wagmi/chains";

const isTestnet = process.env.NEXT_PUBLIC_USE_TESTNET === "true";

export const wagmiConfig = getDefaultConfig({
  appName: "RUNE",
  projectId: process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID ?? "",
  chains: isTestnet ? [baseSepolia] : [base],
  ssr: true,
});

export const ACTIVE_CHAIN = isTestnet ? baseSepolia : base;

export const CONTRACTS = {
  runePass: (process.env.NEXT_PUBLIC_RUNEPASS_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  runeToken: (process.env.NEXT_PUBLIC_RUNETOKEN_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
  runeRewards: (process.env.NEXT_PUBLIC_RUNEREWARDS_ADDRESS ?? "0x0000000000000000000000000000000000000000") as `0x${string}`,
};

/**
 * Paymaster (Coinbase Developer Platform).
 *
 * When set, sponsored (gasless) minting becomes available for wallets that
 * support EIP-5792 batched/sponsored calls — e.g. Coinbase Smart Wallet.
 * Regular EOA wallets (MetaMask, etc.) will simply fall back to paying gas
 * normally; the mint page detects this automatically via useCapabilities.
 *
 * Get a Paymaster & Bundler URL from:
 * https://portal.cdp.coinbase.com → your project → Paymaster → Configuration
 */
export const PAYMASTER_URL = process.env.NEXT_PUBLIC_PAYMASTER_URL ?? "";
