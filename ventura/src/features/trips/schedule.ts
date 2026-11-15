import { addDays, differenceInCalendarDays, format, parseISO } from "date-fns";
import { useSavedTrips } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";

/** Trip dates. A trip with a start date runs for `days.length` calendar days. */

export const isoDay = (d: Date) => format(d, "yyyy-MM-dd");

export const tripStart = (t: PlannedTrip): Date | undefined => (t.startDate ? parseISO(t.startDate) : undefined);

export const dateOfDay = (t: PlannedTrip, index: number): Date | undefined => {
  const start = tripStart(t);
  return start ? addDays(start, index) : undefined;
};

/** Index of the trip day that falls on `date`, or -1. */
export const dayIndexOn = (t: PlannedTrip, date = new Date()): number => {
  const start = tripStart(t);
  if (!start) return -1;
  const i = differenceInCalendarDays(date, start);
  return i >= 0 && i < t.days.length ? i : -1;
};

export type TripStatus = "now" | "upcoming" | "past" | "unscheduled";

export const tripStatus = (t: PlannedTrip, date = new Date()): TripStatus => {
  const start = tripStart(t);
  if (!start) return "unscheduled";
  if (dayIndexOn(t, date) >= 0) return "now";
  return differenceInCalendarDays(start, date) > 0 ? "upcoming" : "past";
};

export const daysUntil = (t: PlannedTrip, date = new Date()) => {
  const start = tripStart(t);
  return start ? differenceInCalendarDays(start, date) : undefined;
};

/** "14–16 Nov", "30 Mar – 1 Apr" or "28 Dec 2026 – 2 Jan 2027". */
export const formatRange = (t: PlannedTrip): string | undefined => {
  const start = tripStart(t);
  if (!start) return undefined;
  const end = addDays(start, Math.max(1, t.days.length) - 1);
  if (start.getFullYear() !== end.getFullYear()) return `${format(start, "d MMM yyyy")} – ${format(end, "d MMM yyyy")}`;
  if (start.getMonth() !== end.getMonth()) return `${format(start, "d MMM")} – ${format(end, "d MMM")}`;
  return start.getDate() === end.getDate() ? format(start, "d MMM") : `${format(start, "d")}–${format(end, "d MMM")}`;
};

/** The saved trip happening today (and which day of it), plus what's coming up. */
export const useTripSchedule = () => {
  const { saved } = useSavedTrips();
  const now = new Date();
  const current = saved.find((t) => dayIndexOn(t, now) >= 0);
  const upcoming = saved
    .filter((t) => tripStatus(t, now) === "upcoming")
    .sort((a, b) => (a.startDate ?? "").localeCompare(b.startDate ?? ""));
  return {
    saved,
    today: current ? { trip: current, dayIndex: dayIndexOn(current, now) } : null,
    upcoming,
  };
};
