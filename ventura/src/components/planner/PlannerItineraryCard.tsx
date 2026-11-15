import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Bookmark, BookmarkCheck, ChevronDown, Quote, Star, Wallet } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MetaDot, MetaItem, SmartImage } from "@/components/kit";
import type { PlannedTrip } from "@/features/planner/types";
import { useSavedTrips } from "@/features/planner/trips";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Clock } from "lucide-react";

/** An AI or community itinerary on the options screen: image header, expandable details. */
export const PlannerItineraryCard = ({ trip }: { trip: PlannedTrip }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const { isSaved, save, unsave } = useSavedTrips();
  const saved = isSaved(trip.id);
  const community = trip.source === "community";

  const toggleSave = () => {
    if (saved) {
      unsave(trip.id);
      toast("Removed from saved trips");
    } else {
      save(trip);
      toast.success("Saved to your profile");
    }
  };

  return (
    <article className="surface overflow-hidden p-0 animate-fade-in">
      <div className="relative aspect-[16/10] bg-secondary">
        <SmartImage src={trip.imageUrl} alt={`${trip.destinationName}, ${trip.country}`} className="h-full w-full object-cover" />
        <div className="scrim-b absolute inset-0" />
        <div className="absolute left-3 top-3 flex gap-1.5">
          {community ? (
            <Badge variant="glass">
              <Star className="fill-highlight text-highlight" />
              {trip.review?.rating.toFixed(1)} · {trip.review?.reviewCount} reviews
            </Badge>
          ) : (
            <Badge variant="glass">Planned with AI</Badge>
          )}
        </div>
        <Button
          variant="glass-dark"
          size="icon-sm"
          onClick={toggleSave}
          aria-label={saved ? "Remove from saved" : "Save trip"}
          className="absolute right-3 top-3"
        >
          {saved ? <BookmarkCheck className="text-highlight" /> : <Bookmark />}
        </Button>
        <div className="absolute inset-x-0 bottom-0 p-4 text-on-image">
          <p className="text-[13px] text-on-image/75">{trip.country}</p>
          <h3 className="text-display mt-1 text-[32px]">{trip.destinationName}</h3>
        </div>
      </div>

      <div className="space-y-3 p-4">
        <p className="text-[15px] leading-relaxed text-foreground/85">{trip.summary}</p>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <MetaItem icon={Clock}>
            {trip.duration} {trip.duration === 1 ? "day" : "days"}
          </MetaItem>
          {trip.budget && (
            <>
              <MetaDot />
              <MetaItem icon={Wallet}>{trip.budget}</MetaItem>
            </>
          )}
        </div>

        {community && trip.review && (
          <figure className="surface-sunken flex gap-3 p-3">
            <Quote className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <blockquote className="text-[13px] leading-relaxed">{trip.review.snippet}</blockquote>
              <figcaption className="meta mt-1">{trip.review.authorName}</figcaption>
            </div>
          </figure>
        )}

        {open && (
          <div className="space-y-5 border-t border-border pt-4 animate-fade-in">
            {trip.description && (
              <section className="space-y-1.5">
                <p className="eyebrow">About this trip</p>
                <p className="text-sm leading-relaxed text-muted-foreground">{trip.description}</p>
              </section>
            )}
            <section className="space-y-2">
              <p className="eyebrow">Day by day</p>
              <ol className="space-y-2">
                {trip.days.map((d) => (
                  <li key={d.dayNumber} className="surface-sunken p-3">
                    <p className="text-sm font-medium">
                      <span className="tabular-nums text-primary">{String(d.dayNumber).padStart(2, "0")}</span> {d.title}
                    </p>
                    <ul className="mt-1.5 space-y-1 text-[13px] text-muted-foreground">
                      {d.stops.map((s) => (
                        <li key={s.id} className="flex gap-2">
                          <span className="tabular-nums text-[11px] tabular-nums text-foreground/60">{s.time}</span>
                          {s.name}
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ol>
            </section>
            {trip.keyActivities.length > 0 && (
              <section className="space-y-2">
                <p className="eyebrow">Must-dos</p>
                <div className="flex flex-wrap gap-1.5">
                  {trip.keyActivities.map((a) => (
                    <Badge key={a} variant="outline" className="h-7 px-3">
                      {a}
                    </Badge>
                  ))}
                </div>
              </section>
            )}
            {trip.housing.length > 0 && (
              <section className="space-y-1.5">
                <p className="eyebrow">Where to stay</p>
                <ul className="space-y-1 text-sm text-muted-foreground">
                  {trip.housing.map((h) => (
                    <li key={h}>· {h}</li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        )}

        <div className="flex gap-2 pt-1">
          <Button variant="secondary" className="flex-1" onClick={() => setOpen(!open)} aria-expanded={open}>
            {open ? "Less" : "Details"}
            <ChevronDown className={cn("transition-transform", open && "rotate-180")} />
          </Button>
          <Button className="flex-1" onClick={() => navigate(`/itinerary/${trip.id}`)}>
            Open trip
            <ArrowRight />
          </Button>
        </div>
      </div>
    </article>
  );
};
