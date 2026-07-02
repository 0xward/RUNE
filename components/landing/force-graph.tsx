"use client";

import { useEffect, useRef } from "react";

// ── DATA ──────────────────────────────────────────────────────────────────────

const RAW_NODES = [
  { id: "ai",        label: "AI AGENTS",        hex: "#ffffff", r: 13, m: 3.5 },
  { id: "signals",   label: "SIGNAL FEED",      hex: "#fb923c", r: 10, m: 2.8 },
  { id: "realtime",  label: "REALTIME BUS",     hex: "#67e8f9", r: 9,  m: 2.4 },
  { id: "compute",   label: "COMPUTE",          hex: "#60a5fa", r: 9,  m: 2.2 },
  { id: "onchain",   label: "ON-CHAIN",         hex: "#4ade80", r: 8,  m: 2.0 },
  { id: "llm",       label: "LLM ROUTER",       hex: "#fda4af", r: 8,  m: 1.9 },
  { id: "forecast",  label: "FORECAST",         hex: "#34d399", r: 8,  m: 1.9 },
  { id: "anomaly",   label: "ANOMALY",          hex: "#f87171", r: 7,  m: 1.7 },
  { id: "edge",      label: "EDGE INFERENCE",   hex: "#e879f9", r: 7,  m: 1.7 },
  { id: "workflow",  label: "WORKFLOW",         hex: "#38bdf8", r: 7,  m: 1.6 },
  { id: "defi",      label: "DEFI SIGNALS",     hex: "#22d3ee", r: 7,  m: 1.6 },
  { id: "byok",      label: "BYOK",             hex: "#f59e0b", r: 6,  m: 1.5 },
  { id: "privacy",   label: "PRIVACY",          hex: "#a78bfa", r: 6,  m: 1.5 },
  { id: "sentiment", label: "SENTIMENT",        hex: "#c084fc", r: 6,  m: 1.4 },
  { id: "github",    label: "GITHUB",           hex: "#93c5fd", r: 6,  m: 1.4 },
  { id: "radar",     label: "RADAR",            hex: "#fbbf24", r: 5,  m: 1.2 },
  { id: "browser",   label: "BROWSER AUTO",     hex: "#94a3b8", r: 5,  m: 1.2 },
  { id: "watchlist", label: "WATCHLIST",        hex: "#86efac", r: 5,  m: 1.1 },
  { id: "nlp",       label: "NLP ENGINE",       hex: "#f0abfc", r: 5,  m: 1.1 },
  { id: "memstore",  label: "MEMSTORE",         hex: "#7dd3fc", r: 4,  m: 1.0 },
  { id: "scraper",   label: "SCRAPER",          hex: "#fcd34d", r: 4,  m: 1.0 },
  { id: "vector",    label: "VECTOR DB",        hex: "#6ee7b7", r: 4,  m: 1.0 },
];

const EDGE_LIST: [string, string, number][] = [
  ["ai","compute",0.09], ["ai","llm",0.08], ["ai","workflow",0.07],
  ["ai","signals",0.06], ["ai","forecast",0.06], ["ai","edge",0.05],
  ["signals","realtime",0.10], ["signals","anomaly",0.08], ["signals","radar",0.07],
  ["signals","sentiment",0.06], ["signals","scraper",0.05], ["signals","nlp",0.06],
  ["realtime","watchlist",0.07], ["realtime","defi",0.06], ["realtime","memstore",0.06],
  ["compute","edge",0.08], ["compute","vector",0.06], ["compute","llm",0.07],
  ["llm","privacy",0.07], ["llm","nlp",0.06], ["llm","memstore",0.05],
  ["onchain","defi",0.09], ["onchain","byok",0.07], ["onchain","signals",0.05],
  ["forecast","anomaly",0.08], ["forecast","sentiment",0.06], ["forecast","radar",0.05],
  ["edge","privacy",0.07], ["edge","browser",0.06],
  ["workflow","byok",0.07], ["workflow","realtime",0.06], ["workflow","browser",0.05],
  ["defi","realtime",0.06], ["byok","llm",0.06],
  ["github","signals",0.07], ["github","ai",0.06], ["github","scraper",0.07],
  ["vector","llm",0.06], ["vector","memstore",0.07],
  ["scraper","nlp",0.07], ["scraper","signals",0.05],
  ["sentiment","forecast",0.06], ["nlp","forecast",0.05],
  ["radar","watchlist",0.05], ["privacy","memstore",0.05],
  ["browser","workflow",0.04], ["watchlist","radar",0.04],
];

// ── HELPERS ───────────────────────────────────────────────────────────────────

function hexToRgb(hex: string): [number, number, number] {
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return [r, g, b];
}

// ── COMPONENT ─────────────────────────────────────────────────────────────────

export function ForceGraph() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let W = 0, H = 0;
    let ctx: CanvasRenderingContext2D;

    // Node state
    type NodeState = typeof RAW_NODES[0] & {
      x: number; y: number; vx: number; vy: number;
      phase: number; rgb: [number,number,number];
    };
    let nodes: NodeState[] = [];
    let nodeMap: Map<string, NodeState> = new Map();
    let tick = 0;

    const setup = (w: number, h: number) => {
      W = w; H = h;
      canvas.width  = Math.round(w * devicePixelRatio);
      canvas.height = Math.round(h * devicePixelRatio);
      ctx = canvas.getContext("2d")!;
      ctx.scale(devicePixelRatio, devicePixelRatio);

      // Scatter nodes in a loose ellipse so they settle nicely
      nodes = RAW_NODES.map((n, i) => {
        const angle = (i / RAW_NODES.length) * Math.PI * 2;
        const rx = W * 0.28, ry = H * 0.28;
        return {
          ...n,
          x: W/2 + rx * Math.cos(angle) + (Math.random()-0.5)*60,
          y: H/2 + ry * Math.sin(angle) + (Math.random()-0.5)*60,
          vx: (Math.random()-0.5)*0.8,
          vy: (Math.random()-0.5)*0.8,
          phase: Math.random() * Math.PI * 2,
          rgb: hexToRgb(n.hex),
        };
      });
      nodeMap = new Map(nodes.map(n => [n.id, n]));
    };

    const frame = () => {
      if (!ctx) { rafRef.current = requestAnimationFrame(frame); return; }
      tick++;
      const t = tick * 0.011;

      // ── PHYSICS ──
      const REPEL  = 6000;
      const DAMP   = 0.87;
      const PULL   = 0.0018;

      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i], b = nodes[j];
          const dx = b.x - a.x, dy = b.y - a.y;
          const d2 = dx*dx + dy*dy || 0.001;
          const d  = Math.sqrt(d2);
          const f  = REPEL / d2;
          const fx = (dx/d)*f, fy = (dy/d)*f;
          a.vx -= fx/a.m; a.vy -= fy/a.m;
          b.vx += fx/b.m; b.vy += fy/b.m;
        }
      }
      for (const [s, tg, str] of EDGE_LIST) {
        const a = nodeMap.get(s), b = nodeMap.get(tg);
        if (!a||!b) continue;
        const dx = b.x-a.x, dy = b.y-a.y;
        const d = Math.sqrt(dx*dx+dy*dy)||1;
        const f = (d - 140) * str;
        const fx = (dx/d)*f, fy = (dy/d)*f;
        a.vx += fx/a.m; a.vy += fy/a.m;
        b.vx -= fx/b.m; b.vy -= fy/b.m;
      }
      for (const n of nodes) {
        n.vx += (W/2 - n.x) * PULL;
        n.vy += (H/2 - n.y) * PULL;
        n.vx *= DAMP; n.vy *= DAMP;
        n.x  += n.vx;  n.y  += n.vy;
        const pad = n.r + 20;
        if (n.x < pad)     { n.x = pad;     n.vx *= -0.35; }
        if (n.x > W - pad) { n.x = W - pad; n.vx *= -0.35; }
        if (n.y < pad)     { n.y = pad;     n.vy *= -0.35; }
        if (n.y > H - pad) { n.y = H - pad; n.vy *= -0.35; }
      }

      // ── DRAW ──
      ctx.clearRect(0, 0, W, H);

      // faint background grid
      ctx.strokeStyle = "rgba(255,255,255,0.025)";
      ctx.lineWidth = 0.5;
      const GRID = 60;
      for (let x = 0; x < W; x += GRID) { ctx.beginPath(); ctx.moveTo(x,0); ctx.lineTo(x,H); ctx.stroke(); }
      for (let y = 0; y < H; y += GRID) { ctx.beginPath(); ctx.moveTo(0,y); ctx.lineTo(W,y); ctx.stroke(); }

      // ── EDGES ──
      EDGE_LIST.forEach(([s, tg], idx) => {
        const a = nodeMap.get(s), b = nodeMap.get(tg);
        if (!a||!b) return;

        const dx = b.x - a.x, dy = b.y - a.y;
        const dist = Math.sqrt(dx*dx + dy*dy) || 1;

        // edge alpha — bright, always visible
        const alpha = Math.max(0.18, Math.min(0.7, 160/dist));

        // gradient line from node A color to node B color
        const grad = ctx.createLinearGradient(a.x, a.y, b.x, b.y);
        grad.addColorStop(0, `rgba(${a.rgb},${alpha})`);
        grad.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.5})`);
        grad.addColorStop(1, `rgba(${b.rgb},${alpha})`);

        // glow pass — thick blurred line underneath
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 4;
        ctx.globalAlpha = alpha * 0.25;
        ctx.stroke();

        // sharp bright line on top
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.2;
        ctx.globalAlpha = 1;
        ctx.stroke();

        // travelling particle
        const phase = ((t * 0.45 + idx * 0.21) % 1);
        const px = a.x + dx * phase;
        const py = a.y + dy * phase;
        // particle glow
        const pg = ctx.createRadialGradient(px, py, 0, px, py, 7);
        pg.addColorStop(0, `rgba(255,255,255,1)`);
        pg.addColorStop(0.4, `rgba(255,255,255,0.4)`);
        pg.addColorStop(1, `rgba(255,255,255,0)`);
        ctx.beginPath();
        ctx.arc(px, py, 7, 0, Math.PI*2);
        ctx.fillStyle = pg;
        ctx.fill();
        // particle dot
        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,1)";
        ctx.fill();
      });

      // ── NODES ──
      ctx.globalAlpha = 1;
      for (const n of nodes) {
        const pulse = 1 + 0.08 * Math.sin(t * 2.2 + n.phase);
        const r = n.r * pulse;
        const [R,G,B] = n.rgb;

        // outer glow halo — big, soft
        const halo = ctx.createRadialGradient(n.x, n.y, r * 0.5, n.x, n.y, r * 5.5);
        halo.addColorStop(0,   `rgba(${R},${G},${B},0.35)`);
        halo.addColorStop(0.3, `rgba(${R},${G},${B},0.12)`);
        halo.addColorStop(1,   `rgba(${R},${G},${B},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 5.5, 0, Math.PI*2);
        ctx.fillStyle = halo;
        ctx.fill();

        // mid ring
        const ring = ctx.createRadialGradient(n.x, n.y, r*0.6, n.x, n.y, r*2);
        ring.addColorStop(0, `rgba(${R},${G},${B},0.6)`);
        ring.addColorStop(1, `rgba(${R},${G},${B},0)`);
        ctx.beginPath();
        ctx.arc(n.x, n.y, r*2, 0, Math.PI*2);
        ctx.fillStyle = ring;
        ctx.fill();

        // core
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI*2);
        ctx.fillStyle = n.hex;
        ctx.fill();

        // specular highlight
        ctx.beginPath();
        ctx.arc(n.x - r*0.3, n.y - r*0.35, r*0.38, 0, Math.PI*2);
        ctx.fillStyle = "rgba(255,255,255,0.65)";
        ctx.fill();

        // label
        ctx.font = `600 8px monospace`;
        ctx.textAlign = "left";
        ctx.fillStyle = `rgba(${R},${G},${B},0.85)`;
        ctx.fillText(n.label, n.x + r + 5, n.y + 3);
      }

      rafRef.current = requestAnimationFrame(frame);
    };

    const ro = new ResizeObserver(entries => {
      for (const e of entries) {
        const { width, height } = e.contentRect;
        if (width > 10 && height > 10) {
          cancelAnimationFrame(rafRef.current);
          setup(width, height);
          rafRef.current = requestAnimationFrame(frame);
        }
      }
    });
    ro.observe(canvas);

    return () => {
      ro.disconnect();
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <div className="relative w-full bg-black overflow-hidden"
         style={{ height: "clamp(400px, 58vw, 640px)" }}>
      {/* corner brackets */}
      <div className="pointer-events-none absolute left-4 top-4 h-5 w-5 border-l border-t border-white/20 z-10" />
      <div className="pointer-events-none absolute right-4 top-4 h-5 w-5 border-r border-t border-white/20 z-10" />
      <div className="pointer-events-none absolute left-4 bottom-4 h-5 w-5 border-l border-b border-white/20 z-10" />
      <div className="pointer-events-none absolute right-4 bottom-4 h-5 w-5 border-r border-b border-white/20 z-10" />
      {/* LIVE badge */}
      <div className="absolute top-5 right-12 z-10 flex items-center gap-2">
        <span className="relative flex h-2 w-2">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-white opacity-60" />
          <span className="relative inline-flex rounded-full h-2 w-2 bg-white" />
        </span>
        <span className="text-[9px] font-black uppercase tracking-[0.42em] text-white/40">Live</span>
      </div>
      <canvas
        ref={canvasRef}
        style={{ display: "block", width: "100%", height: "100%" }}
      />
    </div>
  );
}
