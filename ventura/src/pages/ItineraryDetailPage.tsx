import { useEffect, useState } from "react";
import { useLocation, useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft, Clock, MapPin, Share, Map as MapIcon, Compass, Bookmark, BookmarkCheck, Laptop,
  Quote, BedDouble, Wallet, Star, Target,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { itineraries, destinations } from "@/data/mockItineraries";
import { DaySection } from "@/components/itinerary/DaySection";
import { EmptyState, MetaDot, MetaItem, Rating, SectionHeader, SmartImage } from "@/components/kit";
import { findTrip, useSavedTrips } from "@/features/planner/trips";
import { copyItinerary, formatRange, tripCosts, total } from "@/features/trips";
import type { PlannedTrip } from "@/features/planner/types";
import type { Itinerary } from "@/types/itinerary";
import { photo } from "@/lib/photos";
import { toast } from "sonner";

const AUTHOR_AVATAR = photo("1507003211169-0a1dd7228f2d");

const SOURCE_LABEL: Record<PlannedTrip["source"], string> = {
  ai: "Planned with AI",
  community: "Traveler favourite",
  guided: "Guided match",
  custom: "Your trip",
};

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const mock = itineraries.find((i) => i.id === id);
  const { saved: savedTrips, isSaved, save, unsave } = useSavedTrips();
  const [planned, setPlanned] = useState<PlannedTrip | undefined>(() => (mock ? undefined : findTrip(id)));

  // Stay in step with edits made on the Today screen or on desktop.
  useEffect(() => {
    setPlanned(mock ? undefined : findTrip(id));
  }, [id, mock, savedTrips]);

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
        description="It may have been removed by its author"
        action={
          <Button className="w-full" onClick={() => navigate("/today")}>
            Back to today
          </Button>
        }
      />
    );
  }

  const totalStops = itinerary.days.reduce((sum, day) => sum + day.stops.length, 0);
  const saved = planned ? isSaved(planned.id) : false;

  const goBack = () => (location.key !== "default" ? navigate(-1) : navigate("/today"));

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href).catch(() => undefined);
    toast.success("Link copied to clipboard");
  };

  const toggleSave = () => {
    if (!planned) {
      const copy = copyItinerary(itinerary, place);
      save(copy);
      toast.success("Saved to your trips", { description: "Set dates and edit it on desktop" });
      return;
    }
    if (saved) {
      unsave(planned.id);
      toast("Removed from your trips");
    } else {
      save(planned);
      toast.success("Saved to your trips", { description: "Find it on your profile" });
    }
  };
  const costs = planned ? tripCosts(planned) : null;

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
            {planned?.source !== "custom" && (
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
              <Badge variant="glass" className="tabular-nums">
                {planned.source === "guided" ? `${planned.match}% match` : SOURCE_LABEL[planned.source]}
              </Badge>
            )}
            <Badge variant="glass">{planned?.vibeLabel ?? itinerary.category}</Badge>
          </div>
          <h1 className="text-display mt-3 text-[36px]">{itinerary.title}</h1>
          <p className="mt-2 text-[13px] text-on-image/75">
            {[place.name, place.country, planned && formatRange(planned)].filter(Boolean).join(" · ")}
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
              <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-[15px] font-medium text-ink-foreground">
                V
              </span>
            ) : (
              <Avatar className="h-10 w-10">
                {!planned && <AvatarImage src={AUTHOR_AVATAR} alt={itinerary.author.name} />}
                <AvatarFallback className="bg-secondary">{itinerary.author.name[0]}</AvatarFallback>
              </Avatar>
            )}
            <div>
              <p className="text-sm font-medium">{itinerary.author.name}</p>
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
              <Target className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
              <p className="text-sm leading-relaxed">
                <span className="font-medium">Why it fits. </span>
                {planned.reason}
              </p>
            </div>
          )}
          {planned?.review && (
            <figure className="surface-sunken flex gap-3 p-4">
              <Quote className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
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
          />
          {itinerary.days.map((day, index) => (
            <DaySection key={day.dayNumber} day={day} isExpanded={index === 0} />
          ))}
          {planned?.source === "custom" && (
            <p className="mt-6 flex items-start gap-2.5 rounded-xl bg-secondary px-4 py-3 text-[13px] text-muted-foreground">
              <Laptop className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.5} />
              Add days, stays and transport on Ventura for desktop. On the day, mark stops done, skip or reorder them from Today.
            </p>
          )}
        </div>

        {/* Planner extras */}
        {planned && (
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
                      <BedDouble className="h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
                      {h}
                    </li>
                  ))}
                </ul>
              </section>
            )}
            {(planned.budget || (costs && costs.total > 0)) && (
              <section className="surface flex items-center justify-between gap-4 p-5">
                <span className="flex items-center gap-2 text-[13px] text-muted-foreground">
                  <Wallet className="h-4 w-4" strokeWidth={1.5} /> {costs && costs.total > 0 ? "Cost per person" : "Budget estimate"}
                </span>
                <span className="text-title text-right text-lg tabular-nums">
                  {costs && costs.total > 0 ? total(costs.total, planned.currency) : planned.budget}
                </span>
              </section>
            )}
            {!saved && planned.source !== "custom" && (
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
