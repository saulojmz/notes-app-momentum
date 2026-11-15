import { useMemo } from "react";
import { WORLD_GRID, WORLD_ROWS } from "@/features/planner/worldGrid";
import { cn } from "@/lib/utils";

export interface MapPoint {
  id: string;
  lat: number;
  lng: number;
  /** 0–100, drives marker size */
  weight: number;
  label?: string;
  rank?: number;
}

const decode = () => {
  const cells: [number, number][] = [];
  WORLD_ROWS.split("|").forEach((row, r) => {
    let c = 0;
    for (const run of row.match(/[+-][0-9a-z]+/g) ?? []) {
      const n = parseInt(run.slice(1), 36);
      if (run[0] === "+") for (let i = 0; i < n; i++) cells.push([c + i, r]);
      c += n;
    }
  });
  return cells;
};

const W = WORLD_GRID.cols;
const H = WORLD_GRID.rows;
const project = (lat: number, lng: number) => ({
  x: ((lng + 180) / WORLD_GRID.step) - 0.5,
  y: (WORLD_GRID.latMax - lat) / WORLD_GRID.step,
});

interface WorldDotMapProps {
  points: MapPoint[];
  selected?: string | null;
  onSelect?: (id: string) => void;
  className?: string;
}

/** Minimal dot-matrix world map with weighted markers. */
export const WorldDotMap = ({ points, selected, onSelect, className }: WorldDotMapProps) => {
  const cells = useMemo(decode, []);
  return (
    <svg viewBox={`-1 -1 ${W + 2} ${H + 2}`} className={cn("block h-auto w-full", className)} role="img" aria-label="World map of matching destinations">
      <g className="fill-foreground/15">
        {cells.map(([x, y]) => (
          <circle key={`${x}-${y}`} cx={x} cy={y} r={0.34} />
        ))}
      </g>
      {[...points]
        .sort((a, b) => (a.id === selected ? 1 : b.id === selected ? -1 : a.weight - b.weight))
        .map((p) => {
          const { x, y } = project(p.lat, p.lng);
          const r = 0.9 + (Math.max(0, p.weight - 50) / 50) * 1.9;
          const isSel = p.id === selected;
          return (
            <g
              key={p.id}
              transform={`translate(${x} ${y})`}
              className="cursor-pointer"
              onClick={() => onSelect?.(p.id)}
              role="button"
              aria-label={`${p.label ?? p.id}, ${p.weight}% match`}
            >
              <circle r={r * 2.4} className={isSel ? "fill-primary/25" : "fill-primary/10"} />
              <circle r={r} className={cn("stroke-card", isSel ? "fill-ink" : "fill-primary")} strokeWidth={0.35} />
              {p.rank && (
                <text y={0.42} textAnchor="middle" className="fill-primary-foreground tabular-nums " style={{ fontSize: 1.25, fontWeight: 600 }}>
                  {p.rank}
                </text>
              )}
            </g>
          );
        })}
    </svg>
  );
};
