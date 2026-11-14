import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Clock, MapPin, Share, Map as MapIcon, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { itineraries, destinations } from "@/data/mockItineraries";
import { DaySection } from "@/components/itinerary/DaySection";
import { EmptyState, MetaDot, MetaItem, Rating, SectionHeader, SmartImage } from "@/components/kit";
import { toast } from "sonner";

const AUTHOR_AVATAR = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face";

const ItineraryDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const itinerary = itineraries.find((i) => i.id === id);
  const destination = itinerary ? destinations.find((d) => d.id === itinerary.destinationId) : null;

  if (!itinerary || !destination) {
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

  const handleShare = () => {
    navigator.clipboard?.writeText(window.location.href);
    toast.success("Link copied to clipboard");
  };

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative h-[58vh] min-h-[420px] w-full overflow-hidden bg-secondary">
        <SmartImage src={itinerary.imageUrl} alt={itinerary.title} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-t absolute inset-x-0 top-0 h-32" />
        <div className="scrim-b absolute inset-0" />

        <div className="top-safe absolute inset-x-0 flex items-center justify-between px-4">
          <Button variant="glass-dark" size="icon" onClick={() => navigate("/profile")} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
          <div className="flex gap-2">
            <Button
              variant="glass-dark"
              size="icon"
              onClick={() => navigate(`/itinerary/${itinerary.id}/map`)}
              aria-label="View on map"
            >
              <MapIcon className="!size-5" />
            </Button>
            <Button variant="glass-dark" size="icon" onClick={handleShare} aria-label="Share">
              <Share className="!size-5" />
            </Button>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl p-5 pb-7 text-on-image">
          <Badge variant="glass">{itinerary.category}</Badge>
          <h1 className="text-display mt-3 text-[38px]">{itinerary.title}</h1>
          <p className="mt-2 font-mono text-xs uppercase tracking-[0.14em] text-on-image/75">
            {destination.name}, {destination.country}
          </p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-5">
        <div className="space-y-5 border-b border-border py-6">
          <p className="text-[17px] leading-relaxed text-foreground/80">{itinerary.description}</p>

          {/* Author */}
          <div className="flex items-center gap-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src={AUTHOR_AVATAR} alt={itinerary.author.name} />
              <AvatarFallback>{itinerary.author.name[0]}</AvatarFallback>
            </Avatar>
            <div>
              <p className="text-sm font-semibold">{itinerary.author.name}</p>
              <p className="text-xs text-muted-foreground">Local author</p>
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

          <div className="flex flex-wrap gap-2">
            {itinerary.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="h-7 px-3">
                {tag}
              </Badge>
            ))}
          </div>
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
        </div>
      </div>
    </div>
  );
};

export default ItineraryDetailPage;
