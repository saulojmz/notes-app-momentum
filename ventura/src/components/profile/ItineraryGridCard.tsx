import { Itinerary } from "@/types/itinerary";
import { useNavigate } from "react-router-dom";
import { destinations } from "@/data/mockItineraries";
import { Bookmark } from "lucide-react";
import { Rating, SmartImage } from "@/components/kit";

interface ItineraryGridCardProps {
  itinerary: Itinerary;
}

/** Stable pseudo save-count so numbers don't change between renders. */
const saveCountFor = (id: string) => {
  let h = 0;
  for (const c of id) h = (h * 31 + c.charCodeAt(0)) >>> 0;
  const n = (h % 2500) + 500;
  return n > 999 ? `${(n / 1000).toFixed(1)}K` : String(n);
};

export const ItineraryGridCard = ({ itinerary }: ItineraryGridCardProps) => {
  const navigate = useNavigate();
  const destination = destinations.find((d) => d.id === itinerary.destinationId);

  return (
    <button
      type="button"
      onClick={() => navigate(`/itinerary/${itinerary.id}`)}
      className="press group relative block aspect-[3/4] w-full overflow-hidden rounded-2xl bg-secondary text-left"
    >
      <SmartImage
        src={itinerary.imageUrl}
        alt={destination?.name || itinerary.title}
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <div className="scrim-b absolute inset-0" />
      <div className="absolute inset-x-0 bottom-0 space-y-1.5 p-3.5 text-on-image">
        <h3 className="text-display text-[26px]">{destination?.name}</h3>
        <p className="line-clamp-1 text-xs text-on-image/75">{itinerary.title}</p>
        <div className="flex items-center gap-3 pt-0.5">
          <span className="inline-flex items-center gap-1 font-mono text-xs">
            <Bookmark className="h-3.5 w-3.5" />
            {saveCountFor(itinerary.id)}
          </span>
          <Rating value={itinerary.rating} tone="on-image" />
        </div>
      </div>
    </button>
  );
};
