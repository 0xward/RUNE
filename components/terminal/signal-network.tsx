"use client";

import ReactFlow, { Background, Controls, type Edge, type Node } from "reactflow";
import "reactflow/dist/style.css";

const nodes: Node[] = [
  { id: "agents", position: { x: 0, y: 90 }, data: { label: "AI Agents" } },
  { id: "browser", position: { x: 230, y: 20 }, data: { label: "Browser Automation" } },
  { id: "workflow", position: { x: 245, y: 165 }, data: { label: "Enterprise Workflow" } },
  { id: "compute", position: { x: 510, y: 90 }, data: { label: "Compute Demand" } },
  { id: "byok", position: { x: 500, y: 210 }, data: { label: "BYOK Routing" } },
];

const edges: Edge[] = [
  { id: "agents-browser", source: "agents", target: "browser" },
  { id: "agents-workflow", source: "agents", target: "workflow" },
  { id: "workflow-compute", source: "workflow", target: "compute" },
  { id: "workflow-byok", source: "workflow", target: "byok" },
];

export function SignalNetwork() {
  return (
    <div className="h-[360px] overflow-hidden border border-rune-border bg-black/20">
      <ReactFlow nodes={nodes} edges={edges} fitView proOptions={{ hideAttribution: true }}>
        <Background color="#1F1F1F" />
        <Controls />
      </ReactFlow>
    </div>
  );
}
