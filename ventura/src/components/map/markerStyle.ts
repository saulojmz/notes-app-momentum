import {
  MapPin, CalendarDays, UtensilsCrossed, Coffee, Music, PartyPopper, Wine, Ghost, ShoppingBag, type LucideIcon,
} from "lucide-react";
import type { FilterType } from "@/types/map";

/** Background token per map layer. */
export const markerTone: Record<FilterType, string> = {
  events: "bg-cat-events",
  food: "bg-cat-food",
  cafes: "bg-cat-cafes",
  safety: "bg-success",
};

export const markerTint: Record<FilterType, string> = {
  events: "from-cat-events/25 to-cat-events/5 text-cat-events",
  food: "from-cat-food/25 to-cat-food/5 text-cat-food",
  cafes: "from-cat-cafes/25 to-cat-cafes/5 text-cat-cafes",
  safety: "from-success/25 to-success/5 text-success",
};

const eventIcons: Record<string, LucideIcon> = {
  "Arts & Culture": Music,
  Festival: PartyPopper,
  "Food & Drink": Wine,
  Tours: Ghost,
  Market: ShoppingBag,
};

export const markerIcon = (type: FilterType, category?: string): LucideIcon => {
  if (type === "events") return (category && eventIcons[category]) || CalendarDays;
  if (type === "food") return UtensilsCrossed;
  if (type === "cafes") return Coffee;
  return MapPin;
};
