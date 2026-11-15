import { useEffect, useMemo, useRef, useState } from "react";
import type { ItineraryDay } from "@/types/itinerary";
import { cn } from "@/lib/utils";

interface TripMapProps {
  days: ItineraryDay[];
  /** Highlighted day, or null for all days at once. */
  selectedDay: number | null;
  onSelectDay?: (day: number | null) => void;
  selectedStop?: string | null;
  onSelectStop?: (stopId: string) => void;
  className?: string;
  /** Show stop names next to the highlighted day's stops. */
  labels?: boolean;
}

const PAD = 56;

/**
 * Planning-mode map: every stop plotted from its coordinates and joined in
 * order by the dashed route line. The highlighted day carries the accent;
 * other days stay neutral so the one you're working on reads first.
 */
export const TripMap = ({ days, selectedDay, onSelectDay, selectedStop, onSelectStop, className, labels = true }: TripMapProps) => {
  // Draw in real pixels so dots and labels keep their size in any panel.
  const boxRef = useRef<HTMLDivElement>(null);
  const [{ VW, VH }, setSize] = useState({ VW: 800, VH: 500 });
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => {
      const r = el.getBoundingClientRect();
      if (r.width && r.height) setSize({ VW: Math.round(r.width), VH: Math.round(r.height) });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const points = useMemo(() => {
    const all = days.flatMap((d, di) =>
      d.stops
        .filter((s) => s.coordinates && (s.coordinates.lat || s.coordinates.lng))
        .map((s, si) => ({ stop: s, day: di, index: si })),
    );
    if (!all.length) return [];
    const lat0 = all.reduce((sum, p) => sum + p.stop.coordinates.lat, 0) / all.length;
    const k = Math.cos((lat0 * Math.PI) / 180);
    const xs = all.map((p) => p.stop.coordinates.lng * k);
    const ys = all.map((p) => -p.stop.coordinates.lat);
    const [minX, maxX, minY, maxY] = [Math.min(...xs), Math.max(...xs), Math.min(...ys), Math.max(...ys)];
    const span = Math.max(maxX - minX, ((maxY - minY) * (VW - PAD * 2)) / (VH - PAD * 2), 1e-4);
    const scale = (VW - PAD * 2) / span;
    const offX = (VW - (maxX - minX) * scale) / 2;
    const offY = (VH - (maxY - minY) * scale) / 2;
    return all.map((p, i) => ({ ...p, x: offX + (xs[i] - minX) * scale, y: offY + (ys[i] - minY) * scale }));
  }, [days, VW, VH]);

  const byDay = days.map((_, di) => points.filter((p) => p.day === di));
  const order = [...byDay.keys()].sort((a, b) => (a === selectedDay ? 1 : b === selectedDay ? -1 : 0));

  return (
    <div ref={boxRef} className={cn("relative overflow-hidden rounded-2xl border border-border bg-card", className)}>
      <svg viewBox={`0 0 ${VW} ${VH}`} className="block h-full w-full" role="img" aria-label="Trip stops on a map">
        <defs>
          <pattern id="trip-grid" width="40" height="40" patternUnits="userSpaceOnUse">
            <path d="M40 0H0V40" fill="none" stroke="hsl(var(--border))" strokeWidth="1" />
          </pattern>
        </defs>
        <rect width={VW} height={VH} fill="url(#trip-grid)" />

        {order.map((di) => {
          const pts = byDay[di];
          const on = selectedDay === null || selectedDay === di;
          const accent = selectedDay === di;
          return (
            <g key={di} opacity={on ? 1 : 0.45}>
              {pts.length > 1 && (
                <polyline
                  points={pts.map((p) => `${p.x},${p.y}`).join(" ")}
                  fill="none"
                  stroke={accent ? "hsl(var(--primary))" : "hsl(var(--muted-foreground))"}
                  strokeWidth={accent ? 2.5 : 1.5}
                  strokeDasharray="5 6"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              )}
              {pts.map((p) => {
                const sel = selectedStop === p.stop.id;
                return (
                  <g
                    key={p.stop.id}
                    transform={`translate(${p.x} ${p.y})`}
                    className={onSelectStop ? "cursor-pointer" : undefined}
                    onClick={() => {
                      onSelectStop?.(p.stop.id);
                      onSelectDay?.(di);
                    }}
                  >
                    <circle
                      r={sel ? 14 : 12}
                      fill={accent ? "hsl(var(--primary))" : "hsl(var(--card))"}
                      stroke={accent ? "hsl(var(--card))" : "hsl(var(--foreground) / 0.35)"}
                      strokeWidth={accent ? 3 : 1.5}
                    />
                    <text
                      textAnchor="middle"
                      dy="0.35em"
                      fontSize="12"
                      fontWeight={500}
                      fill={accent ? "hsl(var(--primary-foreground))" : "hsl(var(--foreground))"}
                      style={{ fontVariantNumeric: "tabular-nums" }}
                    >
                      {selectedDay === null ? di + 1 : p.index + 1}
                    </text>
                    {labels && accent && (
                      <text x="20" dy="0.35em" fontSize="13" fill="hsl(var(--foreground))" stroke="hsl(var(--card))" strokeWidth="5" paintOrder="stroke">
                        {p.stop.name.length > 34 ? `${p.stop.name.slice(0, 32)}…` : p.stop.name}
                      </text>
                    )}
                  </g>
                );
              })}
            </g>
          );
        })}
      </svg>

      {onSelectDay && days.length > 1 && (
        <div className="absolute left-3 top-3 flex gap-1 rounded-[var(--radius-control)] border border-border bg-card p-1 shadow-xs">
          <button
            type="button"
            onClick={() => onSelectDay(null)}
            className={cn("h-7 rounded-[6px] px-2.5 text-xs font-medium", selectedDay === null ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
          >
            All days
          </button>
          {days.map((d, di) => (
            <button
              key={d.dayNumber}
              type="button"
              onClick={() => onSelectDay(di)}
              className={cn("h-7 rounded-[6px] px-2.5 text-xs font-medium tabular-nums", selectedDay === di ? "bg-secondary text-foreground" : "text-muted-foreground hover:text-foreground")}
            >
              Day {di + 1}
            </button>
          ))}
        </div>
      )}
      {!points.length && (
        <p className="absolute inset-0 flex items-center justify-center text-sm text-muted-foreground">Add stops with places to see them on the map</p>
      )}
    </div>
  );
};
