import type { CategoryFilter, ItineraryDay, ItineraryStop } from "@/types/itinerary";
import { findCatalogDestination, imageForDestination, parseHighlight, type CatalogDestination } from "./catalog";
import type { ActivityKind, AIItinerary, PlannedTrip, TravelerAIItinerary } from "./types";

type Category = Exclude<CategoryFilter, "All">;

const KIND_CATEGORY: Record<ActivityKind, Category> = {
  food: "Food",
  culture: "Culture",
  history: "History",
  nature: "Nature",
  adventure: "Nature",
  water: "Nature",
  relax: "Nature",
  nightlife: "Nightlife",
  shopping: "Shopping",
};

const KIND_DURATION: Record<ActivityKind, string> = {
  food: "1.5 hours",
  culture: "2 hours",
  history: "2 hours",
  nature: "2–3 hours",
  adventure: "Half day",
  water: "Half day",
  relax: "2 hours",
  nightlife: "Evening",
  shopping: "1.5 hours",
};

const KIND_NOTE: Record<ActivityKind, string[]> = {
  food: ["Go hungry and share plates so you can try more.", "Eat where the queue is longest; it's usually worth the wait.", "Ask for the house special and trust the recommendation."],
  culture: ["Arrive early to beat the crowds and take it slowly.", "Give yourself time to linger; the details are the point.", "Look for the small side rooms most visitors skip."],
  history: ["Book a timed ticket ahead in high season.", "A local guide brings the stories to life here.", "Start at the top and work your way down."],
  nature: ["Bring layers; the weather turns quickly.", "Golden hour here is unforgettable.", "Pack water and snacks, and wear proper shoes."],
  adventure: ["Start early and check conditions the day before.", "Go with a local operator; they know the safest routes.", "Sturdy shoes and a light rain jacket are a must."],
  water: ["Sunscreen and a dry bag will save the day.", "Mornings usually have the calmest water.", "Book the small-group option for more space."],
  relax: ["Leave the afternoon unplanned afterwards.", "Book ahead on weekends.", "Bring a book and switch off your phone."],
  nightlife: ["Things don't really get going until late.", "Ask the bartender where locals go next.", "Keep your accommodation address handy for the ride home."],
  shopping: ["Bring cash and haggle with a smile.", "Go early for the best pick, late for the best prices.", "Pack a foldable bag for what you find."],
};

const KIND_TIP: Partial<Record<ActivityKind, string>> = {
  history: "Most sites close one day a week; check before you go.",
  adventure: "Tell someone your route and expected return time.",
  water: "Ask about reef-safe sunscreen.",
  nightlife: "Share your live location with a friend for late nights.",
};

/** Morning-first ordering for a natural day. */
const SLOT_ORDER: ActivityKind[] = ["adventure", "nature", "history", "culture", "food", "water", "shopping", "relax", "nightlife"];
const TIMES = ["09:00", "12:30", "15:30", "19:30"];

const FILLERS = [
  "Slow breakfast at a neighbourhood café|food",
  "Wander a neighbourhood you haven't seen yet|culture",
  "Sunset at the best viewpoint in town|nature",
  "Market browse for souvenirs|shopping",
  "Long lunch somewhere the locals rate|food",
  "Day trip out of town|adventure",
  "Hands-on cooking or craft workshop|culture",
  "Free afternoon to rest and recharge|relax",
];
const FILLER_SET = new Set(FILLERS.map((f) => f.split("|")[0]));

export const guessKind = (text: string): ActivityKind => {
  const t = text.toLowerCase();
  if (/(bar|club|pub|nightlife|cocktail|samba|techno|izakaya|live music|night out|karaoke|beer)/.test(t)) return "nightlife";
  if (/(food|eat|lunch|dinner|breakfast|brunch|market tasting|cooking|street food|taco|noodle|tapas|wine|whisky|coffee|café|cafe|tasting|ramen|pizza)/.test(t)) return "food";
  if (/(snorkel|dive|diving|kayak|surf|boat|cruise|ferry|lagoon|swim|island-hopping|sail|cenote)/.test(t)) return "water";
  if (/(hike|trek|climb|zipline|canyon|volcano|summit|bike|cycle|motorbike|ski|safari|via ferrata|sledding|snowmobile)/.test(t)) return "adventure";
  if (/(spa|massage|hot spring|onsen|sauna|yoga|beach day|relax|hammam|lagoon soak)/.test(t)) return "relax";
  if (/(market|bazaar|souk|shop|boutique|mall)/.test(t)) return "shopping";
  if (/(castle|palace|ruins|museum|fort|tunnel|memorial|cathedral|pyramid|archaeolog|historic)/.test(t)) return "history";
  if (/(park|garden|lake|waterfall|beach|mountain|forest|viewpoint|sunset|sunrise|nature|bay|fjord|aurora|lights)/.test(t)) return "nature";
  return "culture";
};

const pick = <T,>(list: T[], seed: number) => list[Math.abs(seed) % list.length];

const hash = (s: string) => {
  let h = 0;
  for (const c of s) h = (h * 31 + c.charCodeAt(0)) | 0;
  return Math.abs(h);
};

const uid = (prefix: string) => `${prefix}-${Date.now().toString(36)}${Math.random().toString(36).slice(2, 6)}`;

const splitActivity = (text: string) => {
  const m = text.match(/^(.{4,70}?)\s(?:[—–-]|:)\s(.+)$/);
  return m ? { name: m[1].trim(), detail: m[2].trim() } : { name: text.trim(), detail: "" };
};

const makeStop = (
  text: string,
  index: number,
  total: number,
  kindHint: ActivityKind | undefined,
  dest: { name: string; coords?: [number, number] },
  seed: number,
): ItineraryStop => {
  const { name, detail } = splitActivity(text);
  const kind = kindHint ?? guessKind(text);
  const slot = kind === "nightlife" ? 3 : Math.min(TIMES.length - 1, Math.round((index / Math.max(1, total - 1)) * (Math.min(total, 4) - 1)));
  return {
    id: uid("stop"),
    name,
    time: TIMES[slot],
    duration: KIND_DURATION[kind],
    description: detail || pick(KIND_NOTE[kind], seed + index),
    category: KIND_CATEGORY[kind],
    coordinates: { lat: dest.coords?.[0] ?? 0, lng: dest.coords?.[1] ?? 0 },
    mapQuery: `${name}, ${dest.name}`,
    tips: index === 0 ? KIND_TIP[kind] : undefined,
  };
};

const topCategory = (days: ItineraryDay[]): Category => {
  const counts = new Map<Category, number>();
  days.flatMap((d) => d.stops).forEach((s) => counts.set(s.category as Category, (counts.get(s.category as Category) ?? 0) + 1));
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? "Culture";
};

const tagsFor = (days: ItineraryDay[]) => [...new Set(days.flatMap((d) => d.stops.map((s) => s.category)))].slice(0, 3);

export const housingFor = (cost: 1 | 2 | 3, style?: "hostel" | "hotel" | "airbnb") => {
  const base = {
    1: ["Social hostel with private rooms", "Family-run guesthouse", "Budget boutique hotel"],
    2: ["Design hotel in the old town", "Apartment rental near the centre", "Guesthouse with breakfast"],
    3: ["Boutique hotel with a view", "Serviced apartment", "Splurge night at a landmark hotel"],
  }[cost];
  if (style === "hostel") return [base[0], "Hostel with a rooftop common room", base[1]];
  if (style === "airbnb") return ["Local apartment rental", base[1], base[2]];
  return base;
};

export const VIBE_TITLES: Record<string, string[]> = {
  adventure: ["Peaks & Trails", "Wild Days", "Off the Beaten Path"],
  relaxing: ["Slow Days", "Sun & Stillness", "Easy Escape"],
  cultural: ["Old Stories", "Temples & Tastes", "The Long Way Round"],
  party: ["After Dark", "Late Nights", "Neon & Noise"],
};

/**
 * Build the day-by-day activity text for a known destination, favouring the
 * kinds of things the traveler asked for.
 */
export const draftDays = (dest: CatalogDestination, days: number, interests: ActivityKind[], seed = 0) => {
  const highlights = dest.highlights.map(parseHighlight);
  const ranked = [...highlights].sort((a, b) => {
    const ai = interests.includes(a.kind) ? 0 : 1;
    const bi = interests.includes(b.kind) ? 0 : 1;
    return ai - bi || (hash(a.title + seed) % 3) - (hash(b.title + seed) % 3);
  });
  const fillers = FILLERS.map(parseHighlight);
  // Two or three stops a day, highlights spread evenly so no day is all filler.
  const perDay = Math.max(2, Math.min(3, Math.floor((ranked.length + fillers.length) / days)));
  const buckets: { title: string; kind: ActivityKind }[][] = Array.from({ length: days }, () => []);
  ranked.forEach((h, i) => buckets[i % days].length < perDay && buckets[i % days].push(h));
  let f = seed % fillers.length;
  buckets.forEach((b) => {
    while (b.length < perDay) b.push(fillers[f++ % fillers.length]);
  });
  return buckets.map((items, d) => {
    items.sort((a, b) => SLOT_ORDER.indexOf(a.kind) - SLOT_ORDER.indexOf(b.kind));
    const lead = items.find((it) => !FILLER_SET.has(it.title)) ?? items[0];
    const short = lead.title.split(/ and | at | to | in the /)[0];
    const title = d === 0 ? `Arrive & ${short}` : FILLER_SET.has(lead.title) ? (lead.kind === "adventure" ? "Day trip" : "Slow day, local life") : short;
    return { day: d + 1, title, items };
  });
};

/** A planned trip for a known destination (guided results, offline AI). */
export const tripFromCatalog = (
  dest: CatalogDestination,
  opts: {
    source: PlannedTrip["source"];
    days: number;
    interests?: ActivityKind[];
    vibe?: string;
    budget?: string;
    housingStyle?: "hostel" | "hotel" | "airbnb";
    match?: number;
    reason?: string;
    seed?: number;
  },
): PlannedTrip => {
  const seed = opts.seed ?? hash(dest.id);
  const drafted = draftDays(dest, opts.days, opts.interests ?? [], seed);
  const days: ItineraryDay[] = drafted.map((d) => ({
    dayNumber: d.day,
    title: d.title,
    stops: d.items.map((it, i) => makeStop(it.title, i, d.items.length, it.kind, dest, seed + d.day)),
  }));
  const vibeKey = opts.vibe && VIBE_TITLES[opts.vibe] ? opts.vibe : dest.vibe[0];
  const title = `${dest.name}: ${pick(VIBE_TITLES[vibeKey], seed)}`;
  return {
    id: uid(opts.source),
    planned: true,
    source: opts.source,
    destinationId: dest.venturaId ?? `catalog:${dest.id}`,
    catalogId: dest.id,
    destinationName: dest.name,
    country: dest.country,
    title,
    summary: dest.blurb,
    description: `${opts.days} days in ${dest.name}. ${dest.blurb}`,
    duration: opts.days,
    category: topCategory(days),
    tags: tagsFor(days),
    author: { name: "Ventura AI", avatar: "" },
    rating: opts.match ? Math.round((3.9 + (opts.match / 100) * 1.05) * 10) / 10 : 4.7,
    imageUrl: dest.image,
    days,
    vibeLabel: vibeKey ? `${vibeKey.charAt(0).toUpperCase()}${vibeKey.slice(1)}` : undefined,
    budget: opts.budget,
    housing: housingFor(dest.cost, opts.housingStyle),
    keyActivities: dest.highlights.slice(0, 4).map((h) => parseHighlight(h).title),
    match: opts.match,
    reason: opts.reason,
    createdAt: Date.now(),
  };
};

/** Convert an AI-generated itinerary (any provider) into a planned trip. */
export const tripFromAI = (ai: AIItinerary | TravelerAIItinerary, source: "ai" | "community"): PlannedTrip => {
  const destination = ai.destination?.trim() || "Somewhere new";
  const known = findCatalogDestination(destination, ai.country);
  const place = { name: destination.split(",")[0], coords: known?.coords };
  const seed = hash(destination + (ai.summary ?? ""));
  const days: ItineraryDay[] = (ai.days ?? []).slice(0, 10).map((d, di) => {
    const acts = (d.activities ?? []).filter(Boolean).slice(0, 5);
    return {
      dayNumber: d.day ?? di + 1,
      title: d.title || `Day ${di + 1}`,
      stops: acts.map((a, i) => makeStop(String(a), i, acts.length, undefined, place, seed + di)),
    };
  });
  const traveler = "authorName" in ai ? (ai as TravelerAIItinerary) : null;
  const country = ai.country || known?.country || destination.split(",")[1]?.trim() || "";
  return {
    id: uid(source),
    planned: true,
    source,
    destinationId: known?.venturaId ?? `catalog:${known?.id ?? destination}`,
    catalogId: known?.id,
    destinationName: place.name,
    country,
    title: ai.vibe ? `${place.name}: ${ai.vibe}` : `${days.length} days in ${place.name}`,
    summary: ai.summary ?? "",
    description: ai.description || ai.summary || "",
    duration: Math.max(1, days.length),
    category: days.length ? topCategory(days) : "Culture",
    tags: days.length ? tagsFor(days) : [],
    author: { name: traveler?.authorName ?? "Ventura AI", avatar: "" },
    rating: traveler ? Math.min(5, Math.max(1, Number(traveler.rating) || 4.6)) : 4.8,
    // Prefer bundled photography: remote URLs can't load in every environment.
    imageUrl: known?.image ?? imageForDestination(destination, ai.country, ai.vibe),
    days,
    vibeLabel: ai.vibe,
    budget: ai.budget,
    housing: ai.housing ?? [],
    keyActivities: ai.keyActivities ?? [],
    review: traveler
      ? {
          authorName: traveler.authorName,
          rating: Math.min(5, Math.max(1, Number(traveler.rating) || 4.6)),
          reviewCount: Number(traveler.reviewCount) || 120,
          snippet: traveler.reviewSnippet ?? "",
        }
      : undefined,
    createdAt: Date.now(),
  };
};

/** The inverse: render a catalog trip as the AI tool-call shape (used by the offline planner). */
export const aiFromTrip = (trip: PlannedTrip): AIItinerary => ({
  destination: trip.destinationName,
  country: trip.country,
  summary: trip.summary,
  description: trip.description,
  vibe: trip.vibeLabel,
  days: trip.days.map((d) => ({
    day: d.dayNumber,
    title: d.title,
    activities: d.stops.map((s) => `${s.name} — ${s.description}`),
  })),
  budget: trip.budget ?? "",
  housing: trip.housing,
  keyActivities: trip.keyActivities,
});
