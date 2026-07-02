"use client";

import { useEffect, useRef } from "react";

interface NetworkNode {
  id: string;
  label: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  color: string;
  radius: number;
  pulsePhase: number;
}

interface NetworkEdge {
  source: string;
  target: string;
  color: string;
  particleOffset: number;
  particleSpeed: number;
}

export interface TopicInput {
  id: string;
  label: string;
  momentum: number;
}

const PALETTE = ["#ffffff", "#a78bfa", "#60a5fa", "#34d399", "#fb923c", "#f472b6", "#facc15"];

function buildGraph(topics: TopicInput[]) {
  const nodeDefs = topics.slice(0, 9).map((topic, i) => {
    const angle = (i / Math.max(topics.length, 1)) * Math.PI * 2;
    const radiusFactor = 0.32 + (i % 2) * 0.08;
    return {
      id: topic.id,
      label: topic.label,
      x: 0.5 + Math.cos(angle) * radiusFactor,
      y: 0.5 + Math.sin(angle) * radiusFactor,
      color: PALETTE[i % PALETTE.length],
      radius: 4 + Math.min(6, (topic.momentum / 100) * 6),
    };
  });

  const edgeDefs: Array<{ source: string; target: string; color: string }> = [];
  for (let i = 0; i < nodeDefs.length; i++) {
    const next = nodeDefs[(i + 1) % nodeDefs.length];
    edgeDefs.push({ source: nodeDefs[i].id, target: next.id, color: nodeDefs[i].color });
    if (i % 2 === 0 && nodeDefs.length > 3) {
      const cross = nodeDefs[(i + 3) % nodeDefs.length];
      edgeDefs.push({ source: nodeDefs[i].id, target: cross.id, color: nodeDefs[i].color });
    }
  }

  return { nodeDefs, edgeDefs };
}

export function SignalNetwork({ topics }: { topics: TopicInput[] }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const frameRef = useRef<number>(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || topics.length === 0) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let W = canvas.offsetWidth;
    let H = canvas.offsetHeight;

    const resize = () => {
      W = canvas.offsetWidth;
      H = canvas.offsetHeight;
      canvas.width = W * devicePixelRatio;
      canvas.height = H * devicePixelRatio;
      ctx.scale(devicePixelRatio, devicePixelRatio);
    };
    resize();
    const ro = new ResizeObserver(resize);
    ro.observe(canvas);

    const { nodeDefs, edgeDefs } = buildGraph(topics);

    const nodes: NetworkNode[] = nodeDefs.map((n) => ({
      ...n,
      x: n.x * W,
      y: n.y * H,
      vx: (Math.random() - 0.5) * 0.3,
      vy: (Math.random() - 0.5) * 0.3,
      pulsePhase: Math.random() * Math.PI * 2,
    }));

    const edges: NetworkEdge[] = edgeDefs.map((e) => ({
      ...e,
      particleOffset: Math.random(),
      particleSpeed: 0.003 + Math.random() * 0.004,
    }));

    const getNode = (id: string) => nodes.find((n) => n.id === id);

    const draw = (timestamp: number) => {
      const t = timestamp / 1000;
      ctx.clearRect(0, 0, W, H);

      ctx.strokeStyle = "rgba(31,31,31,0.5)";
      ctx.lineWidth = 0.5;
      for (let x = 0; x < W; x += 40) { ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, H); ctx.stroke(); }
      for (let y = 0; y < H; y += 40) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(W, y); ctx.stroke(); }

      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;
        const pad = 60;
        if (node.x < pad || node.x > W - pad) node.vx *= -1;
        if (node.y < pad || node.y > H - pad) node.vy *= -1;
        node.x = Math.max(pad, Math.min(W - pad, node.x));
        node.y = Math.max(pad, Math.min(H - pad, node.y));
      });

      edges.forEach((edge) => {
        const src = getNode(edge.source);
        const tgt = getNode(edge.target);
        if (!src || !tgt) return;

        const dx = tgt.x - src.x;
        const dy = tgt.y - src.y;

        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = "rgba(255,255,255,0.06)";
        ctx.lineWidth = 1;
        ctx.stroke();

        const pulse = (Math.sin(t * 1.5 + edge.particleOffset * 6) + 1) / 2;
        const grad = ctx.createLinearGradient(src.x, src.y, tgt.x, tgt.y);
        grad.addColorStop(0, "rgba(0,0,0,0)");
        grad.addColorStop(0.4, edge.color + "00");
        grad.addColorStop(0.5, edge.color + Math.round(pulse * 180 + 30).toString(16).padStart(2, "0"));
        grad.addColorStop(0.6, edge.color + "00");
        grad.addColorStop(1, "rgba(0,0,0,0)");
        ctx.beginPath();
        ctx.moveTo(src.x, src.y);
        ctx.lineTo(tgt.x, tgt.y);
        ctx.strokeStyle = grad;
        ctx.lineWidth = 1.5;
        ctx.stroke();

        edge.particleOffset = (edge.particleOffset + edge.particleSpeed) % 1;
        const px = src.x + dx * edge.particleOffset;
        const py = src.y + dy * edge.particleOffset;
        const particleGrad = ctx.createRadialGradient(px, py, 0, px, py, 6);
        particleGrad.addColorStop(0, edge.color + "ff");
        particleGrad.addColorStop(0.4, edge.color + "88");
        particleGrad.addColorStop(1, edge.color + "00");
        ctx.beginPath();
        ctx.arc(px, py, 6, 0, Math.PI * 2);
        ctx.fillStyle = particleGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(px, py, 2, 0, Math.PI * 2);
        ctx.fillStyle = "#ffffff";
        ctx.fill();
      });

      nodes.forEach((node) => {
        const pulse = (Math.sin(t * 2 + node.pulsePhase) + 1) / 2;
        const outerR = node.radius + 3 + pulse * 4;

        const glowGrad = ctx.createRadialGradient(node.x, node.y, node.radius, node.x, node.y, outerR + 8);
        glowGrad.addColorStop(0, node.color + "44");
        glowGrad.addColorStop(1, node.color + "00");
        ctx.beginPath();
        ctx.arc(node.x, node.y, outerR + 8, 0, Math.PI * 2);
        ctx.fillStyle = glowGrad;
        ctx.fill();

        ctx.beginPath();
        ctx.arc(node.x, node.y, outerR, 0, Math.PI * 2);
        ctx.strokeStyle = node.color + Math.round(pulse * 120 + 20).toString(16).padStart(2, "0");
        ctx.lineWidth = 1;
        ctx.stroke();

        ctx.beginPath();
        ctx.arc(node.x, node.y, node.radius, 0, Math.PI * 2);
        const coreGrad = ctx.createRadialGradient(node.x - 1, node.y - 1, 0, node.x, node.y, node.radius);
        coreGrad.addColorStop(0, "#ffffff");
        coreGrad.addColorStop(1, node.color);
        ctx.fillStyle = coreGrad;
        ctx.fill();

        ctx.font = `500 11px "Geist", "Inter", sans-serif`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";

        const labelW = ctx.measureText(node.label).width + 16;
        const labelH = 18;
        const lx = node.x - labelW / 2;
        const ly = node.y + node.radius + 10;
        ctx.fillStyle = "rgba(10,10,10,0.85)";
        ctx.fillRect(lx, ly, labelW, labelH);
        ctx.strokeStyle = node.color + "33";
        ctx.lineWidth = 0.5;
        ctx.strokeRect(lx, ly, labelW, labelH);

        ctx.fillStyle = node.color;
        ctx.fillText(node.label, node.x, ly + labelH / 2);
      });

      frameRef.current = requestAnimationFrame(draw);
    };

    frameRef.current = requestAnimationFrame(draw);

    return () => {
      cancelAnimationFrame(frameRef.current);
      ro.disconnect();
    };
  }, [topics]);

  if (topics.length === 0) {
    return (
      <div className="relative mt-3 flex h-[360px] items-center justify-center overflow-hidden border border-rune-border bg-black">
        <p className="text-sm text-rune-muted">No topics yet — add one to your watchlist to populate the network.</p>
      </div>
    );
  }

  return (
    <div className="relative mt-3 h-[360px] overflow-hidden border border-rune-border bg-black">
      <canvas ref={canvasRef} className="h-full w-full" />
      <div className="pointer-events-none absolute left-2 top-2 h-3 w-3 border-l border-t border-rune-border" />
      <div className="pointer-events-none absolute right-2 top-2 h-3 w-3 border-r border-t border-rune-border" />
      <div className="pointer-events-none absolute bottom-2 left-2 h-3 w-3 border-b border-l border-rune-border" />
      <div className="pointer-events-none absolute bottom-2 right-2 h-3 w-3 border-b border-r border-rune-border" />
      <div className="pointer-events-none absolute right-4 top-3 flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-ping rounded-full bg-white" />
        <span className="text-[9px] uppercase tracking-[0.28em] text-rune-muted">live</span>
      </div>
    </div>
  );
}
