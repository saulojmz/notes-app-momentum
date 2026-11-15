import { ArrowLeft, MapPin, Clock, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { MapMarker, FilterType } from "@/types/map";
import { EntryTypePill } from "./EntryTypePill";
import { useFilterItemImage } from "@/hooks/useFilterItemImages";

interface FilterContentModalProps {
  filterType: "events" | "food" | "cafes";
  items: MapMarker[];
  onClose: () => void;
}

const filterTitles: Record<"events" | "food" | "cafes", string> = {
  events: "Events",
  food: "Food",
  cafes: "Cafes",
};

const FilterItemCard = ({ item }: { item: MapMarker }) => {
  const { imageUrl, isLoading } = useFilterItemImage(item.name, item.category);

  return (
    <div className="px-5 py-4 border-b border-border/30 last:border-b-0">
      {/* Hero Image */}
      <div className="relative w-full h-48 rounded-xl overflow-hidden mb-4">
        {isLoading ? (
          <Skeleton className="w-full h-full" />
        ) : imageUrl ? (
          <img
            src={imageUrl}
            alt={item.name}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center">
            <span className="text-muted-foreground text-sm">No image</span>
          </div>
        )}
      </div>

      {/* Title */}
      <h3 className="text-lg font-medium text-foreground mb-2">{item.name}</h3>

      {/* Address */}
      <div className="flex items-center gap-2 text-muted-foreground text-sm mb-3">
        <MapPin className="h-4 w-4 flex-shrink-0" />
        <span>{item.address}</span>
      </div>

      {/* Entry Type Pill */}
      {item.entryType && (
        <div className="mb-3">
          <EntryTypePill entryType={item.entryType} />
        </div>
      )}

      {/* Description */}
      <p className="text-sm text-muted-foreground mb-4 leading-relaxed">
        {item.description}
      </p>

      {/* Metadata Row */}
      <div className="flex items-center gap-4 text-sm">
        {item.time && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>{item.time}</span>
          </div>
        )}
        {item.price && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <span className="font-medium">{item.price}</span>
          </div>
        )}
        {item.rating && (
          <div className="flex items-center gap-1.5 text-muted-foreground">
            <Star className="h-4 w-4 fill-highlight text-highlight" />
            <span>{item.rating}</span>
          </div>
        )}
        {item.date && (
          <div className="text-muted-foreground">
            <span>{item.date}</span>
          </div>
        )}
      </div>
    </div>
  );
};

export const FilterContentModal = ({
  filterType,
  items,
  onClose,
}: FilterContentModalProps) => {
  return (
    <div className="fixed inset-x-0 bottom-0 z-40 animate-slide-up">
      {/* Modal Container */}
      <div className="bg-background/95 backdrop-blur-xl rounded-t-3xl shadow-2xl border-t border-border/30 h-[85vh] flex flex-col">
        {/* Subtle top gradient */}
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-primary/5 to-transparent rounded-t-3xl pointer-events-none" />

        {/* Drag Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-10 h-1 bg-muted-foreground/30 rounded-full" />
        </div>

        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center gap-3 px-5 py-3 bg-background/95 backdrop-blur-xl border-b border-border/30">
          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            className="rounded-full h-9 w-9"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h2 className="text-xl font-medium text-foreground">
            {filterTitles[filterType]}
          </h2>
        </div>

        {/* Scrollable Content */}
        <div className="flex-1 overflow-y-auto">
          {items.length > 0 ? (
            items.map((item) => <FilterItemCard key={item.id} item={item} />)
          ) : (
            <div className="flex flex-col items-center justify-center h-64 text-muted-foreground">
              <p className="text-lg">No {filterType} found</p>
              <p className="text-sm">Try adjusting your filters</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
