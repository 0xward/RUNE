"use client";

import { line, scaleLinear } from "d3";

export function TrendSparkline({ values, label }: { values: number[]; label: string }) {
  const width = 320;
  const height = 96;
  const x = scaleLinear().domain([0, values.length - 1]).range([0, width]);
  const y = scaleLinear().domain([Math.min(...values) - 5, Math.max(...values) + 5]).range([height, 0]);
  const path = line<number>().x((_, index: number) => x(index)).y((value: number) => y(value))(values) ?? "";

  return (
    <svg viewBox={`0 0 ${width} ${height}`} role="img" aria-label={label} className="h-24 w-full overflow-visible">
      <path d={path} fill="none" stroke="white" strokeWidth="1.5" />
      {values.map((value, index) => (
        <circle key={`${value}-${index}`} cx={x(index)} cy={y(value)} r={index === values.length - 1 ? 3 : 1.5} fill="white" opacity={index === values.length - 1 ? 1 : 0.45} />
      ))}
    </svg>
  );
}
