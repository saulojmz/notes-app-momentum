import { MapMarker } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Bookmark, Share, Users, MapPin } from "lucide-react";
import { useFilterItemImage } from "@/hooks/useFilterItemImages";
import { EntryTypePill } from "./EntryTypePill";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BottomSheet, SmartImage } from "@/components/kit";
import { cn } from "@/lib/utils";
import { markerIcon, markerTint } from "./markerStyle";

interface MarkerDetailSheetProps {
  marker: MapMarker | null;
  onClose: () => void;
}

const isPlaceholder = (src?: string) => !src || src.endsWith("placeholder.svg");

export const MarkerDetailSheet = ({ marker, onClose }: MarkerDetailSheetProps) => {
  const navigate = useNavigate();
  const { imageUrl, isLoading } = useFilterItemImage(marker?.name || "", marker?.category);

  if (!marker) return null;

  const Icon = markerIcon(marker.type, marker.category);
  const src = imageUrl || (isPlaceholder(marker.image) ? "" : marker.image);

  const details = [
    marker.date && { label: "When", value: marker.date },
    marker.time && { label: "Hours", value: marker.time },
    marker.price && { label: "Price", value: marker.price },
    marker.rating && { label: "Rating", value: `${marker.rating.toFixed(1)} / 5` },
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <BottomSheet open={!!marker} onClose={onClose} label={marker.name}>
      <div className="pb-safe px-5">
        {/* Hero */}
        <div className="relative h-48 overflow-hidden rounded-2xl">
          {isLoading ? (
            <Skeleton className="h-full w-full rounded-none" />
          ) : (
            <SmartImage
              src={src}
              alt={marker.name}
              className="h-full w-full object-cover"
              fallbackClassName={cn("bg-gradient-to-br", markerTint[marker.type])}
              fallback={<Icon className="h-12 w-12 opacity-80" strokeWidth={1.25} />}
            />
          )}
          <Button
            variant="glass-dark"
            size="icon-sm"
            onClick={onClose}
            aria-label="Close"
            className="absolute right-3 top-3"
          >
            <X />
          </Button>
        </div>

        {/* Title */}
        <div className="mt-5 space-y-2">
          {marker.category && <p className="eyebrow">{marker.category}</p>}
          <h3 className="text-title text-[28px]">{marker.name}</h3>
          <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
            <MapPin className="h-4 w-4 shrink-0" strokeWidth={1.75} />
            {marker.address}
          </p>
        </div>

        {marker.entryType && (
          <div className="mt-4">
            <EntryTypePill entryType={marker.entryType} />
          </div>
        )}

        <p className="mt-4 text-[15px] leading-relaxed text-foreground/80">{marker.description}</p>

        {/* Details */}
        {details.length > 0 && (
          <dl className="mt-5 grid grid-cols-2 gap-px overflow-hidden rounded-2xl border border-border bg-border">
            {details.map(({ label, value }, i) => (
              <div
                key={label}
                className={cn("bg-card px-4 py-3", details.length % 2 === 1 && i === details.length - 1 && "col-span-2")}
              >
                <dt className="eyebrow">{label}</dt>
                <dd className="mt-1 text-sm font-medium tabular-nums">{value}</dd>
              </div>
            ))}
          </dl>
        )}

        {/* Actions */}
        <div className="mt-6 flex gap-2 pb-2">
          <Button
            variant="outline"
            size="icon"
            className="h-[52px] w-[52px]"
            aria-label="Save to itinerary"
            onClick={() => toast.success(`${marker.name} saved to your itinerary`)}
          >
            <Bookmark className="!size-5" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="h-[52px] w-[52px]"
            aria-label="Share"
            onClick={() => toast.success("Link copied to clipboard")}
          >
            <Share className="!size-5" />
          </Button>
          <Button size="lg" className="flex-1" onClick={() => navigate("/guides")}>
            <Users />
            Meet a local
          </Button>
        </div>
      </div>
    </BottomSheet>
  );
};
