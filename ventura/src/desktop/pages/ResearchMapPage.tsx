import { useEffect, useMemo, useRef, useState } from "react";
import { CalendarDays, Coffee, Info, MapPin, Plus, Route, Shield, UtensilsCrossed, X, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Segmented } from "@/components/kit";
import { HeatMapCanvas } from "@/components/map/HeatMapCanvas";
import { MapMarkerIcon } from "@/components/map/MapMarkerIcon";
import { cafesMarkers, eventsMarkers, foodMarkers } from "@/data/mockMapData";
import { updateTrip } from "@/features/planner/trips";
import { newId, useTripSchedule } from "@/features/trips";
import type { FilterType, MapMarker, TimeOfDay } from "@/types/map";
import type { ItineraryStop } from "@/types/itinerary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import edinburghMap from "@/assets/edinburgh-map.jpg";

/** The static map's frame: about 2.6 × 3.5 km of central Edinburgh, centred on the Old Town. */
const IMG_RATIO = 812 / 1082;
const CENTER = { lat: 55.9497, lng: -3.1883 };
const toPct = (c: { lat: number; lng: number }) => ({
  x: 50 + (((c.lng - CENTER.lng) * 62250) / 2600) * 100,
  y: 50 - (((c.lat - CENTER.lat) * 111320) / 3460) * 100,
});
const toLatLng = (m: MapMarker) => ({
  lat: CENTER.lat - ((parseFloat(m.position.y) / 100 - 0.5) * 3460) / 111320,
  lng: CENTER.lng + ((parseFloat(m.position.x) / 100 - 0.5) * 2600) / 62250,
});

type Layer = Exclude<FilterType, "safety"> | "safety" | "trip";
const LAYERS: { id: Layer; label: string; icon: LucideIcon; hint?: string }[] = [
  { id: "trip", label: "Your trip", icon: Route },
  { id: "safety", label: "Safety", icon: Shield, hint: "Research, not live" },
  { id: "events", label: "Events this week", icon: CalendarDays },
  { id: "food", label: "Food", icon: UtensilsCrossed },
  { id: "cafes", label: "Cafés", icon: Coffee },
];

const ResearchMapPage = () => {
  const { saved, today } = useTripSchedule();
  const edinburgh = saved.filter((t) => t.destinationName === "Edinburgh");
  const [tripId, setTripId] = useState(edinburgh[0]?.id ?? "");
  const trip = edinburgh.find((t) => t.id === tripId);
  const [layers, setLayers] = useState<Set<Layer>>(new Set(["trip", "food"]));
  const [time, setTime] = useState<TimeOfDay>("night");
  const [selected, setSelected] = useState<MapMarker | null>(null);
  const [day, setDay] = useState(String(today && today.trip.destinationName === "Edinburgh" ? today.dayIndex : 0));
  const boxRef = useRef<HTMLDivElement>(null);
  const [inner, setInner] = useState({ w: 0, h: 0 });

  // Size the map like object-cover so marker percentages stay true to the image.
  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const fit = () => {
      const { width, height } = el.getBoundingClientRect();
      const w = Math.max(width, height * IMG_RATIO);
      setInner({ w, h: w / IMG_RATIO });
    };
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const toggle = (l: Layer) =>
    setLayers((prev) => {
      const next = new Set(prev);
      if (next.has(l)) next.delete(l);
      else next.add(l);
      return next;
    });

  const markers = useMemo(
    () => [
      ...(layers.has("events") ? eventsMarkers : []),
      ...(layers.has("food") ? foodMarkers : []),
      ...(layers.has("cafes") ? cafesMarkers : []),
    ],
    [layers],
  );

  const tripStops = trip && layers.has("trip")
    ? trip.days.flatMap((d, di) => d.stops.map((s, si) => ({ s, di, si, p: toPct(s.coordinates) }))).filter(({ p }) => p.x > 2 && p.x < 98 && p.y > 2 && p.y < 98)
    : [];

  const addToTrip = (m: MapMarker) => {
    if (!trip) return;
    const di = Number(day);
    const d = trip.days[di];
    const last = d.stops[d.stops.length - 1];
    const stop: ItineraryStop = {
      id: newId("stop"),
      name: m.name,
      time: last ? `${String(Math.min(22, parseInt(last.time, 10) + 2)).padStart(2, "0")}:00` : "10:00",
      duration: "1–2 hours",
      description: m.description,
      category: m.type === "events" ? "Culture" : "Food",
      coordinates: toLatLng(m),
      mapQuery: `${m.name}, ${m.address}, Edinburgh`,
      cost: m.price && /\d/.test(m.price) ? Number(m.price.replace(/[^\d.]/g, "")) : undefined,
    };
    updateTrip({ ...trip, days: trip.days.map((x, i) => (i === di ? { ...x, stops: [...x.stops, stop] } : x)) });
    toast.success(`Added to day ${di + 1}`, { description: trip.title });
  };

  return (
    <div className="grid h-full grid-cols-[300px_minmax(0,1fr)]">
      <aside className="flex min-h-0 flex-col border-r border-border">
        <div className="space-y-1 px-6 pb-5 pt-8">
          <p className="eyebrow">Map</p>
          <h1 className="text-display text-[36px] leading-tight">Edinburgh</h1>
          <p className="flex items-start gap-1.5 pt-1 text-[13px] text-muted-foreground">
            <Info className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
            Planning view. Your location and walking times are on the phone.
          </p>
        </div>

        <div className="space-y-1 px-3">
          {LAYERS.map(({ id, label, icon: Icon, hint }) => {
            const on = layers.has(id);
            return (
              <div key={id}>
                <button
                  type="button"
                  role="switch"
                  aria-checked={on}
                  onClick={() => toggle(id)}
                  className={cn(
                    "flex h-9 w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 text-left text-sm transition-colors",
                    on ? "bg-card font-medium shadow-xs ring-1 ring-border" : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                  )}
                >
                  <Icon className="h-[18px] w-[18px] shrink-0" strokeWidth={1.5} />
                  <span className="flex-1">{label}</span>
                  {hint && on && <span className="text-xs font-normal text-muted-foreground">{hint}</span>}
                  <span className={cn("h-4 w-7 rounded-full p-0.5 transition-colors", on ? "bg-primary" : "bg-input")}>
                    <span className={cn("block h-3 w-3 rounded-full bg-card transition-transform", on && "translate-x-3")} />
                  </span>
                </button>
                {id === "safety" && on && (
                  <Segmented<TimeOfDay>
                    label="Time of day"
                    value={time}
                    onChange={setTime}
                    className="mx-3 mb-2 mt-1.5"
                    options={[
                      { value: "day", label: "Day" },
                      { value: "night", label: "Night" },
                    ]}
                  />
                )}
                {id === "trip" && on && edinburgh.length > 1 && (
                  <Select value={tripId} onValueChange={setTripId}>
                    <SelectTrigger className="mx-3 mb-2 mt-1.5 h-8 w-[calc(100%-1.5rem)] text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {edinburgh.map((t) => (
                        <SelectItem key={t.id} value={t.id}>
                          {t.title}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              </div>
            );
          })}
        </div>

        <div className="mt-5 min-h-0 flex-1 overflow-y-auto border-t border-border">
          <p className="eyebrow px-6 pb-2 pt-4 tabular-nums">{markers.length} places shown</p>
          <ul className="px-3 pb-4">
            {markers.map((m) => (
              <li key={m.id}>
                <button
                  type="button"
                  onClick={() => setSelected(m)}
                  className={cn("flex w-full items-center gap-2.5 rounded-[var(--radius-control)] px-3 py-2 text-left transition-colors hover:bg-secondary", selected?.id === m.id && "bg-secondary")}
                >
                  <MapPin className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm">{m.name}</span>
                    <span className="block truncate text-xs text-muted-foreground">{m.category ?? m.address}</span>
                  </span>
                </button>
              </li>
            ))}
          </ul>
        </div>
      </aside>

      <div ref={boxRef} className="relative min-h-0 overflow-hidden bg-secondary">
        <div className="absolute left-1/2 top-1/2" style={{ width: inner.w, height: inner.h, transform: "translate(-50%, -50%)" }}>
          <img src={edinburghMap} alt="Map of central Edinburgh" className="absolute inset-0 h-full w-full [filter:saturate(0.55)_sepia(0.06)]" />
          {layers.has("safety") && <HeatMapCanvas timeOfDay={time} />}

          {tripStops.length > 1 && (
            <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden>
              {trip!.days.map((_, di) => {
                const pts = tripStops.filter((t) => t.di === di);
                return pts.length > 1 ? (
                  <polyline
                    key={di}
                    points={pts.map(({ p }) => `${p.x},${p.y}`).join(" ")}
                    fill="none"
                    stroke={di === Number(day) ? "hsl(var(--primary))" : "hsl(var(--foreground) / 0.45)"}
                    strokeWidth={di === Number(day) ? 3 : 2}
                    strokeDasharray="6 7"
                    vectorEffect="non-scaling-stroke"
                  />
                ) : null;
              })}
            </svg>
          )}
          {tripStops.map(({ s, di, si, p }) => (
            <span
              key={s.id}
              title={`Day ${di + 1}: ${s.name}`}
              className={cn(
                "absolute z-10 flex h-6 w-6 -translate-x-1/2 -translate-y-1/2 items-center justify-center rounded-full border-2 border-card text-[11px] font-medium tabular-nums shadow-float",
                di === Number(day) ? "bg-primary text-primary-foreground" : "bg-ink text-ink-foreground",
              )}
              style={{ left: `${p.x}%`, top: `${p.y}%` }}
            >
              {di === Number(day) ? si + 1 : di + 1}
            </span>
          ))}

          {markers.map((m) => (
            <button
              key={m.id}
              type="button"
              aria-label={m.name}
              className="absolute z-20 -translate-x-1/2 -translate-y-full"
              style={{ left: m.position.x, top: m.position.y }}
              onClick={() => setSelected(m)}
            >
              <MapMarkerIcon type={m.type} category={m.category} selected={selected?.id === m.id} />
            </button>
          ))}
        </div>

        {trip && layers.has("trip") && (
          <div className="glass absolute left-6 top-6 z-30 flex items-center gap-3 rounded-xl px-3 py-2">
            <span className="text-sm font-medium">{trip.title}</span>
            <Select value={day} onValueChange={setDay}>
              <SelectTrigger className="h-8 w-[104px] text-xs" aria-label="Highlighted day">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {trip.days.map((_, i) => (
                  <SelectItem key={i} value={String(i)}>
                    Day {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        )}

        {layers.has("safety") && (
          <div className="glass absolute bottom-6 left-6 z-30 flex items-center gap-4 rounded-xl px-4 py-2.5 text-xs text-muted-foreground">
            {[
              { l: "Safe", c: "bg-success" },
              { l: "Caution", c: "bg-warning" },
              { l: "Avoid", c: "bg-destructive" },
            ].map(({ l, c }) => (
              <span key={l} className="flex items-center gap-1.5">
                <span className={cn("h-2.5 w-2.5 rounded-full", c)} />
                {l}
              </span>
            ))}
            <span>· {time === "night" ? "After dark" : "Daytime"}, from local reports</span>
          </div>
        )}

        {selected && (
          <section className="absolute right-6 top-6 z-30 w-[340px] overflow-hidden rounded-2xl border border-border bg-card shadow-float animate-fade-in" aria-label={selected.name}>
            <div className="flex items-start justify-between gap-3 p-5 pb-0">
              <div className="min-w-0">
                {selected.category && <p className="eyebrow">{selected.category}</p>}
                <h2 className="text-title mt-1 text-xl leading-snug">{selected.name}</h2>
                <p className="meta mt-1">{selected.address}</p>
              </div>
              <Button variant="ghost" size="icon-sm" aria-label="Close" onClick={() => setSelected(null)}>
                <X />
              </Button>
            </div>
            <p className="px-5 pt-3 text-sm leading-relaxed text-foreground/80">{selected.description}</p>
            <dl className="mt-4 grid grid-cols-2 gap-px border-y border-border bg-border">
              {[
                selected.date && { k: "When", v: selected.date },
                selected.time && { k: selected.type === "events" ? "Time" : "Hours", v: selected.time },
                selected.price && { k: "Price", v: selected.price },
                selected.rating && { k: "Rating", v: `${selected.rating.toFixed(1)} of 5` },
              ]
                .filter(Boolean)
                .map((x) => {
                  const { k, v } = x as { k: string; v: string };
                  return (
                    <div key={k} className="bg-card px-5 py-3">
                      <dt className="meta">{k}</dt>
                      <dd className="mt-0.5 text-sm tabular-nums">{v}</dd>
                    </div>
                  );
                })}
            </dl>
            {trip ? (
              <div className="flex items-center gap-2 p-4">
                <Select value={day} onValueChange={setDay}>
                  <SelectTrigger className="h-10 w-[110px]" aria-label="Day">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {trip.days.map((_, i) => (
                      <SelectItem key={i} value={String(i)}>
                        Day {i + 1}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button className="flex-1" onClick={() => addToTrip(selected)}>
                  <Plus />
                  Add to trip
                </Button>
              </div>
            ) : (
              <p className="p-4 text-[13px] text-muted-foreground">Create an Edinburgh trip to add places to it</p>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default ResearchMapPage;
