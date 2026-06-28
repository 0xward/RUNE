import Link from "next/link";
import { HeroAgent } from "@/components/landing/hero-agent";

export default function LandingPage() {
  return (
    <main className="min-h-screen overflow-hidden bg-rune-bg text-white">
      <section className="relative mx-auto grid min-h-screen max-w-7xl items-center gap-12 px-6 py-10 lg:grid-cols-[1fr_560px] lg:px-10">
        <div className="absolute inset-0 -z-0 bg-[radial-gradient(circle_at_20%_10%,rgba(255,255,255,0.10),transparent_24%),radial-gradient(circle_at_80%_70%,rgba(255,255,255,0.06),transparent_28%)]" />
        <div className="relative z-10">
          <div className="mb-8 inline-flex border border-rune-border bg-rune-panel px-3 py-2 text-xs uppercase tracking-[0.28em] text-rune-muted">
            RUNE · Signal Over Noise
          </div>
          <h1 className="max-w-4xl text-5xl font-semibold tracking-[-0.05em] md:text-7xl lg:text-8xl">
            See what others miss.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-rune-muted">
            RUNE is a reality intelligence terminal for signals, anomalies, forecasts, and provider-agnostic model workflows. Not a chatbot. An operating system for understanding change.
          </p>
          <div className="mt-10 flex flex-col gap-3 sm:flex-row">
            <Link href="/overview" className="border border-white px-5 py-3 text-sm font-medium transition hover:bg-white hover:text-black">Enter terminal</Link>
            <Link href="/providers" className="border border-rune-border bg-rune-panel px-5 py-3 text-sm text-rune-muted transition hover:text-white">Connect providers</Link>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 border border-rune-border bg-rune-panel">
            {["Signals", "Anomalies", "Forecasts"].map((item) => <div key={item} className="border-r border-rune-border p-4 last:border-r-0"><p className="text-xs uppercase tracking-[0.24em] text-rune-muted">{item}</p><p className="mt-2 text-2xl font-semibold">live</p></div>)}
          </div>
        </div>
        <div className="relative z-10">
          <HeroAgent />
        </div>
      </section>
    </main>
  );
}
