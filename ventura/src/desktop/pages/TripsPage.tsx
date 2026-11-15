import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ArrowRight, Coffee, Compass, Landmark, MapPin, Plus, Smartphone, Ticket, UtensilsCrossed, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { SmartImage } from "@/components/kit";
import { catalog } from "@/features/planner/catalog";
import { tripFromCatalog } from "@/features/planner/builder";
import { saveTrip } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";
import {
  dayIndexOn, daysUntil, formatRange, isoDay, total, tripCosts, tripStatus, useInbox, useTripSchedule, type InboxItem,
} from "@/features/trips";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { Page, PageHeader } from "../Shell";

export const KIND_ICON: Record<InboxItem["kind"], LucideIcon> = {
  place: MapPin,
  food: UtensilsCrossed,
  cafe: Coffee,
  event: Ticket,
  landmark: Landmark,
};

const stopCount = (t: PlannedTrip) => t.days.reduce((n, d) => n + d.stops.length, 0);

const TripCard = ({ trip }: { trip: PlannedTrip }) => {
  const navigate = useNavigate();
  const costs = tripCosts(trip);
  const status = tripStatus(trip);
  return (
    <button type="button" onClick={() => navigate(`/trips/${trip.id}`)} className="surface group overflow-hidden p-0 text-left transition-colors hover:border-foreground/20">
      <SmartImage src={trip.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
      <div className="space-y-1 p-4">
        <p className="meta tabular-nums">
          {status === "upcoming" ? `${formatRange(trip)} · in ${daysUntil(trip)} days` : status === "past" ? `${formatRange(trip)} · done` : "No dates yet"}
        </p>
        <h3 className="text-title text-lg leading-snug">{trip.title}</h3>
        <p className="meta tabular-nums">
          {trip.days.length} days · {stopCount(trip)} stops{costs.total > 0 ? ` · ${total(costs.total, trip.currency)} per person` : ""}
        </p>
      </div>
    </button>
  );
};

const NewTripDialog = ({ open, onOpenChange }: { open: boolean; onOpenChange: (v: boolean) => void }) => {
  const navigate = useNavigate();
  const [dest, setDest] = useState("lisbon");
  const [start, setStart] = useState(isoDay(new Date(Date.now() + 1000 * 60 * 60 * 24 * 60)));
  const [days, setDays] = useState(4);
  const options = [...catalog].sort((a, b) => a.name.localeCompare(b.name));
  const create = () => {
    const d = catalog.find((c) => c.id === dest) ?? catalog[0];
    const trip = tripFromCatalog(d, { source: "custom", days });
    const mine: PlannedTrip = {
      ...trip,
      title: `${d.name} trip`,
      author: { name: "Alex Turner", avatar: "" },
      startDate: start || undefined,
      currency: "£",
      stays: [],
      transport: [],
    };
    saveTrip(mine);
    onOpenChange(false);
    navigate(`/trips/${mine.id}`);
  };
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>New trip</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 py-2">
          <div className="space-y-2">
            <Label>Destination</Label>
            <Select value={dest} onValueChange={setDest}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="max-h-72">
                {options.map((c) => (
                  <SelectItem key={c.id} value={c.id}>
                    {c.name}, {c.country}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-2">
              <Label htmlFor="nt-start">Start date</Label>
              <Input id="nt-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="nt-days">Days</Label>
              <Input id="nt-days" type="number" min={1} max={14} value={days} onChange={(e) => setDays(Math.max(1, Math.min(14, Number(e.target.value) || 1)))} />
            </div>
          </div>
          <p className="text-[13px] text-muted-foreground">We'll draft the days from the destination's highlights. You can change everything after.</p>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={create}>Create trip</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

const TripsPage = () => {
  const navigate = useNavigate();
  const { saved, today, upcoming } = useTripSchedule();
  const { items: inbox } = useInbox();
  const { getUpcomingBookings } = useGuideBookings();
  const [newOpen, setNewOpen] = useState(false);
  const bookings = getUpcomingBookings();
  const undated = saved.filter((t) => tripStatus(t) === "unscheduled");
  const past = saved.filter((t) => tripStatus(t) === "past");

  const now = today?.trip;
  const nowCosts = now ? tripCosts(now) : null;
  const nextStop = now ? now.days[today!.dayIndex].stops.find((s) => !s.done && !s.skipped) : undefined;

  return (
    <Page>
      <PageHeader eyebrow={format(new Date(), "EEEE d MMMM")} title="Your trips">
        <Button variant="outline" onClick={() => navigate("/explore")}>
          <Compass />
          Explore
        </Button>
        <Button onClick={() => setNewOpen(true)}>
          <Plus />
          New trip
        </Button>
      </PageHeader>

      <div className="grid grid-cols-[minmax(0,1fr)_320px] gap-10">
        <div className="space-y-10">
          {now && (
            <section className="space-y-3">
              <h2 className="eyebrow">Happening now</h2>
              <button type="button" onClick={() => navigate(`/trips/${now.id}`)} className="surface grid w-full grid-cols-[300px_1fr] overflow-hidden p-0 text-left transition-colors hover:border-foreground/20">
                <SmartImage src={now.imageUrl} alt="" className="h-full min-h-[220px] w-full object-cover" />
                <div className="flex flex-col p-6">
                  <p className="flex items-center gap-2 text-[13px] text-primary">
                    <Smartphone className="h-4 w-4" strokeWidth={1.5} />
                    On your phone as Today · day {dayIndexOn(now) + 1} of {now.days.length}
                  </p>
                  <h3 className="text-display mt-3 text-[32px] leading-tight">{now.title}</h3>
                  <p className="meta mt-1 tabular-nums">
                    {formatRange(now)} · {now.destinationName}, {now.country}
                  </p>
                  {nextStop && (
                    <p className="mt-5 text-sm">
                      <span className="text-muted-foreground">Next up </span>
                      <span className="tabular-nums">{nextStop.time}</span> {nextStop.name}
                    </p>
                  )}
                  <div className="mt-auto flex items-end justify-between pt-6">
                    <dl className="flex gap-8">
                      {[
                        { k: "Stops", v: stopCount(now) },
                        { k: "Per person", v: total(nowCosts!.total, now.currency) },
                      ].map(({ k, v }) => (
                        <div key={k}>
                          <dd className="text-title text-xl tabular-nums">{v}</dd>
                          <dt className="meta">{k}</dt>
                        </div>
                      ))}
                    </dl>
                    <span className="flex items-center gap-1.5 text-sm font-medium">
                      Open trip <ArrowRight className="h-4 w-4" />
                    </span>
                  </div>
                </div>
              </button>
            </section>
          )}

          <section className="space-y-3">
            <h2 className="eyebrow">Coming up</h2>
            {upcoming.length ? (
              <div className="grid grid-cols-2 gap-5">
                {upcoming.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            ) : (
              <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">Nothing scheduled. Give a trip a start date and it shows up here.</p>
            )}
          </section>

          {undated.length > 0 && (
            <section className="space-y-3">
              <h2 className="eyebrow">No dates yet</h2>
              <div className="grid grid-cols-3 gap-5">
                {undated.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            </section>
          )}

          {past.length > 0 && (
            <section className="space-y-3">
              <h2 className="eyebrow">Past trips</h2>
              <div className="grid grid-cols-3 gap-5">
                {past.map((t) => (
                  <TripCard key={t.id} trip={t} />
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="space-y-8">
          <section className="space-y-3">
            <div className="flex items-baseline justify-between">
              <h2 className="eyebrow">From your phone</h2>
              <span className="meta tabular-nums">{inbox.length}</span>
            </div>
            <div className="surface divide-y divide-border overflow-hidden p-0">
              {inbox.slice(0, 4).map((item) => {
                const Icon = KIND_ICON[item.kind];
                return (
                  <div key={item.id} className="flex items-center gap-3 px-4 py-3">
                    {item.image ? (
                      <SmartImage src={item.image} alt="" className="h-9 w-9 shrink-0 rounded-lg object-cover" />
                    ) : (
                      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-secondary text-muted-foreground">
                        <Icon className="h-4 w-4" strokeWidth={1.5} />
                      </span>
                    )}
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">{item.name}</span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {item.source} · {item.city}
                      </span>
                    </span>
                  </div>
                );
              })}
              {!inbox.length && <p className="px-4 py-3 text-sm text-muted-foreground">Places you save on your phone land here</p>}
              {inbox.length > 0 && (
                <button type="button" onClick={() => navigate("/inbox")} className="flex w-full items-center justify-between px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary/60">
                  Sort into trips
                  <ArrowRight className="h-4 w-4" />
                </button>
              )}
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="eyebrow">Guide bookings</h2>
            <div className="surface divide-y divide-border overflow-hidden p-0">
              {bookings.map((b) => (
                <div key={b.id} className="flex items-center gap-3 px-4 py-3">
                  <SmartImage src={b.guideAvatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" />
                  <span className="min-w-0">
                    <span className="block truncate text-sm font-medium">{b.guideName}</span>
                    <span className="block truncate text-xs tabular-nums text-muted-foreground">
                      {format(new Date(b.date), "EEE d MMM")} · {b.time} · {b.meetupLocation.name}
                    </span>
                  </span>
                </div>
              ))}
              {!bookings.length && <p className="px-4 py-3 text-sm text-muted-foreground">No upcoming bookings</p>}
              <p className="flex items-center gap-2 px-4 py-3 text-xs text-muted-foreground">
                <Smartphone className="h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                Book and manage guides in the phone app
              </p>
            </div>
          </section>
        </aside>
      </div>

      <NewTripDialog open={newOpen} onOpenChange={setNewOpen} />
    </Page>
  );
};

export default TripsPage;
