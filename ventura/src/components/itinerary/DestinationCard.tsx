import { Badge } from "@/components/ui/badge";
import { Destination } from "@/types/itinerary";
import { useNavigate } from "react-router-dom";
import { SmartImage } from "@/components/kit";
import { cn } from "@/lib/utils";

interface DestinationCardProps {
  destination: Destination;
  className?: string;
}

/** Portrait cover card for a city. */
export const DestinationCard = ({ destination, className }: DestinationCardProps) => {
  const navigate = useNavigate();

  return (
    <button
      type="button"
      onClick={() => navigate(`/destinations/${destination.id}`)}
      className={cn(
        "press group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondary text-left",
        className,
      )}
    >
      <SmartImage
        src={destination.imageUrl}
        alt={destination.name}
        className="absolute inset-0 h-full w-full object-cover"
      />
      <div className="scrim-b absolute inset-0" />
      <Badge variant="glass" className="absolute left-3 top-3">
        {destination.region}
      </Badge>
      <div className="absolute inset-x-0 bottom-0 p-4 text-on-image">
        <p className="text-[13px] text-on-image/75">{destination.country}</p>
        <h3 className="text-display mt-1 text-[34px]">{destination.name}</h3>
        <p className="mt-2 line-clamp-2 text-[13px] leading-snug text-on-image/80">{destination.description}</p>
      </div>
    </button>
  );
};
