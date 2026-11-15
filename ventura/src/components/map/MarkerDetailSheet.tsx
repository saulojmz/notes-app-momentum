import { MapMarker } from "@/types/map";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { X, Bookmark, BookmarkCheck, Share, Users, MapPin } from "lucide-react";
import { useFilterItemImage } from "@/hooks/useFilterItemImages";
import { EntryTypePill } from "./EntryTypePill";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { BottomSheet, SmartImage } from "@/components/kit";
import { cn } from "@/lib/utils";
import { markerIcon, markerTint } from "./markerStyle";
import { useInbox } from "@/features/trips";

// The static map covers roughly 2.6 × 3.5 km of central Edinburgh; you are at its centre.
const MAP_W = 2600;
const MAP_H = 3460;
const pct = (v: string) => parseFloat(v) / 100 - 0.5;
const offsetM = (m: MapMarker) => ({ dx: pct(m.position.x) * MAP_W, dy: pct(m.position.y) * MAP_H });

/** Walking minutes from the centre of the map, with a detour factor for streets. */
export const walkFromHere = (m: MapMarker) => {
  const { dx, dy } = offsetM(m);
  return Math.max(2, Math.round((Math.hypot(dx, dy) * 1.3) / 80));
};

const toMinutes = (t: string) => {
  const match = t.trim().match(/^(\d{1,2})(?::(\d{2}))?\s*(AM|PM)$/i);
  if (!match) return undefined;
  let h = Number(match[1]) % 12;
  if (match[3].toUpperCase() === "PM") h += 12;
  return h * 60 + Number(match[2] ?? 0);
};

/** "Open now", "Closed now" or nothing, from hours like "8:00 AM - 6:00 PM". */
const openState = (hours?: string, now = new Date()) => {
  const [from, to] = (hours ?? "").split(/\s*[-–]\s*/);
  const a = from ? toMinutes(from) : undefined;
  const b = to ? toMinutes(to) : undefined;
  if (a === undefined || b === undefined) return undefined;
  const m = now.getHours() * 60 + now.getMinutes();
  const open = b > a ? m >= a && m < b : m >= a || m < b;
  return open ? "Open now" : "Closed now";
};

interface MarkerDetailSheetProps {
  marker: MapMarker | null;
  onClose: () => void;
}

const isPlaceholder = (src?: string) => !src || src.endsWith("placeholder.svg");

export const MarkerDetailSheet = ({ marker, onClose }: MarkerDetailSheetProps) => {
  const navigate = useNavigate();
  const inbox = useInbox();
  const { imageUrl, isLoading } = useFilterItemImage(marker?.name || "", marker?.category);

  if (!marker) return null;

  const Icon = markerIcon(marker.type, marker.category);
  const src = imageUrl || (isPlaceholder(marker.image) ? "" : marker.image);

  const open = marker.type === "events" ? undefined : openState(marker.time);
  const saved = inbox.has(marker.name);
  const details = [
    { label: "Walk", value: `${walkFromHere(marker)} min from you` },
    marker.date && { label: "When", value: marker.date },
    marker.time && { label: marker.type === "events" ? "Time" : "Hours", value: open ? `${open} · ${marker.time}` : marker.time },
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
            aria-label={saved ? "Saved" : "Save for later"}
            aria-pressed={saved}
            onClick={() => {
              if (saved) return toast("Already saved", { description: "Sort it into a trip on desktop" });
              const { dx, dy } = offsetM(marker);
              inbox.add({
                id: `inbox-${marker.id}`,
                kind: marker.type === "events" ? "event" : marker.type === "cafes" ? "cafe" : marker.type === "food" ? "food" : "place",
                name: marker.name,
                detail: [marker.category, marker.address].filter(Boolean).join(" · "),
                city: "Edinburgh",
                category: marker.type === "events" ? (marker.category === "Tours" ? "Nightlife" : "Culture") : "Food",
                source: "Map",
                coordinates: { lat: 55.9497 - dy / 111320, lng: -3.1883 + dx / 62250 },
                cost: marker.price && /\d/.test(marker.price) ? Number(marker.price.replace(/[^\d.]/g, "")) : undefined,
              });
              toast.success("Saved for later", { description: "Sort it into a trip on Ventura for desktop" });
            }}
          >
            {saved ? <BookmarkCheck className="!size-5 text-primary" /> : <Bookmark className="!size-5" />}
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
