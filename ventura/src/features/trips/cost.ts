import type { PlannedTrip } from "@/features/planner/types";

/** Per-person trip costs, from what the trip editor knows. Skipped stops don't count. */
export const tripCosts = (t: PlannedTrip) => {
  const activities = t.days.reduce((sum, d) => sum + d.stops.reduce((s, stop) => s + (stop.skipped ? 0 : stop.cost ?? 0), 0), 0);
  const stays = (t.stays ?? []).reduce((sum, s) => sum + s.nights * s.pricePerNight, 0);
  const transport = (t.transport ?? []).reduce((sum, l) => sum + l.price, 0);
  return { activities, stays, transport, total: activities + stays + transport };
};

export const money = (amount: number, currency = "£") =>
  amount === 0 ? "Free" : `${currency}${Math.round(amount).toLocaleString("en-GB")}`;

/** Same as money() but shows 0 as an amount, for totals. */
export const total = (amount: number, currency = "£") => `${currency}${Math.round(amount).toLocaleString("en-GB")}`;

/** The currency a trip's costs are shown in: its own, else the one its budget was given in. */
export const currencyFor = (t: PlannedTrip) => t.currency ?? (t.budget?.includes("$") ? "$" : t.budget?.includes("€") ? "€" : "£");
