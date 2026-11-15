import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import {
  ArrowDown, ArrowUp, CalendarDays, Check, ChevronRight, Footprints, Laptop, MoreHorizontal, Navigation, RotateCcw, SkipForward, StickyNote, Users,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { BottomSheet, EmptyState, Segmented, SmartImage } from "@/components/kit";
import { updateTrip } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";
import {
  dateOfDay, daysUntil, directionsUrl, formatRange, formatWalk, money, nudgeStop, patchStop, useInbox, useTripSchedule, walkMinutes,
} from "@/features/trips";
import { itineraries } from "@/data/mockItineraries";
import { mockGuides } from "@/data/mockGuides";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import type { ItineraryStop } from "@/types/itinerary";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

/** One stop on the day's route, with the walk to the next one underneath. */
const StopRow = ({
  stop,
  isNext,
  walk,
  last,
  currency,
  onOpen,
}: {
  stop: ItineraryStop;
  isNext: boolean;
  walk?: string;
  last: boolean;
  currency?: string;
  onOpen: () => void;
}) => (
  <li className="grid grid-cols-[48px_20px_1fr] gap-x-3">
    <span className={cn("pt-3.5 text-[13px] tabular-nums", stop.done || stop.skipped ? "text-muted-foreground" : "font-medium")}>{stop.time}</span>
    <span className="flex flex-col items-center pt-[18px]">
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full",
          isNext ? "h-3 w-3 bg-primary ring-4 ring-primary/15" : stop.done ? "h-3 w-3 bg-ink" : "h-3 w-3 border-2 border-input bg-card",
        )}
      />
      {!last && <span className={cn("mt-1.5 w-0.5 flex-1", stop.done ? "bg-ink" : "route-line-v")} aria-hidden />}
    </span>
    <div className="pb-2">
      <button
        type="button"
        onClick={onOpen}
        className={cn(
          "flex w-full items-start gap-3 rounded-xl px-3 py-3 text-left transition-colors hover:bg-secondary",
          isNext && "bg-card shadow-xs ring-1 ring-border hover:bg-card",
        )}
      >
        <span className="min-w-0 flex-1">
          <span className={cn("block text-[15px] font-medium leading-snug", (stop.done || stop.skipped) && "text-muted-foreground", stop.skipped && "line-through")}>
            {stop.name}
          </span>
          <span className="meta mt-0.5 block">
            {[stop.skipped ? "Skipped" : stop.done ? "Done" : stop.category, stop.duration, stop.cost !== undefined ? money(stop.cost, currency) : null]
              .filter(Boolean)
              .join(" · ")}
          </span>
          {stop.note && (
            <span className="mt-2 flex items-start gap-1.5 text-[13px] text-foreground/80">
              <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              {stop.note}
            </span>
          )}
        </span>
        <MoreHorizontal className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" aria-label="Stop options" />
      </button>
      {walk && !last && (
        <p className="flex items-center gap-1.5 px-3 pb-1 pt-0.5 text-xs text-muted-foreground">
          <Footprints className="h-3.5 w-3.5" strokeWidth={1.5} />
          {walk}
        </p>
      )}
    </div>
  </li>
);

/** Small edits only: done, skip, reorder, a note. Bigger changes happen on desktop. */
const StopSheet = ({
  trip,
  dayIndex,
  stop,
  onClose,
}: {
  trip: PlannedTrip;
  dayIndex: number;
  stop: ItineraryStop | null;
  onClose: () => void;
}) => {
  const [note, setNote] = useState("");
  useEffect(() => setNote(stop?.note ?? ""), [stop]);
  if (!stop) return null;
  const stops = trip.days[dayIndex].stops;
  const i = stops.findIndex((s) => s.id === stop.id);
  const apply = (next: PlannedTrip, message?: string) => {
    updateTrip(next);
    if (message) toast(message);
    onClose();
  };

  const actions = [
    {
      icon: stop.done ? RotateCcw : Check,
      label: stop.done ? "Mark as not done" : "Mark as done",
      run: () => apply(patchStop(trip, dayIndex, stop.id, { done: !stop.done, skipped: false })),
    },
    i > 0 && { icon: ArrowUp, label: "Move earlier", run: () => apply(nudgeStop(trip, dayIndex, stop.id, -1), "Moved earlier") },
    i < stops.length - 1 && { icon: ArrowDown, label: "Move later", run: () => apply(nudgeStop(trip, dayIndex, stop.id, 1), "Moved later") },
    {
      icon: stop.skipped ? RotateCcw : SkipForward,
      label: stop.skipped ? "Bring it back" : "Skip today",
      run: () => apply(patchStop(trip, dayIndex, stop.id, { skipped: !stop.skipped, done: false }), stop.skipped ? "Back on today's plan" : "Skipped"),
    },
  ].filter(Boolean) as { icon: typeof Check; label: string; run: () => void }[];

  return (
    <BottomSheet open onClose={onClose} label={stop.name}>
      <div className="pb-safe space-y-5 px-5 pb-5">
        <div className="pt-2">
          <p className="meta tabular-nums">
            {stop.time} · {stop.duration}
          </p>
          <h3 className="text-title mt-1 text-xl">{stop.name}</h3>
          <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{stop.description}</p>
        </div>

        <Button asChild size="lg" className="w-full">
          <a href={directionsUrl(stop)} target="_blank" rel="noreferrer">
            <Navigation />
            Directions
          </a>
        </Button>

        <div className="surface divide-y divide-border overflow-hidden p-0">
          {actions.map(({ icon: Icon, label, run }) => (
            <button key={label} type="button" onClick={run} className="flex w-full items-center gap-3 px-4 py-3.5 text-left text-[15px] transition-colors hover:bg-secondary">
              <Icon className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.5} />
              {label}
            </button>
          ))}
        </div>

        <form
          className="space-y-2"
          onSubmit={(e) => {
            e.preventDefault();
            apply(patchStop(trip, dayIndex, stop.id, { note: note.trim() || undefined }), note.trim() ? "Note saved" : "Note removed");
          }}
        >
          <label htmlFor="stop-note" className="eyebrow">
            Note
          </label>
          <Textarea id="stop-note" rows={2} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Tickets, a reminder, who you're meeting" />
          <Button type="submit" variant="secondary" className="w-full">
            Save note
          </Button>
        </form>
      </div>
    </BottomSheet>
  );
};

const NoTrip = () => {
  const navigate = useNavigate();
  const { upcoming } = useTripSchedule();
  const next = upcoming[0];
  const nearby = itineraries.filter((i) => i.destinationId === "edinburgh");
  return (
    <div className="space-y-8">
      <EmptyState
        icon={CalendarDays}
        title="No trip today"
        description="Trips you plan on Ventura for desktop show up here on the days they run"
        className="py-10"
      />
      {next && (
        <button type="button" onClick={() => navigate(`/itinerary/${next.id}`)} className="surface flex w-full items-center gap-3 p-3 text-left">
          <SmartImage src={next.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
          <span className="min-w-0 flex-1">
            <span className="block truncate font-medium">{next.title}</span>
            <span className="meta block">
              {formatRange(next)} · in {daysUntil(next)} days
            </span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      )}
      <NearbyItineraries list={nearby} />
    </div>
  );
};

const NearbyItineraries = ({ list }: { list: typeof itineraries }) => {
  const navigate = useNavigate();
  if (!list.length) return null;
  return (
    <section className="space-y-3">
      <p className="eyebrow">Itineraries around you</p>
      <div className="surface divide-y divide-border overflow-hidden p-0">
        {list.map((it) => (
          <button key={it.id} type="button" onClick={() => navigate(`/itinerary/${it.id}`)} className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary/60">
            <SmartImage src={it.imageUrl} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
            <span className="min-w-0 flex-1">
              <span className="block truncate text-[15px] font-medium">{it.title}</span>
              <span className="meta block">
                {it.duration} days · {it.author.name}
              </span>
            </span>
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        ))}
      </div>
    </section>
  );
};

const TodayPage = () => {
  const navigate = useNavigate();
  const { today } = useTripSchedule();
  const { items: inbox } = useInbox();
  const { bookings } = useGuideBookings();
  const [dayIndex, setDayIndex] = useState<number>(today?.dayIndex ?? 0);
  const [openStop, setOpenStop] = useState<string | null>(null);

  useEffect(() => {
    if (today) setDayIndex((d) => Math.min(d, today.trip.days.length - 1));
  }, [today]);

  const trip = today?.trip;
  const day = trip?.days[dayIndex];
  const isToday = !!today && dayIndex === today.dayIndex;
  const date = trip ? dateOfDay(trip, dayIndex) : undefined;

  const next = useMemo(() => (isToday && day ? day.stops.find((s) => !s.done && !s.skipped) : undefined), [isToday, day]);
  const prevOfNext = next && day ? [...day.stops.slice(0, day.stops.indexOf(next))].reverse().find((s) => s.done) : undefined;
  const dayCost = day?.stops.reduce((sum, s) => sum + (s.skipped ? 0 : s.cost ?? 0), 0) ?? 0;
  const guideToday = date ? bookings.find((b) => format(new Date(b.date), "yyyy-MM-dd") === format(date, "yyyy-MM-dd")) : undefined;
  const nearby = itineraries.filter((i) => trip && i.destinationId === trip.destinationId);

  return (
    <div className="pt-safe mx-auto min-h-screen max-w-2xl px-5">
      <header className="pb-5 pt-8">
        <p className="eyebrow">{format(new Date(), "EEEE d MMMM")}</p>
        <h1 className="text-display mt-2 text-[36px]">{trip ? trip.title : "Today"}</h1>
        {trip && (
          <p className="mt-1 text-[15px] text-muted-foreground">
            Day {today!.dayIndex + 1} of {trip.days.length} in {trip.destinationName}
          </p>
        )}
      </header>

      {!trip || !day ? (
        <NoTrip />
      ) : (
        <div className="space-y-8 pb-6">
          <Segmented<string>
            label="Trip day"
            value={String(dayIndex)}
            onChange={(v) => setDayIndex(Number(v))}
            options={trip.days.map((_, i) => ({ value: String(i), label: i === today!.dayIndex ? "Today" : `Day ${i + 1}` }))}
          />

          {next && (
            <section className="surface space-y-4 p-5" aria-label="Next up">
              <div className="flex items-baseline justify-between gap-3">
                <p className="eyebrow">Next up</p>
                <p className="text-[13px] tabular-nums text-primary">{next.time}</p>
              </div>
              <div>
                <h2 className="text-title text-[22px] leading-tight">{next.name}</h2>
                <p className="meta mt-1.5 flex items-center gap-1.5">
                  <Footprints className="h-4 w-4" strokeWidth={1.5} />
                  {formatWalk(walkMinutes(prevOfNext?.coordinates, next.coordinates)) ?? "Walk from where you are"}
                  {prevOfNext && <> from {prevOfNext.name.replace(/ hike$/, "")}</>}
                </p>
              </div>
              {next.note && (
                <p className="flex items-start gap-2 rounded-xl bg-secondary px-3 py-2.5 text-[13px]">
                  <StickyNote className="mt-0.5 h-3.5 w-3.5 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                  {next.note}
                </p>
              )}
              <div className="flex gap-2">
                <Button asChild className="flex-1">
                  <a href={directionsUrl(next)} target="_blank" rel="noreferrer">
                    <Navigation />
                    Directions
                  </a>
                </Button>
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    updateTrip(patchStop(trip, dayIndex, next.id, { done: true }));
                    toast("Marked as done");
                  }}
                >
                  <Check />
                  Done
                </Button>
              </div>
            </section>
          )}

          <section className="space-y-3">
            <div className="flex items-end justify-between gap-3">
              <div className="space-y-1">
                <p className="eyebrow tabular-nums">
                  {date ? format(date, "EEE d MMM") : `Day ${dayIndex + 1}`} · {day.stops.length} stops · {money(dayCost, trip.currency)}
                </p>
                <h2 className="text-title text-xl">{day.title}</h2>
              </div>
            </div>
            <ol className="-ml-1">
              {day.stops.map((s, i) => (
                <StopRow
                  key={s.id}
                  stop={s}
                  isNext={next?.id === s.id}
                  last={i === day.stops.length - 1}
                  currency={trip.currency}
                  walk={formatWalk(walkMinutes(s.coordinates, day.stops[i + 1]?.coordinates))}
                  onOpen={() => setOpenStop(s.id)}
                />
              ))}
            </ol>
          </section>

          {guideToday ? (
            <button type="button" onClick={() => navigate(`/bookings/${guideToday.id}`)} className="surface flex w-full items-center gap-3 p-3 text-left">
              <SmartImage src={guideToday.guideAvatar} alt="" className="h-12 w-12 shrink-0 rounded-full object-cover" />
              <span className="min-w-0 flex-1">
                <span className="block font-medium">Meeting {guideToday.guideName.split(" ")[0]}</span>
                <span className="meta block truncate">
                  {guideToday.time} · {guideToday.meetupLocation.name}
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            isToday && (
              <section className="surface-sunken flex items-center gap-3 p-4">
                <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground">
                  <Users className="h-[18px] w-[18px]" strokeWidth={1.5} />
                </span>
                <p className="min-w-0 flex-1 text-sm">
                  Free this afternoon? <span className="text-muted-foreground">{mockGuides.filter((g) => g.available).length} verified locals are around today</span>
                </p>
                <Button size="sm" variant="secondary" onClick={() => navigate("/guides")}>
                  Meet one
                </Button>
              </section>
            )
          )}

          <div className="space-y-2">
            <button type="button" onClick={() => navigate(`/itinerary/${trip.id}`)} className="flex w-full items-center justify-between rounded-xl bg-secondary px-4 py-3.5 text-left">
              <span>
                <span className="block text-sm font-medium">Whole trip</span>
                <span className="meta block">
                  {formatRange(trip)} · {trip.days.length} days
                </span>
              </span>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
            {inbox.length > 0 && (
              <p className="flex items-center gap-2 px-1 pt-1 text-[13px] text-muted-foreground">
                <Laptop className="h-4 w-4 shrink-0" strokeWidth={1.5} />
                {inbox.length} saved {inbox.length === 1 ? "place is" : "places are"} waiting to be sorted on desktop
              </p>
            )}
          </div>

          <NearbyItineraries list={nearby} />
        </div>
      )}

      {trip && day && (
        <StopSheet trip={trip} dayIndex={dayIndex} stop={day.stops.find((s) => s.id === openStop) ?? null} onClose={() => setOpenStop(null)} />
      )}
    </div>
  );
};

export default TodayPage;
