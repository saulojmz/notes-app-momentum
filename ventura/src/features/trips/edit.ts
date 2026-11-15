import type { PlannedTrip } from "@/features/planner/types";
import type { Itinerary, ItineraryStop } from "@/types/itinerary";

/** Pure trip edits shared by the phone's Today view and the desktop editor. */

export const patchStop = (t: PlannedTrip, dayIndex: number, stopId: string, patch: Partial<ItineraryStop>): PlannedTrip => ({
  ...t,
  days: t.days.map((d, i) => (i === dayIndex ? { ...d, stops: d.stops.map((s) => (s.id === stopId ? { ...s, ...patch } : s)) } : d)),
});

export const removeStop = (t: PlannedTrip, dayIndex: number, stopId: string): PlannedTrip => ({
  ...t,
  days: t.days.map((d, i) => (i === dayIndex ? { ...d, stops: d.stops.filter((s) => s.id !== stopId) } : d)),
});

/** Move a stop within a day or to another day, at `toIndex` (end when omitted). */
export const moveStop = (t: PlannedTrip, fromDay: number, stopId: string, toDay: number, toIndex?: number): PlannedTrip => {
  const moving = t.days[fromDay]?.stops.find((s) => s.id === stopId);
  if (!moving) return t;
  const days = t.days.map((d) => ({ ...d, stops: d.stops.filter((s) => s.id !== stopId) }));
  const target = days[toDay];
  if (!target) return t;
  const at = toIndex === undefined ? target.stops.length : Math.max(0, Math.min(toIndex, target.stops.length));
  target.stops = [...target.stops.slice(0, at), moving, ...target.stops.slice(at)];
  return { ...t, days };
};

/** Swap a stop with its neighbour (the phone's up/down reorder). */
export const nudgeStop = (t: PlannedTrip, dayIndex: number, stopId: string, dir: -1 | 1): PlannedTrip => {
  const stops = [...t.days[dayIndex].stops];
  const i = stops.findIndex((s) => s.id === stopId);
  const j = i + dir;
  if (i < 0 || j < 0 || j >= stops.length) return t;
  // Keep the time slots in place; the stops trade places.
  const [a, b] = [stops[i], stops[j]];
  stops[i] = { ...b, time: a.time };
  stops[j] = { ...a, time: b.time };
  return { ...t, days: t.days.map((d, k) => (k === dayIndex ? { ...d, stops } : d)) };
};

export const sortByTime = (stops: ItineraryStop[]) => [...stops].sort((a, b) => a.time.localeCompare(b.time));

export const newId = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

/** Copy a catalog itinerary into the traveler's own, editable trips. */
export const copyItinerary = (it: Itinerary, place: { name: string; country: string }): PlannedTrip => ({
  ...it,
  id: newId("trip"),
  planned: true,
  source: "custom",
  destinationName: place.name,
  country: place.country,
  summary: it.description,
  housing: [],
  keyActivities: it.days.flatMap((d) => d.stops.map((s) => s.name)).slice(0, 3),
  author: { name: "Alex Turner", avatar: "" },
  createdAt: Date.now(),
  currency: "£",
  stays: [],
  transport: [],
});
