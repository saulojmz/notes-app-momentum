import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, MapPin, Share, Map as MapIcon, Compass, Bookmark, BookmarkCheck, Pencil, Check, Plus, Trash2,
  Sparkles, Quote, BedDouble, Wallet, Star, Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { itineraries, destinations } from "@/data/mockItineraries";
import { DaySection } from "@/components/itinerary/DaySection";
import { EmptyState, MetaDot, MetaItem, Rating, SectionHeader, SmartImage } from "@/components/kit";
import { findTrip, updateTrip, useSavedTrips } from "@/features/planner/trips";
import { guessKind } from "@/features/planner/builder";
import type { PlannedTrip } from "@/features/planner/types";
import type { Itinerary } from "@/types/itinerary";
import { photo } from "@/lib/photos";
import { toast } from "sonner";

const AUTHOR_AVATAR = photo("1507003211169-0a1dd7228f2d");

const SOURCE_LABEL: Record<PlannedTrip["source"], string> = {
  ai: "Planned with AI",
  community: "Traveler favourite",
  guided: "Guided match",
};

/** Inline editor for a planned trip's stops. */
const TripEditor = ({ trip, onChange }: { trip: PlannedTrip; onChange: (t: PlannedTrip) => void }) => {
  const [drafts, setDrafts] = useState<Record<number, string>>({});
  const setDays = (days: PlannedTrip["days"]) => onChange({ ...trip, days });

  return (
    <div className="space-y-6 pt-2">
      {trip.days.map((day, di) => (
        <section key={day.dayNumber} className="space-y-2.5">
          <p className="eyebrow">
            Day {day.dayNumber} · {day.title}
          </p>
          <ul className="space-y-2">
            {day.stops.map((stop, si) => (
              <li key={stop.id} className="flex items-center gap-2">
                <span className="w-12 shrink-0 font-mono text-xs tabular text-muted-foreground">{stop.time}</span>
                <input
                  aria-label={`Stop ${si + 1} on day ${day.dayNumber}`}
                  value={stop.name}
                  onChange={(e) =>
                    setDays(trip.days.map((d, i) => (i === di ? { ...d, stops: d.stops.map((s, j) => (j === si ? { ...s, name: e.target.value } : s)) } : d)))
                  }
                  className="h-11 min-w-0 flex-1 rounded-xl border border-input bg-card px-3 text-[15px] outline-none focus:border-primary/50 focus:ring-4 focus:ring-primary/10"
                />
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={`Remove ${stop.name}`}
                  onClick={() => setDays(trip.days.map((d, i) => (i === di ? { ...d, stops: d.stops.filter((_, j) => j !== si) } : d)))}
                >
                  <Trash2 className="text-muted-foreground" />
                </Button>
              </li>
            ))}
          </ul>
          <form
            className="flex items-center gap-2"
            onSubmit={(e) => {
              e.preventDefault();
              const name = (drafts[di] ?? "").trim();
              if (!name) return;
              const kind = guessKind(name);
              const last = day.stops[day.stops.length - 1];
              setDays(
                trip.days.map((d, i) =>
                  i === di
                    ? {
                        ...d,
                        stops: [
                          ...d.stops,
                          {
                            id: `stop-${Date.now().toString(36)}`,
                            name,
                            time: last ? "20:00" : "10:00",
                            duration: "1–2 hours",
                            description: "Added by you.",
                            category: ({ food: "Food", nightlife: "Nightlife", shopping: "Shopping", history: "History" } as const)[kind as "food"] ?? "Culture",
                            coordinates: last?.coordinates ?? { lat: 0, lng: 0 },
                            mapQuery: `${name}, ${trip.destinationName}`,
                          },
                        ],
                      }
                    : d,
                ),
              );
              setDrafts({ ...drafts, [di]: "" });
            }}
          >
            <span className="w-12 shrink-0" />
            <input
              aria-label={`Add a stop to day ${day.dayNumber}`}
              placeholder="Add a stop"
              value={drafts[di] ?? ""}
              onChange={(e) => setDrafts({ ...drafts, [di]: e.target.value })}
              className="h-11 min-w-0 flex-1 rounded-xl border border-dashed border-input bg-transparent px-3 text-[15px] outline-none placeholder:text-muted-foreground focus:border-primary/50"
            />
            <Button type="submit" variant="secondary" size="icon-sm" aria-label="Add stop">
              <Plus />
            </Button>
          </form>
        </section>
      ))}
    </div>
  );
};

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mock = itineraries.find((i) => i.id === id);
  const [planned, setPlanned] = useState<PlannedTrip | undefined>(() => (mock ? undefined : findTrip(id)));
  const [editing, setEditing] = useState(false);
  const { isSaved, save, unsave } = useSavedTrips();

  useEffect(() => {
    setPlanned(mock ? undefined : findTrip(id));
    setEditing(false);
  }, [id, mock]);

  const itinerary: Itinerary | undefined = mock ?? planned;
  const mockDestination = mock ? destinations.find((d) => d.id === mock.destinationId) : undefined;
  const place = planned
    ? { name: planned.destinationName, country: planned.country }
    : mockDestination
      ? { name: mockDestination.name, country: mockDestination.country }
      : null;

  if (!itinerary || !place) {
    return (
      <EmptyState
        className="min-h-screen justify-center"
        icon={Compass}
        title="Itinerary not found"
        description="It may have been removed by its author."
        action={
          <Button className="w-full" onClick={() => navigate("/itinerary")}>
            Back to itineraries
          </Button>
        }
      />
    );
  }

  const totalStops = itinerary.days.reduce((sum, day) => sum + day.stops.length, 0);
  const saved = planned ? isSaved(planned.id) : false;

  // Catalog itineraries go back to the profile (as specified); planned trips return to wherever they came from.
  const goBack = () => {
    if (!planned) return navigate("/profile");
    if (location.key !== "default") return navigate(-1);
    navigate("/plan-trip");
  };

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    toast.success("Link copied to clipboard");
  };

  const toggleSave = () => {
    if (!planned) return;
    if (saved) {
      unsave(planned.id);
      toast("Removed from your trips");
    } else {
      save(planned);
      toast.success("Saved to your trips", { description: "Find it on your profile." });
    }
  };

  const finishEditing = () => {
    if (planned) {
      updateTrip(planned);
      toast.success("Changes saved");
    }
    setEditing(false);
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden bg-secondary">
        <SmartImage src={itinerary.imageUrl} alt={itinerary.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-t absolute inset-x-0 top-0 h-32" />
        <div className="scrim-b absolute inset-0" />

        <div className="top-safe absolute inset-x-0 flex items-center justify-between px-4">
          <Button variant="glass-dark" size="icon" onClick={goBack} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
          <div className="flex gap-2">
            {planned && (
              <Button variant="glass-dark" size="icon" onClick={toggleSave} aria-label={saved ? "Remove from saved trips" : "Save trip"}>
                {saved ? <BookmarkCheck className="!size-5 text-highlight" /> : <Bookmark className="!size-5" />}
              </Button>
            )}
            <Button variant="glass-dark" size="icon" onClick={() => navigate(`/itinerary/${itinerary.id}/map`)} aria-label="View on map">
              <MapIcon className="!size-5" />
            </Button>
            <Button variant="glass-dark" size="icon" onClick={handleShare} aria-label="Share">
              <Share className="!size-5" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl p-5 pb-7 text-on-image">
          <div className="flex flex-wrap gap-1.5">
            {planned && planned.source !== "community" && (
              <Badge className="bg-brand-gradient border-0 text-primary-foreground">
                {planned.source === "guided" ? <Target /> : <Sparkles />}
                {planned.source === "guided" ? `${planned.match}% match` : SOURCE_LABEL[planned.source]}
              </Badge>
            )}
            <Badge variant="glass">{planned?.vibeLabel ?? itinerary.category}</Badge>
          </div>
          <h1 className="text-display mt-3 text-[38px]">{itinerary.title}</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-on-image/75">
            {[place.name, place.country].filter(Boolean).join(", ")}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-5">
        <div className="space-y-5 border-b border-border py-6">
          <p className="text-[17px] leading-relaxed text-foreground/80">{itinerary.description}</p>

          {/* Author */}
          <div className="flex items-center gap-3">
            {planned && planned.source !== "community" ? (
              <span className="bg-brand-gradient flex h-10 w-10 items-center justify-center rounded-full text-primary-foreground">
                <Sparkles className="h-4 w-4" />
              </span>
            ) : (
              <Avatar className="h-10 w-10">
                {!planned && <AvatarImage src={AUTHOR_AVATAR} alt={itinerary.author.name} />}
                <AvatarFallback className="bg-secondary">{itinerary.author.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-sm font-semibold">{itinerary.author.name}</p>
              <p className="text-xs text-muted-foreground">{planned ? SOURCE_LABEL[planned.source] : "Local author"}</p>
            </div>
          </div>

          {/* Meta — one line */}
          <div className="flex items-center gap-2.5">
            <MetaItem icon={Clock} className="text-[13px] text-foreground">
              {itinerary.duration} {itinerary.duration === 1 ? "day" : "days"}
            </MetaItem>
            <MetaDot />
            <MetaItem icon={MapPin} className="text-[13px] text-foreground">
              {totalStops} stops
            </MetaItem>
            <MetaDot />
            <Rating value={itinerary.rating} className="text-[13px]" />
          </div>

          {itinerary.tags.length > 0 && (
            <div className="flex flex-wrap gap-2">
              {itinerary.tags.map((tag) => (
                <Badge key={tag} variant="outline" className="h-7 px-3">
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {planned?.reason && (
            <div className="surface-sunken flex gap-3 p-4">
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <p className="text-sm leading-relaxed">
                <span className="font-semibold">Why it fits. </span>
                {planned.reason}
              </p>
            </div>
          )}
          {planned?.review && (
            <figure className="surface-sunken flex gap-3 p-4">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
              <div>
                <blockquote className="text-sm leading-relaxed">{planned.review.snippet}</blockquote>
                <figcaption className="meta mt-1.5 flex items-center gap-1.5">
                  <Star className="h-3 w-3 fill-highlight text-highlight" strokeWidth={0} />
                  {planned.review.rating.toFixed(1)} · {planned.review.reviewCount} reviews · {planned.review.authorName}
                </figcaption>
              </div>
            </figure>
          )}
        </div>

        {/* Days */}
        <div className="pt-8">
          <SectionHeader
            eyebrow={`${itinerary.days.length} ${itinerary.days.length === 1 ? "day" : "days"} · ${totalStops} stops`}
            title="Day by day"
            className="mb-2"
            action={
              planned ? (
                editing ? (
                  <Button size="sm" onClick={finishEditing}>
                    <Check />
                    Done
                  </Button>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => setEditing(true)}>
                    <Pencil />
                    Edit
                  </Button>
                )
              ) : undefined
            }
          />
          {editing && planned ? (
            <TripEditor trip={planned} onChange={setPlanned} />
          ) : (
            itinerary.days.map((day, index) => <DaySection key={day.dayNumber} day={day} isExpanded={index === 0} />)
          )}
        </div>

        {/* Planner extras */}
        {planned && !editing && (
          <div className="space-y-8 pt-8">
            {planned.keyActivities.length > 0 && (
              <section className="space-y-3">
                <p className="eyebrow">Must-dos</p>
                <div className="flex flex-wrap gap-2">
                  {planned.keyActivities.map((a) => (
                    <Badge key={a} variant="secondary" className="h-8 px-3 text-[13px]">
                      {a}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
            {planned.housing.length > 0 && (
              <section className="space-y-3">
                <p className="eyebrow">Where to stay</p>
                <ul className="surface divide-y divide-border p-0">
                  {planned.housing.map((h) => (
                    <li key={h} className="flex items-center gap-3 px-4 py-3 text-sm">
                      <BedDouble className="h-4 w-4 shrink-0 text-primary" />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {planned.budget && (
              <section className="surface-ink flex items-center justify-between gap-4 p-5">
                <span className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-ink-muted">
                  <Wallet className="h-4 w-4" /> Budget estimate
                </span>
                <span className="text-title text-right text-lg">{planned.budget}</span>
              </section>
            )}
            {!saved && (
              <Button size="lg" className="w-full" onClick={toggleSave}>
                <Bookmark />
                Save this trip
              </Button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ItineraryDetailPage;
