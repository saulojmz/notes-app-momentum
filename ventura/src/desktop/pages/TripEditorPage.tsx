import { useEffect, useMemo, useState, type DragEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { format, parseISO } from "date-fns";
import {
  BedDouble, Bus, CalendarDays, Car, Check, ChevronRight, GripVertical, MapPin, Minus, Plane, Plus, Ship, Smartphone, StickyNote, TrainFront, Trash2, Users, X,
  type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { EmptyState, Segmented, SmartImage } from "@/components/kit";
import { guessKind } from "@/features/planner/builder";
import { findTrip, saveTrip, updateTrip, useSavedTrips } from "@/features/planner/trips";
import type { PlannedTrip, TransportMode, TripLeg, TripStay } from "@/features/planner/types";
import {
  currencyFor, dateOfDay, fileInboxItem, formatRange, isoDay, money, moveStop, newId, patchStop, removeStop, total, tripCosts, tripStatus, useInbox,
} from "@/features/trips";
import { mockGuides } from "@/data/mockGuides";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import type { CategoryFilter, ItineraryStop } from "@/types/itinerary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { TripMap } from "@/components/map/TripMap";
import { KIND_ICON } from "./TripsPage";

const MODES: { value: TransportMode; label: string; icon: LucideIcon }[] = [
  { value: "train", label: "Train", icon: TrainFront },
  { value: "flight", label: "Flight", icon: Plane },
  { value: "bus", label: "Bus", icon: Bus },
  { value: "car", label: "Car", icon: Car },
  { value: "ferry", label: "Ferry", icon: Ship },
];
const modeIcon = (m: TransportMode) => MODES.find((x) => x.value === m)?.icon ?? TrainFront;

const CATEGORY: Record<string, CategoryFilter> = { food: "Food", nightlife: "Nightlife", shopping: "Shopping", history: "History", nature: "Nature" };

/** Bare input that looks like text until you focus it. */
const InlineInput = ({ className, ...props }: React.InputHTMLAttributes<HTMLInputElement>) => (
  <input
    {...props}
    className={cn(
      "min-w-0 rounded-md bg-transparent outline-none transition-colors placeholder:text-muted-foreground hover:bg-secondary/70 focus:bg-card focus:ring-2 focus:ring-primary/20",
      className,
    )}
  />
);

/** 24-hour time field ("13:30"); commits on blur so typing isn't interrupted. */
const TimeInput = ({ value, onChange, label }: { value: string; onChange: (v: string) => void; label: string }) => {
  const [v, setV] = useState(value);
  useEffect(() => setV(value), [value]);
  const commit = () => {
    const m = v.trim().match(/^(\d{1,2})[:.]?(\d{2})?$/);
    if (!m || Number(m[1]) > 23 || Number(m[2] ?? 0) > 59) return setV(value);
    const next = `${m[1].padStart(2, "0")}:${m[2] ?? "00"}`;
    setV(next);
    if (next !== value) onChange(next);
  };
  return (
    <InlineInput
      aria-label={label}
      inputMode="numeric"
      value={v}
      onChange={(e) => setV(e.target.value)}
      onBlur={commit}
      onKeyDown={(e) => e.key === "Enter" && (e.currentTarget as HTMLInputElement).blur()}
      className="w-[52px] px-1 py-0.5 text-[13px] tabular-nums text-muted-foreground"
    />
  );
};

const StopCard = ({
  stop,
  currency,
  onChange,
  onRemove,
  onDragStart,
  onDragOver,
  dropBefore,
}: {
  stop: ItineraryStop;
  currency?: string;
  onChange: (patch: Partial<ItineraryStop>) => void;
  onRemove: () => void;
  onDragStart: (e: DragEvent) => void;
  onDragOver: (e: DragEvent) => void;
  dropBefore: boolean;
}) => (
  <div onDragOver={onDragOver} className="relative">
    {dropBefore && <span className="absolute -top-[7px] left-0 right-0 h-0.5 rounded-full bg-primary" aria-hidden />}
    <div
      draggable
      onDragStart={onDragStart}
      className={cn("group rounded-xl border border-border bg-card p-3 shadow-xs transition-colors hover:border-foreground/20", stop.skipped && "opacity-60")}
    >
      <div className="flex items-start gap-1.5">
        <GripVertical className="mt-1.5 h-4 w-4 shrink-0 cursor-grab text-muted-foreground/60" strokeWidth={1.5} aria-hidden />
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-1">
            <TimeInput value={stop.time} label={`Time for ${stop.name}`} onChange={(time) => onChange({ time })} />
            <span className="text-xs text-muted-foreground">· {stop.duration}</span>
          </div>
          <textarea
            aria-label="Stop name"
            rows={1}
            value={stop.name}
            onChange={(e) => onChange({ name: e.target.value.replace(/\n/g, " ") })}
            className="block w-full resize-none rounded-md bg-transparent px-1 py-0.5 text-[15px] font-medium leading-snug outline-none transition-colors [field-sizing:content] hover:bg-secondary/70 focus:bg-card focus:ring-2 focus:ring-primary/20"
          />
          <div className="flex items-center justify-between gap-2 px-1">
            <span className="truncate text-xs text-muted-foreground">{stop.category}</span>
            <label className="flex items-center rounded-md text-xs tabular-nums text-muted-foreground transition-colors focus-within:bg-card focus-within:ring-2 focus-within:ring-primary/20 hover:bg-secondary/70">
              <span className="pl-1">{currency ?? "£"}</span>
              <input
                aria-label={`Cost of ${stop.name}`}
                inputMode="numeric"
                value={stop.cost ?? ""}
                placeholder="0"
                onChange={(e) => onChange({ cost: e.target.value === "" ? undefined : Math.max(0, Number(e.target.value.replace(/[^\d.]/g, "")) || 0) })}
                className="w-9 bg-transparent py-0.5 pr-1 tabular-nums text-foreground outline-none placeholder:text-muted-foreground"
              />
            </label>
          </div>
          {stop.note && (
            <p className="flex items-start gap-1.5 px-1 pt-1 text-xs text-foreground/75">
              <StickyNote className="mt-0.5 h-3 w-3 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              {stop.note}
            </p>
          )}
        </div>
        <button
          type="button"
          onClick={onRemove}
          aria-label={`Remove ${stop.name}`}
          className="rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-secondary hover:text-foreground focus:opacity-100 group-hover:opacity-100"
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  </div>
);

const AddStop = ({ onAdd }: { onAdd: (name: string) => void }) => {
  const [v, setV] = useState("");
  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!v.trim()) return;
        onAdd(v.trim());
        setV("");
      }}
      className="flex items-center gap-2 rounded-xl border border-dashed border-input px-3 transition-colors focus-within:border-primary/50"
    >
      <Plus className="h-4 w-4 shrink-0 text-muted-foreground" />
      <input value={v} onChange={(e) => setV(e.target.value)} placeholder="Add a stop" aria-label="Add a stop" className="h-10 min-w-0 flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground" />
    </form>
  );
};

/** Row in a side panel list with a remove button. */
const PanelRow = ({ icon: Icon, title, detail, amount, onRemove }: { icon: LucideIcon; title: string; detail: string; amount: string; onRemove: () => void }) => (
  <div className="group flex items-center gap-3 px-4 py-3">
    <Icon className="h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium">{title}</span>
      <span className="block truncate text-xs tabular-nums text-muted-foreground">{detail}</span>
    </span>
    <span className="text-sm tabular-nums">{amount}</span>
    <button type="button" onClick={onRemove} aria-label={`Remove ${title}`} className="rounded-md p-1 text-muted-foreground opacity-0 hover:bg-secondary group-hover:opacity-100 focus:opacity-100">
      <Trash2 className="h-3.5 w-3.5" />
    </button>
  </div>
);

const StaysPanel = ({ trip, commit }: { trip: PlannedTrip; commit: (t: PlannedTrip) => void }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState({ name: "", nights: "2", price: "" });
  const stays = trip.stays ?? [];
  const add = () => {
    if (!form.name.trim()) return;
    const stay: TripStay = { id: newId("stay"), name: form.name.trim(), fromDay: 1, nights: Math.max(1, Number(form.nights) || 1), pricePerNight: Number(form.price) || 0 };
    commit({ ...trip, stays: [...stays, stay] });
    setForm({ name: "", nights: "2", price: "" });
    setAdding(false);
  };
  return (
    <section className="surface overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-medium">Where you're staying</h3>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setAdding((a) => !a)}>
          <Plus className="!size-3.5" /> Add
        </Button>
      </div>
      <div className="divide-y divide-border">
        {stays.map((s) => (
          <PanelRow
            key={s.id}
            icon={BedDouble}
            title={s.name}
            detail={`${s.area ? `${s.area} · ` : ""}${s.nights} ${s.nights === 1 ? "night" : "nights"} × ${money(s.pricePerNight, trip.currency)}`}
            amount={total(s.nights * s.pricePerNight, trip.currency)}
            onRemove={() => commit({ ...trip, stays: stays.filter((x) => x.id !== s.id) })}
          />
        ))}
        {!stays.length && !adding && <p className="px-4 pb-4 text-[13px] text-muted-foreground">No stay yet</p>}
      </div>
      {adding && (
        <form
          className="space-y-2 border-t border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <Input autoFocus placeholder="Hotel or address" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} className="h-9" />
          <div className="grid grid-cols-2 gap-2">
            <Input placeholder="Nights" inputMode="numeric" value={form.nights} onChange={(e) => setForm({ ...form, nights: e.target.value })} className="h-9" aria-label="Nights" />
            <Input placeholder={`${trip.currency ?? "£"} per night`} inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-9" aria-label="Price per night" />
          </div>
          <Button type="submit" size="sm" className="w-full">
            Add stay
          </Button>
        </form>
      )}
    </section>
  );
};

const TransportPanel = ({ trip, commit }: { trip: PlannedTrip; commit: (t: PlannedTrip) => void }) => {
  const [adding, setAdding] = useState(false);
  const [form, setForm] = useState<{ mode: TransportMode; from: string; to: string; day: string; price: string }>({ mode: "train", from: "", to: trip.destinationName, day: "1", price: "" });
  const legs = trip.transport ?? [];
  const add = () => {
    if (!form.from.trim() || !form.to.trim()) return;
    const leg: TripLeg = { id: newId("leg"), mode: form.mode, from: form.from.trim(), to: form.to.trim(), day: Number(form.day) || 1, price: Number(form.price) || 0 };
    commit({ ...trip, transport: [...legs, leg].sort((a, b) => a.day - b.day) });
    setForm({ ...form, from: "", price: "" });
    setAdding(false);
  };
  return (
    <section className="surface overflow-hidden p-0">
      <div className="flex items-center justify-between px-4 pb-2 pt-4">
        <h3 className="text-sm font-medium">Getting there and around</h3>
        <Button size="sm" variant="ghost" className="h-7 px-2 text-xs" onClick={() => setAdding((a) => !a)}>
          <Plus className="!size-3.5" /> Add
        </Button>
      </div>
      <div className="divide-y divide-border">
        {legs.map((l) => (
          <PanelRow
            key={l.id}
            icon={modeIcon(l.mode)}
            title={`${l.from} → ${l.to}`}
            detail={`Day ${l.day}${l.time ? ` · ${l.time}` : ""}`}
            amount={money(l.price, trip.currency)}
            onRemove={() => commit({ ...trip, transport: legs.filter((x) => x.id !== l.id) })}
          />
        ))}
        {!legs.length && !adding && <p className="px-4 pb-4 text-[13px] text-muted-foreground">No transport yet</p>}
      </div>
      {adding && (
        <form
          className="space-y-2 border-t border-border p-4"
          onSubmit={(e) => {
            e.preventDefault();
            add();
          }}
        >
          <div className="grid grid-cols-[1fr_88px] gap-2">
            <Select value={form.mode} onValueChange={(v) => setForm({ ...form, mode: v as TransportMode })}>
              <SelectTrigger className="h-9" aria-label="Mode">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {MODES.map((m) => (
                  <SelectItem key={m.value} value={m.value}>
                    {m.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Select value={form.day} onValueChange={(v) => setForm({ ...form, day: v })}>
              <SelectTrigger className="h-9" aria-label="Day">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {trip.days.map((_, i) => (
                  <SelectItem key={i} value={String(i + 1)}>
                    Day {i + 1}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <Input autoFocus placeholder="From" value={form.from} onChange={(e) => setForm({ ...form, from: e.target.value })} className="h-9" />
          <div className="grid grid-cols-[1fr_88px] gap-2">
            <Input placeholder="To" value={form.to} onChange={(e) => setForm({ ...form, to: e.target.value })} className="h-9" />
            <Input placeholder={trip.currency ?? "£"} inputMode="numeric" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="h-9" aria-label="Price" />
          </div>
          <Button type="submit" size="sm" className="w-full">
            Add transport
          </Button>
        </form>
      )}
    </section>
  );
};

const CostPanel = ({ trip }: { trip: PlannedTrip }) => {
  const c = tripCosts(trip);
  const rows = [
    { label: "Stays", value: c.stays },
    { label: "Transport", value: c.transport },
    { label: "Activities and food", value: c.activities },
  ];
  const max = Math.max(1, ...rows.map((r) => r.value));
  return (
    <section className="surface space-y-4 p-4">
      <div>
        <p className="meta">Cost per person</p>
        <p className="text-display text-[40px] leading-none tabular-nums">{total(c.total, trip.currency)}</p>
      </div>
      <dl className="space-y-2.5">
        {rows.map((r) => (
          <div key={r.label} className="space-y-1">
            <div className="flex justify-between text-[13px]">
              <dt className="text-muted-foreground">{r.label}</dt>
              <dd className="tabular-nums">{total(r.value, trip.currency)}</dd>
            </div>
            <div className="h-1 overflow-hidden rounded-full bg-secondary">
              <div className="h-full rounded-full bg-foreground/35" style={{ width: `${(r.value / max) * 100}%` }} />
            </div>
          </div>
        ))}
      </dl>
    </section>
  );
};

const PhonePanel = ({ trip }: { trip: PlannedTrip }) => {
  const { items } = useInbox();
  const [day, setDay] = useState("0");
  const here = items.filter((i) => i.city === trip.destinationName);
  if (!here.length) return null;
  return (
    <section className="surface overflow-hidden p-0">
      <div className="flex items-center justify-between gap-2 px-4 pb-2 pt-4">
        <h3 className="flex items-center gap-2 text-sm font-medium">
          <Smartphone className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
          Saved on your phone
        </h3>
        <Select value={day} onValueChange={setDay}>
          <SelectTrigger className="h-7 w-[92px] text-xs" aria-label="Add to day">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {trip.days.map((_, i) => (
              <SelectItem key={i} value={String(i)}>
                To day {i + 1}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="divide-y divide-border">
        {here.map((item) => {
          const Icon = KIND_ICON[item.kind];
          return (
            <div key={item.id} className="flex items-center gap-3 px-4 py-2.5">
              <Icon className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <span className="min-w-0 flex-1 truncate text-sm">{item.name}</span>
              <Button
                size="sm"
                variant="secondary"
                className="h-7 px-2.5 text-xs"
                onClick={() => {
                  fileInboxItem(item.id, trip.id, Number(day));
                  toast.success(`Added to day ${Number(day) + 1}`);
                }}
              >
                Add
              </Button>
            </div>
          );
        })}
      </div>
    </section>
  );
};

const TripEditorPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { saved } = useSavedTrips();
  const { bookings } = useGuideBookings();
  const [draft, setDraft] = useState<PlannedTrip | undefined>(() => findTrip(id));
  const trip = saved.find((t) => t.id === id) ?? draft;
  const isSaved = saved.some((t) => t.id === id);
  const [view, setView] = useState<"days" | "map">("days");
  const [mapDay, setMapDay] = useState<number | null>(0);
  const [drag, setDrag] = useState<{ day: number; stopId: string } | null>(null);
  const [drop, setDrop] = useState<{ day: number; index: number } | null>(null);
  const [dateOpen, setDateOpen] = useState(false);

  const commit = (next: PlannedTrip) => {
    if (isSaved) updateTrip(next);
    else {
      updateTrip(next);
      setDraft(next);
    }
  };

  const bookingByDay = useMemo(() => {
    if (!trip) return {};
    const map: Record<number, (typeof bookings)[number]> = {};
    trip.days.forEach((_, i) => {
      const d = dateOfDay(trip, i);
      const b = d && bookings.find((x) => format(new Date(x.date), "yyyy-MM-dd") === format(d, "yyyy-MM-dd"));
      if (b) map[i] = b;
    });
    return map;
  }, [trip, bookings]);

  if (!trip) {
    return (
      <EmptyState
        className="h-full justify-center"
        icon={MapPin}
        title="Trip not found"
        description="It may have been deleted"
        action={<Button onClick={() => navigate("/trips")}>Back to trips</Button>}
      />
    );
  }

  const status = tripStatus(trip);
  const setDays = (n: number) => {
    if (n < 1 || n > 21) return;
    if (n > trip.days.length) {
      commit({ ...trip, duration: n, days: [...trip.days, { dayNumber: trip.days.length + 1, title: "Free day", stops: [] }] });
    } else {
      const last = trip.days[trip.days.length - 1];
      if (last.stops.length && !window.confirm(`Remove day ${trip.days.length} and its ${last.stops.length} stops?`)) return;
      commit({ ...trip, duration: n, days: trip.days.slice(0, n) });
    }
  };

  const addStop = (dayIndex: number, name: string) => {
    const day = trip.days[dayIndex];
    const last = day.stops[day.stops.length - 1];
    const hour = last ? Math.min(22, parseInt(last.time, 10) + 2) : 10;
    const stop: ItineraryStop = {
      id: newId("stop"),
      name,
      time: `${String(hour).padStart(2, "0")}:00`,
      duration: "1–2 hours",
      description: "Added by you",
      category: CATEGORY[guessKind(name)] ?? "Culture",
      coordinates: last?.coordinates ?? trip.days.flatMap((d) => d.stops)[0]?.coordinates ?? { lat: 0, lng: 0 },
      mapQuery: `${name}, ${trip.destinationName}`,
    };
    commit({ ...trip, days: trip.days.map((d, i) => (i === dayIndex ? { ...d, stops: [...d.stops, stop] } : d)) });
  };

  const onDrop = (dayIndex: number) => {
    if (!drag) return;
    const to = drop?.day === dayIndex ? drop.index : trip.days[dayIndex].stops.length;
    const sameDayBefore = drag.day === dayIndex && trip.days[dayIndex].stops.findIndex((s) => s.id === drag.stopId) < to;
    commit(moveStop(trip, drag.day, drag.stopId, dayIndex, sameDayBefore ? to - 1 : to));
    setDrag(null);
    setDrop(null);
  };

  const costs = tripCosts(trip);
  const guidesHere = trip.destinationName === "Edinburgh";

  return (
    <div className="flex min-h-full flex-col">
      {!isSaved && (
        <div className="flex items-center justify-between gap-4 border-b border-border bg-secondary/60 px-10 py-3">
          <p className="text-sm">This is a draft from the planner. Save it to keep your changes and see it on your phone.</p>
          <Button
            size="sm"
            onClick={() => {
              saveTrip({ ...trip, author: { name: "Alex Turner", avatar: "" }, currency: currencyFor(trip), stays: trip.stays ?? [], transport: trip.transport ?? [] });
              toast.success("Saved to your trips");
            }}
          >
            Save to my trips
          </Button>
        </div>
      )}

      <div className="mx-auto w-full max-w-[1440px] px-10 pt-8">
        <nav className="flex items-center gap-1.5 text-[13px] text-muted-foreground" aria-label="Breadcrumb">
          <Link to="/trips" className="hover:text-foreground">
            Trips
          </Link>
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="truncate text-foreground">{trip.title}</span>
          {isSaved && (
            <span className="ml-auto flex items-center gap-1.5 text-xs">
              <Check className="h-3.5 w-3.5" /> Saved
            </span>
          )}
        </nav>

        <div className="mt-4 flex items-start gap-8">
          <div className="min-w-0 flex-1">
            <InlineInput
              aria-label="Trip name"
              value={trip.title}
              onChange={(e) => commit({ ...trip, title: e.target.value })}
              className="text-display -ml-1.5 w-full px-1.5 py-0.5 text-[44px] leading-tight"
            />
            <div className="mt-3 flex flex-wrap items-center gap-2">
              <Popover open={dateOpen} onOpenChange={setDateOpen}>
                <PopoverTrigger asChild>
                  <Button variant="outline" size="sm" className="h-9 tabular-nums">
                    <CalendarDays />
                    {formatRange(trip) ?? "Add dates"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="start" className="w-auto p-3">
                  <p className="px-1 pb-2 text-xs text-muted-foreground">First day of the trip</p>
                  <Calendar
                    mode="single"
                    selected={trip.startDate ? parseISO(trip.startDate) : undefined}
                    onSelect={(d) => {
                      commit({ ...trip, startDate: d ? isoDay(d) : undefined });
                      setDateOpen(false);
                    }}
                  />
                </PopoverContent>
              </Popover>
              <div className="flex h-9 items-center rounded-[var(--radius-control)] border border-border bg-card">
                <button type="button" aria-label="Remove a day" onClick={() => setDays(trip.days.length - 1)} className="flex h-full w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                  <Minus className="h-3.5 w-3.5" />
                </button>
                <span className="px-1 text-sm tabular-nums">{trip.days.length} days</span>
                <button type="button" aria-label="Add a day" onClick={() => setDays(trip.days.length + 1)} className="flex h-full w-8 items-center justify-center text-muted-foreground hover:text-foreground">
                  <Plus className="h-3.5 w-3.5" />
                </button>
              </div>
              <span className="flex h-9 items-center gap-1.5 px-2 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" strokeWidth={1.5} />
                {trip.destinationName}
                {trip.country ? `, ${trip.country}` : ""}
              </span>
              {status === "now" && (
                <span className="flex h-9 items-center gap-1.5 px-2 text-sm text-primary">
                  <Smartphone className="h-4 w-4" strokeWidth={1.5} />
                  Live on your phone as Today
                </span>
              )}
            </div>
          </div>
          <SmartImage src={trip.imageUrl} alt="" className="h-[104px] w-[168px] shrink-0 rounded-xl object-cover" />
        </div>

        <div className="mt-8 flex items-center justify-between border-b border-border pb-4">
          <Segmented<"days" | "map">
            label="View"
            value={view}
            onChange={setView}
            className="w-[200px]"
            options={[
              { value: "days", label: "Days" },
              { value: "map", label: "Map" },
            ]}
          />
          <p className="text-sm tabular-nums text-muted-foreground">
            {trip.days.reduce((n, d) => n + d.stops.length, 0)} stops · {total(costs.total, trip.currency)} per person
          </p>
        </div>
      </div>

      <div className="mx-auto grid w-full max-w-[1440px] flex-1 grid-cols-[minmax(0,1fr)_300px] gap-8 px-10 pb-16 pt-6">
        {view === "days" ? (
          <div className="-mx-1 flex min-w-0 gap-4 overflow-x-auto px-1 pb-4">
            {trip.days.map((day, di) => {
              const date = dateOfDay(trip, di);
              const subtotal = day.stops.reduce((s, x) => s + (x.cost ?? 0), 0);
              const booking = bookingByDay[di];
              return (
                <section
                  key={di}
                  aria-label={`Day ${di + 1}`}
                  onDragOver={(e) => {
                    e.preventDefault();
                    if (drop?.day !== di && !day.stops.length) setDrop({ day: di, index: 0 });
                  }}
                  onDrop={(e) => {
                    e.preventDefault();
                    onDrop(di);
                  }}
                  className={cn(
                    "flex w-[240px] shrink-0 flex-col gap-3 rounded-2xl bg-secondary/60 p-2.5 transition-colors",
                    drag && drop?.day === di && "bg-secondary ring-1 ring-primary/25",
                  )}
                >
                  <header className="px-1 pt-1">
                    <div className="flex items-baseline justify-between">
                      <p className="eyebrow tabular-nums">
                        Day {di + 1}
                        {date ? ` · ${format(date, "EEE d MMM")}` : ""}
                      </p>
                      <span className="text-xs tabular-nums text-muted-foreground">{total(subtotal, trip.currency)}</span>
                    </div>
                    <textarea
                      aria-label={`Title for day ${di + 1}`}
                      rows={1}
                      value={day.title}
                      onChange={(e) => commit({ ...trip, days: trip.days.map((d, i) => (i === di ? { ...d, title: e.target.value.replace(/\n/g, " ") } : d)) })}
                      className="-ml-1 mt-0.5 block w-full resize-none rounded-md bg-transparent px-1 py-0.5 text-[17px] font-medium leading-snug outline-none transition-colors [field-sizing:content] hover:bg-secondary/70 focus:bg-card focus:ring-2 focus:ring-primary/20"
                    />
                  </header>

                  {day.stops.map((stop, si) => (
                    <StopCard
                      key={stop.id}
                      stop={stop}
                      currency={trip.currency}
                      dropBefore={!!drag && drop?.day === di && drop.index === si}
                      onChange={(patch) => commit(patchStop(trip, di, stop.id, patch))}
                      onRemove={() => commit(removeStop(trip, di, stop.id))}
                      onDragStart={(e) => {
                        e.dataTransfer.effectAllowed = "move";
                        e.dataTransfer.setData("text/plain", stop.id);
                        setDrag({ day: di, stopId: stop.id });
                      }}
                      onDragOver={(e) => {
                        e.preventDefault();
                        const r = (e.currentTarget as HTMLElement).getBoundingClientRect();
                        const index = e.clientY < r.top + r.height / 2 ? si : si + 1;
                        if (drop?.day !== di || drop.index !== index) setDrop({ day: di, index });
                      }}
                    />
                  ))}
                  {drag && drop?.day === di && drop.index === day.stops.length && day.stops.length > 0 && (
                    <span className="-mt-1.5 h-0.5 rounded-full bg-primary" aria-hidden />
                  )}

                  {booking && (
                    <div className="flex items-center gap-2.5 rounded-xl border border-dashed border-input px-3 py-2.5">
                      <SmartImage src={booking.guideAvatar} alt="" className="h-8 w-8 shrink-0 rounded-full object-cover" />
                      <span className="min-w-0 flex-1">
                        <span className="block truncate text-[13px] font-medium">Guide: {booking.guideName}</span>
                        <span className="block truncate text-xs text-muted-foreground">
                          {booking.time} · {booking.meetupLocation.name}
                        </span>
                      </span>
                      <Smartphone className="h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} aria-label="Booked on your phone" />
                    </div>
                  )}

                  <AddStop onAdd={(name) => addStop(di, name)} />
                </section>
              );
            })}
            <button
              type="button"
              onClick={() => setDays(trip.days.length + 1)}
              className="flex w-[120px] shrink-0 flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-input text-sm text-muted-foreground transition-colors hover:border-foreground/30 hover:text-foreground"
            >
              <Plus className="h-5 w-5" strokeWidth={1.5} />
              Add a day
            </button>
          </div>
        ) : (
          <div className="space-y-4">
            <TripMap days={trip.days} selectedDay={mapDay} onSelectDay={setMapDay} className="h-[560px]" />
            {mapDay !== null && trip.days[mapDay] && (
              <ol className="grid grid-cols-2 gap-x-8 gap-y-2">
                {trip.days[mapDay].stops.map((s, i) => (
                  <li key={s.id} className="flex items-baseline gap-3 text-sm">
                    <span className="w-5 text-right tabular-nums text-muted-foreground">{i + 1}</span>
                    <span className="w-12 tabular-nums text-muted-foreground">{s.time}</span>
                    <span className="truncate">{s.name}</span>
                  </li>
                ))}
              </ol>
            )}
          </div>
        )}

        <aside className="space-y-4">
          <CostPanel trip={trip} />
          <StaysPanel trip={trip} commit={commit} />
          <TransportPanel trip={trip} commit={commit} />
          <PhonePanel trip={trip} />
          {guidesHere && (
            <section className="surface-sunken flex gap-3 p-4">
              <Users className="mt-0.5 h-[18px] w-[18px] shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-[13px] leading-relaxed">
                {mockGuides.filter((g) => g.available).length} local guides are free in Edinburgh on these dates.{" "}
                <span className="text-muted-foreground">Book one from the Guides tab on your phone, where you can share your live plans with them.</span>
              </p>
            </section>
          )}
        </aside>
      </div>
    </div>
  );
};

export default TripEditorPage;
