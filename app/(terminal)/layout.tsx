import type { ReactNode } from "react";
import { RunePassGate } from "@/components/web3/runepass-gate";

export default function TerminalRouteLayout({ children }: { children: ReactNode }) {
  return <RunePassGate>{children}</RunePassGate>;
}
