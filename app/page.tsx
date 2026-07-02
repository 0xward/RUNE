import Link from "next/link";
import { ForceGraph } from "@/components/landing/force-graph";
import { CliBlock } from "@/components/landing/cli-block";
import { RuneLogo } from "@/components/brand/rune-logo";

export default function LandingPage() {
  return (
    <main className="min-h-screen bg-rune-bg text-white overflow-x-hidden">

      {/* NAV */}
      <nav className="fixed top-0 inset-x-0 z-50 border-b border-rune-border bg-rune-bg/90 backdrop-blur-sm">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-6 py-4 lg:px-10">
          <RuneLogo size={20} />
          <div className="hidden items-center gap-8 md:flex">
            <a href="#features" className="text-[11px] font-bold tracking-[0.32em] uppercase text-rune-muted hover:text-white transition">Features</a>
            <a href="#product" className="text-[11px] font-bold tracking-[0.32em] uppercase text-rune-muted hover:text-white transition">Product</a>
            <a href="#pricing" className="text-[11px] font-bold tracking-[0.32em] uppercase text-rune-muted hover:text-white transition">Pricing</a>
            <a href="#docs" className="text-[11px] font-bold tracking-[0.32em] uppercase text-rune-muted hover:text-white transition">Docs</a>
            <a href="#company" className="text-[11px] font-bold tracking-[0.32em] uppercase text-rune-muted hover:text-white transition">Company</a>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/overview" className="hidden text-[11px] font-bold tracking-[0.28em] uppercase text-rune-muted hover:text-white transition md:block">Log in</Link>
            <Link href="/mint" className="border border-white bg-white px-4 py-2 text-[11px] font-black tracking-[0.22em] uppercase text-black transition hover:bg-transparent hover:text-white">
              Mint Pass
            </Link>
          </div>
        </div>
      </nav>

      {/* HERO — full-bleed bg image */}
      <section className="relative min-h-screen pt-16 pb-0 overflow-hidden">

        {/* Background image — positioned right, bleeding off edge */}
        <div
          className="absolute inset-0 bg-cover bg-right bg-no-repeat"
          style={{ backgroundImage: "url('/hero-bg.png')" }}
        />

        {/* Dark overlay — heavier on the left so text is readable */}
        <div className="absolute inset-0 bg-gradient-to-r from-rune-bg via-rune-bg/85 to-rune-bg/20 lg:from-rune-bg lg:via-rune-bg/80 lg:to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-rune-bg/60" />

        {/* corner crosshairs */}
        <div className="pointer-events-none absolute inset-0 overflow-hidden z-10">
          <div className="absolute left-6 top-20 h-4 w-4 border-l border-t border-white/20" />
          <div className="absolute right-6 top-20 h-4 w-4 border-r border-t border-white/20" />
          <div className="absolute bottom-0 left-6 h-4 w-4 border-l border-b border-white/20" />
          <div className="absolute bottom-0 right-6 h-4 w-4 border-r border-b border-white/20" />
        </div>

        <div className="relative z-10 mx-auto max-w-7xl px-6 lg:px-10">
          <div className="flex min-h-screen items-center">
            {/* LEFT COPY — max ~55% wide on desktop, full on mobile */}
            <div className="w-full lg:max-w-[58%] py-24 lg:py-0">

              {/* Eyebrow */}
              <p className="mb-6 text-[10px] font-black tracking-[0.48em] uppercase text-rune-muted">
                · Intelligence Terminal
              </p>

              {/* Big headline — Hermes-style: extrabold, huge tracking */}
              <h1 className="font-black uppercase leading-[0.95] tracking-[-0.01em]" style={{ fontSize: "clamp(3.2rem, 8vw, 7rem)" }}>
                Signal<br />Over<br />Noise.
              </h1>

              {/* Sub */}
              <p className="mt-8 max-w-md text-sm leading-7 text-rune-muted tracking-[0.04em]">
                RUNE helps you understand what&apos;s really happening in the world — before everyone else does.
              </p>

              {/* Feature list */}
              <ul className="mt-6 space-y-2">
                {[
                  "Real-time signals from thousands of sources",
                  "AI-powered analysis and forecasting",
                  "Bring your own API keys",
                  "Private, fast, and built for builders",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3">
                    <span className="mt-0.5 text-white text-xs font-black">+</span>
                    <span className="text-[11px] font-semibold tracking-[0.18em] uppercase text-rune-muted">{item}</span>
                  </li>
                ))}
              </ul>

              {/* CTAs */}
              <div className="mt-10 flex flex-col gap-3 sm:flex-row">
                <Link
                  href="/mint"
                  className="inline-flex items-center gap-2 border border-white bg-white px-6 py-3 text-[11px] font-black tracking-[0.28em] uppercase text-black transition hover:bg-transparent hover:text-white"
                >
                  Mint Your Pass →
                </Link>
                <a
                  href="#demo"
                  className="inline-flex items-center gap-2 border border-rune-border px-6 py-3 text-[11px] font-black tracking-[0.28em] uppercase text-rune-muted transition hover:border-white hover:text-white"
                >
                  Watch Demo ▶
                </a>
              </div>

              {/* Status bar */}
              <div className="mt-12 flex items-center gap-4 border-t border-rune-border pt-6">
                <div className="flex items-center gap-2">
                  <span className="h-1.5 w-1.5 rounded-full bg-white animate-ping" />
                  <span className="text-[9px] font-black tracking-[0.4em] uppercase text-rune-muted">Signal Feed · Live</span>
                </div>
                <div className="h-3 w-px bg-rune-border" />
                <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-rune-muted">HackerNews · arXiv · GitHub</span>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll hint */}
        <div className="absolute bottom-8 left-10 z-10 hidden flex-col items-center gap-2 text-[9px] font-black uppercase tracking-[0.38em] text-rune-muted lg:flex">
          <span>Scroll</span>
          <div className="h-8 w-px bg-rune-border" />
        </div>
      </section>

      {/* VIDEO SECTION */}
      <section id="demo" className="border-t border-rune-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="py-8">
            <p className="mb-1 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">· See It In Action</p>
          </div>
        </div>
        <div className="relative w-full overflow-hidden border-b border-rune-border bg-black">
          {/* corner marks */}
          <div className="pointer-events-none absolute left-4 top-4 z-10 h-4 w-4 border-l-2 border-t-2 border-white/30" />
          <div className="pointer-events-none absolute right-4 top-4 z-10 h-4 w-4 border-r-2 border-t-2 border-white/30" />
          <div className="pointer-events-none absolute bottom-4 left-4 z-10 h-4 w-4 border-b-2 border-l-2 border-white/30" />
          <div className="pointer-events-none absolute bottom-4 right-4 z-10 h-4 w-4 border-b-2 border-r-2 border-white/30" />

          <video
            src="/rune-demo.mp4"
            autoPlay
            loop
            muted
            playsInline
            className="w-full object-cover"
            style={{ maxHeight: "600px" }}
          />
          <div className="pointer-events-none absolute bottom-0 inset-x-0 h-24 bg-gradient-to-t from-rune-bg to-transparent" />
        </div>
      </section>

      {/* FEATURES */}
      <section id="features" className="py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <h2 className="mb-16 max-w-xl font-black uppercase leading-[1.0] tracking-[-0.01em]" style={{ fontSize: "clamp(2rem, 5vw, 3.5rem)" }}>
            Built for clarity<br />in a noisy world.
          </h2>
          <div className="grid gap-px border border-rune-border bg-rune-border md:grid-cols-2 lg:grid-cols-4">
            {[
              {
                icon: "◎",
                title: "Reality Intelligence",
                desc: "Aggregate millions of signals from the open internet, on-chain data, developer activity, and more — in real time.",
              },
              {
                icon: "▦",
                title: "AI-Powered Analysis",
                desc: "Advanced models detect patterns, anomalies, and opportunities humans would miss.",
              },
              {
                icon: "⊠",
                title: "Bring Your Own Keys",
                desc: "Connect your favorite AI providers. You own your keys. You control your costs.",
              },
              {
                icon: "⚡",
                title: "Private by Design",
                desc: "Your data stays yours. We never train on your data. End-to-end encryption, always.",
              },
            ].map((feature) => (
              <div key={feature.title} className="bg-rune-bg p-8">
                <div className="mb-6 text-2xl">{feature.icon}</div>
                <h3 className="mb-3 text-[11px] font-black tracking-[0.28em] uppercase">{feature.title}</h3>
                <p className="text-xs leading-6 text-rune-muted tracking-[0.04em]">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* BYOK TRUST SECTION */}
      <section className="border-t border-rune-border py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          {/* Header */}
          <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">· Your Keys. Your Control.</p>
              <h2 className="font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                We never touch<br />your API keys.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-rune-muted tracking-[0.04em]">
              RUNE is model-agnostic. You connect your own AI providers — OpenAI, Anthropic, Groq, Gemini — and pay your own usage costs. We just run the intelligence layer on top.
            </p>
          </div>

          {/* How it works — 3 steps */}
          <div className="grid gap-px border border-rune-border bg-rune-border md:grid-cols-3 mb-16">
            {[
              {
                step: "01",
                title: "You Submit a Key",
                desc: "Your API key is encrypted client-side before it ever touches our servers. We store only the encrypted blob — never the raw key.",
              },
              {
                step: "02",
                title: "RUNE Runs Analysis",
                desc: "When RUNE needs to generate a forecast or analysis, it decrypts your key in a sandboxed environment, makes the API call, then discards it immediately.",
              },
              {
                step: "03",
                title: "Bill Goes to You",
                desc: "Usage appears on your OpenAI / Anthropic / Groq bill directly. RUNE never sees your usage volume, your spend, or your output.",
              },
            ].map((item) => (
              <div key={item.step} className="bg-rune-bg p-8">
                <p className="mb-6 text-[9px] font-black tracking-[0.42em] uppercase text-rune-muted">{item.step}</p>
                <h3 className="mb-3 text-[11px] font-black tracking-[0.28em] uppercase">{item.title}</h3>
                <p className="text-xs leading-6 text-rune-muted tracking-[0.04em]">{item.desc}</p>
              </div>
            ))}
          </div>

          {/* Trust statements */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            {[
              { icon: "⊘", claim: "We never store raw API keys" },
              { icon: "⊘", claim: "We never train on your data" },
              { icon: "⊘", claim: "We never see your AI usage or costs" },
              { icon: "⊘", claim: "Remove your key anytime, instantly" },
            ].map((t) => (
              <div key={t.claim} className="flex items-start gap-3 border border-rune-border p-4">
                <span className="mt-0.5 text-sm text-white">{t.icon}</span>
                <span className="text-[11px] font-semibold tracking-[0.14em] uppercase text-rune-muted leading-5">{t.claim}</span>
              </div>
            ))}
          </div>

          {/* Bottom line */}
          <div className="mt-12 border-t border-rune-border pt-8">
            <p className="text-[11px] font-black tracking-[0.28em] uppercase text-rune-muted">
              Why BYOK? — <span className="text-white">Because the moment we hold your key, the power shifts to us. We don&apos;t want that. You shouldn&apos;t either.</span>
            </p>
          </div>

        </div>
      </section>

      {/* SIGNAL NETWORK — full width force graph */}
      <section id="product" className="border-t border-rune-border">
        <div className="mx-auto max-w-7xl px-6 lg:px-10 py-10">
          <p className="mb-1 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">· Signal Network</p>
          <h2 className="mb-8 font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(1.6rem, 3vw, 2.2rem)" }}>
            Live Intelligence Graph
          </h2>
        </div>
        <ForceGraph />
      </section>


      {/* CLI SECTION */}
      <section id="cli" className="border-t border-rune-border py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">

          <div className="mb-16 flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">· Terminal Native</p>
              <h2 className="font-black uppercase leading-[0.95]" style={{ fontSize: "clamp(1.8rem, 4vw, 3rem)" }}>
                Run RUNE from<br />your terminal.
              </h2>
            </div>
            <p className="max-w-sm text-sm leading-7 text-rune-muted tracking-[0.04em]">
              Install the CLI and get real-time signals, AI forecasts, and anomaly detection — without leaving your command line.
            </p>
          </div>

          <div className="mb-8">
            <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-rune-muted">Install</p>
            <CliBlock code="npm install -g rune-cli" />
          </div>

          <div className="mb-12 grid gap-3 md:grid-cols-2">
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-rune-muted">01 · Set your API key</p>
              <CliBlock code="rune config set-key sk-••••••••••• --provider openai" />
            </div>
            <div>
              <p className="mb-3 text-[9px] font-black uppercase tracking-[0.28em] text-rune-muted">02 · Pick a topic to watch</p>
              <CliBlock code={'rune watch "AI agents"'} />
            </div>
          </div>

          <div className="border border-rune-border">
            <div className="border-b border-rune-border px-5 py-3">
              <p className="text-[9px] font-black uppercase tracking-[0.32em] text-rune-muted">Commands</p>
            </div>
            {[
              { cmd: "rune signal",                desc: "Latest signals for all watched topics" },
              { cmd: 'rune signal "AI agents"',   desc: "Signals for a specific topic" },
              { cmd: 'rune forecast "AI agents"', desc: "AI-generated probabilistic forecast" },
              { cmd: "rune anomaly",               desc: "Anomalies detected across all topics" },
              { cmd: "rune digest",                desc: "AI-powered daily intelligence summary" },
              { cmd: "rune topics",                desc: "List everything you are tracking" },
              { cmd: 'rune unwatch "AI agents"',  desc: "Stop tracking a topic" },
            ].map((item) => (
              <div key={item.cmd} className="flex items-center justify-between border-b border-rune-border px-5 py-3 last:border-b-0 hover:bg-white/[0.02] transition-colors">
                <code className="text-[12px] font-mono text-white tracking-tight">{item.cmd}</code>
                <span className="text-[11px] text-rune-muted tracking-[0.08em] hidden md:block">{item.desc}</span>
              </div>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap items-center gap-3">
            <span className="text-[9px] font-black uppercase tracking-[0.32em] text-rune-muted">Works with</span>
            {["OpenAI", "Anthropic", "Groq"].map((p) => (
              <span key={p} className="border border-rune-border px-3 py-1 text-[10px] font-black uppercase tracking-[0.18em] text-rune-muted">
                {p}
              </span>
            ))}
          </div>

        </div>
      </section>

      {/* MISSION */}
      <section className="border-t border-rune-border py-24">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="max-w-2xl">
            <p className="mb-4 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">· Our Mission</p>
            <h2 className="mb-6 font-black uppercase leading-[0.95] tracking-[-0.01em]" style={{ fontSize: "clamp(2.4rem, 5vw, 4rem)" }}>
              Give people<br />the edge of<br />understanding.
            </h2>
            <p className="mb-2 text-sm text-rune-muted tracking-[0.04em]">Information is everywhere.</p>
            <p className="mb-2 text-sm text-rune-muted tracking-[0.04em]">Understanding is rare.</p>
            <p className="mb-8 text-sm text-rune-muted tracking-[0.04em]">RUNE exists to help you see what others miss and act with confidence.</p>
            <Link href="/mint" className="inline-flex items-center gap-2 border border-white px-6 py-3 text-[11px] font-black tracking-[0.28em] uppercase transition hover:bg-white hover:text-black">
              Start Your Edge →
            </Link>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="border-t border-rune-border py-16">
        <div className="mx-auto max-w-7xl px-6 lg:px-10">
          <div className="grid gap-12 md:grid-cols-[1fr_auto_auto_auto_auto]">
            <div>
              <RuneLogo size={20} className="mb-3" />
              <p className="max-w-[200px] text-xs leading-6 text-rune-muted tracking-[0.04em]">
                The intelligence terminal for builders, investors, and operators who want to see the future before it happens.
              </p>
            </div>
            {[
              { label: "Product", links: ["Signals", "Radar", "Forecast", "Anomalies", "Watchlists"] },
              { label: "Resources", links: ["Documentation", "API", "Changelog", "Blog", "Status"] },
              { label: "Company", links: ["About", "Careers", "Privacy", "Terms"] },
            ].map((col) => (
              <div key={col.label}>
                <p className="mb-4 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">{col.label}</p>
                <ul className="space-y-3">
                  {col.links.map((link) => (
                    <li key={link}>
                      <a href="#" className="text-[11px] font-semibold tracking-[0.18em] uppercase text-rune-muted hover:text-white transition">{link}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div>
              <p className="mb-4 text-[9px] font-black uppercase tracking-[0.42em] text-rune-muted">Stay in the loop</p>
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="border border-rune-border bg-rune-panel px-3 py-2 text-[11px] tracking-[0.1em] text-white placeholder:text-rune-muted focus:outline-none focus:border-white w-44"
                />
                <button className="border border-l-0 border-rune-border bg-rune-panel px-3 py-2 text-white font-black hover:bg-white hover:text-black transition">
                  →
                </button>
              </div>
              <div className="mt-6 flex gap-4">
                {["𝕏", "◈", "⌥"].map((icon) => (
                  <button key={icon} className="text-rune-muted hover:text-white transition text-lg">{icon}</button>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-12 flex items-center justify-between border-t border-rune-border pt-6">
            <span className="text-[9px] font-bold tracking-[0.32em] uppercase text-rune-muted">© 2026 RUNE. All rights reserved.</span>
          </div>
        </div>
      </footer>
    </main>
  );
}
