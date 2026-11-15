import { useParams, useNavigate } from "react-router-dom";
import { ArrowUpRight, MapPinned } from "lucide-react";
import { itineraries, destinations } from "@/data/mockItineraries";
import { SmartImage, TopBar } from "@/components/kit";
import { findTrip } from "@/features/planner/trips";

const ItineraryMapView = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const planned = itineraries.some((i) => i.id === id) ? undefined : findTrip(id);
  const itinerary = itineraries.find((i) => i.id === id) ?? planned;
  const mockDestination = itinerary ? destinations.find((d) => d.id === itinerary.destinationId) : null;
  const destination = planned
    ? { name: planned.destinationName, country: planned.country, imageUrl: planned.imageUrl }
    : mockDestination;

  if (!itinerary || !destination) return null;

  const allStops = itinerary.days.flatMap((day) => day.stops);
  let n = 0;

  return (
    <div className="min-h-screen pb-16">
      <TopBar
        sticky
        onBack={() => navigate(-1)}
        title={
          <span className="block">
            <span className="block truncate">{itinerary.title}</span>
            <span className="block text-xs font-normal text-muted-foreground">
              {destination.name}, {destination.country}
            </span>
          </span>
        }
      />

      <div className="mx-auto max-w-2xl space-y-8 px-5 pt-2">
        {/* Map placeholder */}
        <div className="relative h-64 overflow-hidden rounded-2xl bg-secondary">
          <SmartImage
            src={destination.imageUrl}
            alt={destination.name}
            className="absolute inset-0 h-full w-full object-cover opacity-40 blur-[2px] grayscale"
          />
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center">
            <span className="flex h-12 w-12 items-center justify-center rounded-xl bg-card text-primary shadow-float">
              <MapPinned className="h-6 w-6" strokeWidth={1.5} />
            </span>
            <p className="text-title mt-4 text-xl">Interactive map coming soon</p>
            <p className="mt-1 text-sm text-muted-foreground">
              All {allStops.length} stops in {destination.name}, plotted in order.
            </p>
          </div>
        </div>

        {/* Stops by day */}
        {itinerary.days.map((day) => (
          <section key={day.dayNumber} className="space-y-3">
            <div>
              <p className="eyebrow">Day {day.dayNumber}</p>
              <h2 className="text-title mt-1 text-xl">{day.title}</h2>
            </div>
            <ol className="surface divide-y divide-border overflow-hidden p-0">
              {day.stops.map((stop) => {
                n += 1;
                return (
                  <li key={stop.id}>
                    <a
                      href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(stop.mapQuery ?? `${stop.coordinates.lat},${stop.coordinates.lng}`)}`}
                      target="_blank"
                      rel="noreferrer"
                      className="flex items-center gap-3 p-4 transition-colors hover:bg-accent/50"
                    >
                      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-ink tabular-nums text-xs font-medium text-ink-foreground">
                        {n}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="block truncate font-medium">{stop.name}</span>
                        <span className="meta block">
                          {stop.time} · {stop.duration}
                        </span>
                      </span>
                      <ArrowUpRight className="h-4 w-4 shrink-0 text-muted-foreground" />
                    </a>
                  </li>
                );
              })}
            </ol>
          </section>
        ))}
      </div>
    </div>
  );
};

export default ItineraryMapView;
