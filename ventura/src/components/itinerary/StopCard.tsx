import { MapPin, Clock, Lightbulb, UtensilsCrossed, Building2, TreePine, ShoppingBag, Landmark, Moon, ArrowUpRight } from "lucide-react";
import { ItineraryStop } from "@/types/itinerary";
import { Badge } from "@/components/ui/badge";
import { MetaItem } from "@/components/kit";

interface StopCardProps {
  stop: ItineraryStop;
  isLast: boolean;
}

const categoryIcons = {
  Food: UtensilsCrossed,
  Culture: Building2,
  Nature: TreePine,
  Shopping: ShoppingBag,
  History: Landmark,
  Nightlife: Moon,
};

/** One stop on the day timeline: time rail on the left, details on the right. */
export const StopCard = ({ stop, isLast }: StopCardProps) => {
  const Icon = categoryIcons[stop.category as keyof typeof categoryIcons] || MapPin;
  const query = stop.mapQuery ?? `${stop.coordinates.lat},${stop.coordinates.lng}`;
  const mapsUrl = `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

  return (
    <li className="grid grid-cols-[56px_1fr] gap-3">
      {/* Rail */}
      <div className="flex flex-col items-center">
        <span className="font-mono text-[13px] font-medium tabular">{stop.time}</span>
        <span className="mt-2 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Icon className="h-4 w-4" strokeWidth={1.75} />
        </span>
        {!isLast && <span className="my-2 w-px flex-1 bg-border" />}
      </div>

      {/* Card */}
      <div className={isLast ? "pb-0" : "pb-5"}>
        <div className="surface space-y-3 p-4">
          <div className="flex items-start justify-between gap-3">
            <h4 className="text-[16px] font-semibold leading-snug">{stop.name}</h4>
            <Badge variant="soft" className="shrink-0">
              {stop.category}
            </Badge>
          </div>
          <MetaItem icon={Clock}>{stop.duration}</MetaItem>
          <p className="text-sm leading-relaxed text-muted-foreground">{stop.description}</p>

          {stop.tips && (
            <div className="flex gap-2.5 rounded-xl bg-highlight/10 p-3">
              <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-warning" strokeWidth={1.75} />
              <p className="text-[13px] leading-relaxed text-foreground/80">{stop.tips}</p>
            </div>
          )}

          <a
            href={mapsUrl}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1 text-[13px] font-medium text-primary hover:underline"
          >
            See on map
            <ArrowUpRight className="h-3.5 w-3.5" />
          </a>
        </div>
      </div>
    </li>
  );
};
