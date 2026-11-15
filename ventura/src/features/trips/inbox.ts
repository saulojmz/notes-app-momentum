import { useCallback, useEffect, useState } from "react";
import { storage } from "@/lib/storage";
import { findTrip, updateTrip } from "@/features/planner/trips";
import type { CategoryFilter, ItineraryStop } from "@/types/itinerary";

/**
 * Things saved on the phone (map markers, camera discoveries) waiting to be
 * sorted into a trip on desktop.
 */
export interface InboxItem {
  id: string;
  kind: "place" | "food" | "cafe" | "event" | "landmark";
  name: string;
  detail: string;
  city: string;
  category: CategoryFilter;
  source: "Map" | "Camera";
  savedAt: number;
  image?: string;
  coordinates?: { lat: number; lng: number };
  cost?: number;
}

const KEY = "ventura_inbox";
const CHANGE = "ventura:inbox-changed";

const read = () => storage.get<InboxItem[]>(KEY, []);
const write = (items: InboxItem[]) => {
  storage.set(KEY, items);
  window.dispatchEvent(new Event(CHANGE));
};

export const addToInbox = (item: Omit<InboxItem, "id" | "savedAt"> & { id?: string }) => {
  const id = item.id ?? `inbox-${Date.now().toString(36)}`;
  const items = read();
  if (items.some((i) => i.id === id || i.name === item.name)) return false;
  write([{ ...item, id, savedAt: Date.now() }, ...items]);
  return true;
};

export const removeFromInbox = (id: string) => write(read().filter((i) => i.id !== id));

export const seedInbox = (items: InboxItem[]) => storage.set(KEY, items);

/** Turn an inbox item into a stop on a trip day, then clear it from the inbox. */
export const fileInboxItem = (itemId: string, tripId: string, dayIndex: number) => {
  const item = read().find((i) => i.id === itemId);
  const trip = findTrip(tripId);
  if (!item || !trip || !trip.days[dayIndex]) return;
  const day = trip.days[dayIndex];
  const last = day.stops[day.stops.length - 1];
  const nextHour = last ? Math.min(22, parseInt(last.time, 10) + 2) : 10;
  const stop: ItineraryStop = {
    id: `stop-${Date.now().toString(36)}`,
    name: item.name,
    time: `${String(nextHour).padStart(2, "0")}:00`,
    duration: "1–2 hours",
    description: item.detail,
    category: item.category === "All" ? "Culture" : item.category,
    coordinates: item.coordinates ?? last?.coordinates ?? { lat: 0, lng: 0 },
    mapQuery: `${item.name}, ${item.city}`,
    cost: item.cost,
  };
  updateTrip({ ...trip, days: trip.days.map((d, i) => (i === dayIndex ? { ...d, stops: [...d.stops, stop] } : d)) });
  removeFromInbox(itemId);
};

export const useInbox = () => {
  const [items, setItems] = useState<InboxItem[]>(read);
  useEffect(() => {
    const sync = () => setItems(read());
    window.addEventListener(CHANGE, sync);
    window.addEventListener("storage", sync);
    return () => {
      window.removeEventListener(CHANGE, sync);
      window.removeEventListener("storage", sync);
    };
  }, []);
  const has = useCallback((name: string) => items.some((i) => i.name === name), [items]);
  return { items, has, add: addToInbox, remove: removeFromInbox, file: fileInboxItem };
};
