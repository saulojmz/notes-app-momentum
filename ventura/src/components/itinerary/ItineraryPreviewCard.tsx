import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Clock, MapPin } from "lucide-react";
import { Itinerary } from "@/types/itinerary";
import { useNavigate } from "react-router-dom";
import { MetaDot, MetaItem, Rating, SmartImage } from "@/components/kit";
import { cn } from "@/lib/utils";

interface ItineraryPreviewCardProps {
  itinerary: Itinerary;
  className?: string;
}

/** Editorial image + caption card for an itinerary. */
export const ItineraryPreviewCard = ({ itinerary, className }: ItineraryPreviewCardProps) => {
  const navigate = useNavigate();
  const totalStops = itinerary.days.reduce((sum, day) => sum + day.stops.length, 0);

  return (
    <button
      type="button"
      onClick={() => navigate(`/itinerary/${itinerary.id}`)}
      className={cn("press group block w-full text-left", className)}
    >
      <div className="relative aspect-[4/3] overflow-hidden rounded-2xl bg-secondary">
        <SmartImage
          src={itinerary.imageUrl}
          alt={itinerary.title}
          className="h-full w-full object-cover"
        />
        <Badge variant="glass" className="absolute left-3 top-3">
          {itinerary.category}
        </Badge>
      </div>

      <div className="space-y-2 pt-3">
        <h3 className="text-title line-clamp-2 text-[19px] transition-colors group-hover:text-primary">
          {itinerary.title}
        </h3>
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <MetaItem icon={Clock}>
            {itinerary.duration} {itinerary.duration === 1 ? "day" : "days"}
          </MetaItem>
          <MetaDot />
          <MetaItem icon={MapPin}>{totalStops} stops</MetaItem>
          <MetaDot />
          <Rating value={itinerary.rating} />
        </div>
        <div className="flex items-center gap-2 pt-0.5">
          <Avatar className="h-5 w-5">
            <AvatarImage src={itinerary.author.avatar} alt={itinerary.author.name} />
            <AvatarFallback className="bg-secondary text-[10px]">{itinerary.author.name[0]}</AvatarFallback>
          </Avatar>
          <span className="text-[13px] text-muted-foreground">{itinerary.author.name}</span>
        </div>
      </div>
    </button>
  );
};
