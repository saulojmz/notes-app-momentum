import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Clock, Compass, Lightbulb, MapPin, Quote, Star, Target } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, SmartImage } from "@/components/kit";
import { destinations, itineraries } from "@/data/mockItineraries";
import { findTrip, readPlannerSession, saveTrip, useSavedTrips } from "@/features/planner/trips";
import { copyItinerary, currencyFor } from "@/features/trips";
import type { PlannedTrip } from "@/features/planner/types";
import { toast } from "sonner";
import { TripMap } from "@/components/map/TripMap";
import { Page } from "../Shell";

const SOURCE: Record<PlannedTrip["source"], string> = {
  ai: "Planned with AI",
  community: "Traveler favourite",
  guided: "Guided match",
  custom: "Your trip",
};

const ItineraryPreviewPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isSaved } = useSavedTrips();
  const [day, setDay] = useState<number | null>(0);
  const mock = itineraries.find((i) => i.id === id);
  const planned = mock ? undefined : findTrip(id);
  const it = mock ?? planned;
  const dest = mock ? destinations.find((d) => d.id === mock.destinationId) : undefined;
  const place = planned ? { name: planned.destinationName, country: planned.country } : dest ? { name: dest.name, country: dest.country } : null;

  if (!it || !place) {
    return (
      <EmptyState
        className="h-full justify-center"
        icon={Compass}
        title="Itinerary not found"
        description="It may have been removed by its author"
        action={<Button onClick={() => navigate("/explore")}>Back to explore</Button>}
      />
    );
  }

  const fromPlanner = planned && planned.source !== "custom";
  const session = readPlannerSession();
  const inSession = !!planned && !!session && [...session.aiTripIds, ...session.communityTripIds].includes(planned.id);
  const stops = it.days.reduce((n, d) => n + d.stops.length, 0);
  const saved = planned ? isSaved(planned.id) : false;

  const save = () => {
    if (planned) {
      if (!saved) saveTrip({ ...planned, currency: currencyFor(planned), stays: planned.stays ?? [], transport: planned.transport ?? [] });
      toast.success("Saved to your trips", { description: "Add dates, stays and transport" });
      return navigate(`/trips/${planned.id}`);
    }
    const copy = copyItinerary(it, place);
    saveTrip(copy);
    toast.success("Copied to your trips", { description: "It's yours to edit now" });
    navigate(`/trips/${copy.id}`);
  };

  return (
    <Page wide className="pt-8">
      <nav className="mb-4 flex items-center gap-1.5 text-[13px] text-muted-foreground" aria-label="Breadcrumb">
        <Link to={fromPlanner ? "/plan" : "/explore"} className="hover:text-foreground">
          {fromPlanner ? "Plan" : "Explore"}
        </Link>
        {dest && (
          <>
            <ChevronRight className="h-3.5 w-3.5" />
            <Link to={`/explore/destination/${dest.id}`} className="hover:text-foreground">
              {dest.name}
            </Link>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="truncate text-foreground">{it.title}</span>
      </nav>

      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-secondary">
        <SmartImage src={it.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-b absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-on-image">
          {planned && (
            <Badge variant="glass" className="tabular-nums">
              {planned.source === "guided" ? `${planned.match}% match` : SOURCE[planned.source]}
            </Badge>
          )}
          <h1 className="text-display mt-3 max-w-[22ch] text-[44px] leading-[1.05]">{it.title}</h1>
          <p className="mt-2 text-sm text-on-image/80">
            {place.name}, {place.country}
          </p>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_400px] gap-12">
        <div className="space-y-10">
          <div className="space-y-5">
            <p className="max-w-[60ch] text-[17px] leading-relaxed text-foreground/85">{it.description}</p>
            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-sm">
              <span className="flex items-center gap-1.5">
                <Clock className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                {it.days.length} days
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="h-4 w-4 text-muted-foreground" strokeWidth={1.5} />
                {stops} stops
              </span>
              <span className="flex items-center gap-1.5 tabular-nums">
                <Star className="h-4 w-4 fill-highlight text-highlight" strokeWidth={0} />
                {it.rating.toFixed(1)}
              </span>
              <span className="text-muted-foreground">by {it.author.name}</span>
            </div>
            {planned?.reason && (
              <p className="surface-sunken flex max-w-[64ch] gap-3 p-4 text-sm leading-relaxed">
                <Target className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <span>
                  <span className="font-medium">Why it fits. </span>
                  {planned.reason}
                </span>
              </p>
            )}
            {planned?.review && (
              <figure className="surface-sunken flex max-w-[64ch] gap-3 p-4">
                <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                <div>
                  <blockquote className="text-sm leading-relaxed">{planned.review.snippet}</blockquote>
                  <figcaption className="meta mt-1.5 tabular-nums">
                    {planned.review.rating.toFixed(1)} · {planned.review.reviewCount} reviews · {planned.review.authorName}
                  </figcaption>
                </div>
              </figure>
            )}
          </div>

          <section className="space-y-8">
            <h2 className="text-title text-2xl">Day by day</h2>
            {it.days.map((d, di) => (
              <div key={d.dayNumber} className="space-y-3" onMouseEnter={() => setDay(di)}>
                <p className="eyebrow">Day {d.dayNumber}</p>
                <h3 className="text-title -mt-1.5 text-lg">{d.title}</h3>
                <ol className="divide-y divide-border rounded-2xl border border-border bg-card">
                  {d.stops.map((s) => (
                    <li key={s.id} className="grid grid-cols-[56px_1fr] gap-3 px-4 py-3.5">
                      <span className="pt-0.5 text-[13px] tabular-nums text-muted-foreground">{s.time}</span>
                      <div className="min-w-0">
                        <p className="font-medium">{s.name}</p>
                        <p className="meta mt-0.5">
                          {s.category} · {s.duration}
                        </p>
                        <p className="mt-1.5 text-sm leading-relaxed text-foreground/80">{s.description}</p>
                        {s.tips && (
                          <p className="mt-2 flex gap-2 text-[13px] text-muted-foreground">
                            <Lightbulb className="mt-0.5 h-3.5 w-3.5 shrink-0" strokeWidth={1.5} />
                            {s.tips}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ol>
              </div>
            ))}
          </section>
        </div>

        <aside className="space-y-4 self-start">
          <div className="sticky top-6 space-y-4">
            <TripMap days={it.days} selectedDay={day} onSelectDay={setDay} className="h-[340px]" labels={false} />
            <section className="surface space-y-4 p-5">
              <dl className="grid grid-cols-3 gap-3">
                {[
                  { k: "Days", v: it.days.length },
                  { k: "Stops", v: stops },
                  { k: "Rating", v: it.rating.toFixed(1) },
                ].map(({ k, v }) => (
                  <div key={k}>
                    <dd className="text-title text-xl tabular-nums">{v}</dd>
                    <dt className="meta">{k}</dt>
                  </div>
                ))}
              </dl>
              {planned?.budget && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Budget </span>
                  {planned.budget}
                </p>
              )}
              {planned && planned.housing.length > 0 && (
                <p className="text-sm">
                  <span className="text-muted-foreground">Stays </span>
                  {planned.housing.slice(0, 2).join(", ")}
                </p>
              )}
              <Button className="w-full" onClick={save}>
                {saved ? "Open in the trip editor" : mock ? "Copy to my trips" : "Save to my trips"}
              </Button>
              {inSession && (
                <Button variant="outline" className="w-full" onClick={() => navigate("/plan/options")}>
                  Compare with the other options
                </Button>
              )}
            </section>
          </div>
        </aside>
      </div>
    </Page>
  );
};

export default ItineraryPreviewPage;
