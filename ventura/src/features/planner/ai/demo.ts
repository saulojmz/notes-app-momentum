import { catalog, destinationsForRegion, findCatalogDestination, type CatalogDestination } from "../catalog";
import { aiFromTrip, tripFromCatalog } from "../builder";
import { criteriaComplete, type ActivityKind, type AIItinerary, type ChatMessage, type TravelerAIItinerary, type TripCriteria } from "../types";
import type { PlannerAI, TurnResult } from "./types";

/**
 * Ventura's offline planner. It follows the same contract as the AI
 * providers — collect six criteria with one friendly question at a time,
 * then produce two sets of itineraries — using the destination catalog.
 * Used when no AI backend is reachable, so the feature always works.
 */

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const MONTHS = ["january", "february", "march", "april", "may", "june", "july", "august", "september", "october", "november", "december"];
const MONTH_SHORT = MONTHS.map((m) => m.slice(0, 3));
const cap = (s: string) => s.replace(/\b\w/g, (c) => c.toUpperCase());

const VIBES: [RegExp, string][] = [
  [/\b(adventur\w*|thrill\w*|active|outdoorsy|wild)\b/, "Adventure"],
  [/\b(relax\w*|chill\w*|calm|peaceful|slow|unwind|getaway|rest)\b/, "Relaxing"],
  [/\b(cultur\w*|history|historic|museums?|temples?|art|heritage)\b/, "Cultural"],
  [/\b(party|parties|nightlife|clubs?|clubbing|bars?)\b/, "Party"],
  [/\b(romantic|honeymoon|anniversary)\b/, "Romantic"],
  [/\b(foodie|food trip|culinary)\b/, "Foodie"],
];

const ACTIVITIES: [RegExp, string, ActivityKind][] = [
  [/\b(hik\w*|trek\w*|walks?|trails?)\b/, "Hiking", "adventure"],
  [/\b(food|eat\w*|street food|cooking|restaurants?|tacos?|noodles?)\b/, "Food", "food"],
  [/\b(museums?|galler\w*|art)\b/, "Museums", "culture"],
  [/\b(temples?|shrines?|churches|cathedrals?)\b/, "Temples", "culture"],
  [/\b(histor\w*|castles?|ruins|palaces?)\b/, "History", "history"],
  [/\b(beach\w*|swim\w*|sun\w*bath\w*)\b/, "Beaches", "relax"],
  [/\b(snorkel\w*|div(e|ing)|surf\w*|kayak\w*|sailing|boat\w*)\b/, "Water sports", "water"],
  [/\b(nightlife|clubs?|bars?|party|dancing)\b/, "Nightlife", "nightlife"],
  [/\b(shopping|markets?|souvenirs?)\b/, "Markets", "shopping"],
  [/\b(wildlife|animals|safari|nature|national parks?)\b/, "Nature", "nature"],
  [/\b(spa|yoga|wellness|massage|hot springs?|onsen)\b/, "Wellness", "relax"],
  [/\b(ski\w*|snowboard\w*)\b/, "Skiing", "adventure"],
  [/\b(photo\w*)\b/, "Photography", "nature"],
  [/\b(cycl\w*|bik(e|ing))\b/, "Cycling", "adventure"],
  [/\b(wine|whisky|beer|coffee)\b/, "Tastings", "food"],
];

const KIND_BY_LABEL = new Map(ACTIVITIES.map(([, label, kind]) => [label, kind]));

const NUMBER_WORDS: Record<string, number> = { a: 1, one: 1, two: 2, three: 3, four: 4, five: 5, six: 6, seven: 7, eight: 8, ten: 10 };

type Key = keyof TripCriteria;
const ORDER: Key[] = ["destination", "dates", "budget", "activities", "vibe", "party"];

const QUESTIONS: Record<Key, string[]> = {
  destination: [
    "Where in the world are you dreaming of? A country, a region, or “surprise me” all work",
    "Any part of the world calling you? A city, a country or a whole region is fine.",
  ],
  dates: ["When are you thinking of going, and for roughly how long?", "Do you have dates in mind? A month and a rough length is plenty."],
  budget: ["What's your budget per person, roughly?", "Roughly how much would you like to spend per person?"],
  activities: [
    "What do you want to fill your days with: hiking, food, museums, beaches, nightlife?",
    "What are the must-dos for you? Food, nature, history, the beach…?",
  ],
  vibe: ["What's the vibe: adventurous, relaxed, cultural, or a bit of a party?", "How do you want it to feel: active and adventurous, or slow and easy?"],
  party: ["Who's coming: just you, the two of you, or a group?", "Is this a solo trip, a couple's trip or a group trip?"],
};

const extractDestination = (text: string, raw: string): string | undefined => {
  if (/\b(anywhere|surprise me|no preference|don'?t mind|wherever|open to (anything|everything))\b/.test(text)) return "Anywhere";
  const hits = destinationsForRegion(text);
  if (hits.length) {
    const named = hits.find((d) => new RegExp(`\\b${d.name.toLowerCase()}\\b`).test(text));
    if (named) return named.name;
    const country = hits.find((d) => new RegExp(`\\b${d.country.toLowerCase()}\\b`).test(text));
    if (country) return country.country;
    for (const phrase of ["southeast asia", "south east asia", "scandinavia", "mediterranean", "latin america", "caribbean", "alps", "nordics", "south america", "north america", "central america", "europe", "asia", "africa", "oceania"])
      if (text.includes(phrase)) return cap(phrase);
    const alias = hits[0].aliases?.find((a) => new RegExp(`\\b${a}\\b`).test(text));
    if (alias) return cap(alias);
  }
  // A capitalised place we don't know yet: "to Hanoi", "in Patagonia".
  const m = raw.match(/\b(?:to|in|visit(?:ing)?|around|explore|exploring)\s+([A-Z][a-zà-ÿ]+(?:\s[A-Z][a-zà-ÿ]+)?)/);
  if (m && !MONTHS.includes(m[1].toLowerCase()) && !["I", "My", "The"].includes(m[1])) return m[1];
  return undefined;
};

const extractDates = (text: string): string | undefined => {
  const parts: string[] = [];
  const month = MONTHS.find((m, i) => new RegExp(`\\b(${m}|${MONTH_SHORT[i]})\\b`).test(text));
  if (month) parts.push(cap(month));
  const season = text.match(/\b(spring|summer|autumn|fall|winter|christmas|new year'?s?|easter|spring break)\b/);
  if (!month && season) parts.push(cap(season[1]));
  const rel = text.match(/\b(next|this) (week|month|weekend|year)\b/);
  if (!month && !season && rel) parts.push(cap(rel[0]));
  const dur = text.match(/\b(\d+|a|one|two|three|four|five|six|seven|eight|ten)\s*(days?|weeks?|nights?)\b/);
  if (dur) {
    const n = Number(dur[1]) || NUMBER_WORDS[dur[1]] || 1;
    const unit = dur[2].startsWith("week") ? (n === 1 ? "week" : "weeks") : dur[2].startsWith("night") ? "nights" : n === 1 ? "day" : "days";
    parts.push(`${n} ${unit}`);
  } else if (/\b(long weekend)\b/.test(text)) parts.push("4 days");
  return parts.length ? parts.join(" · ") : undefined;
};

const extractBudget = (raw: string, text: string): string | undefined => {
  const money = raw.match(/([$£€])\s?(\d[\d,.]*)\s?(k)?|(\d[\d,.]*)\s?(k)?\s?(dollars|usd|euros?|eur|pounds|gbp|bucks)/i);
  if (money) {
    const symbol = money[1] ?? (/(euro|eur)/i.test(money[6] ?? "") ? "€" : /(pound|gbp)/i.test(money[6] ?? "") ? "£" : "$");
    let n = Number((money[2] ?? money[4]).replace(/,/g, ""));
    if (money[3] || money[5]) n *= 1000;
    return `${symbol}${n.toLocaleString("en-US")}`;
  }
  if (/\b(cheap|budget|backpack\w*|shoestring|tight)\b/.test(text)) return "Budget";
  if (/\b(mid[- ]?range|moderate|comfortable)\b/.test(text)) return "Mid-range";
  if (/\b(luxury|luxurious|splurge|no limit|high[- ]end)\b/.test(text)) return "Luxury";
  return undefined;
};

const extractParty = (text: string): string | undefined => {
  if (/\b(solo|alone|by myself|on my own|just me)\b/.test(text)) return "Solo";
  if (/\b(couple|partner|girlfriend|boyfriend|wife|husband|fianc\w*|honeymoon|two of us|the two of us)\b/.test(text)) return "Couple";
  const n = text.match(/\b(\d+|three|four|five|six|seven|eight|ten)\s+(of us|people|friends|adults)\b/);
  if (n) return `Group of ${Number(n[1]) || NUMBER_WORDS[n[1]] || n[1]}`;
  if (/\b(friends|group|family|kids|crew|squad)\b/.test(text)) return "Group";
  return undefined;
};

const extractVibe = (text: string) => VIBES.find(([re]) => re.test(text))?.[1];
const extractActivities = (text: string) => ACTIVITIES.filter(([re]) => re.test(text)).map(([, label]) => label);

/** Rebuild the criteria from the whole conversation. */
const readConversation = (messages: ChatMessage[], asked: Map<string, Key>) => {
  const c: TripCriteria = {};
  const activities = new Set<string>();
  let lastAsked: Key | undefined;
  let newest: Key[] = [];
  messages.forEach((m, i) => {
    if (m.role === "assistant") {
      lastAsked = asked.get(m.content);
      return;
    }
    const raw = m.content;
    const text = raw.toLowerCase();
    const before = { ...c };
    c.destination = extractDestination(text, raw) ?? c.destination;
    c.dates = extractDates(text) ?? c.dates;
    c.budget = extractBudget(raw, text) ?? c.budget;
    c.party = extractParty(text) ?? c.party;
    c.vibe = extractVibe(text) ?? c.vibe;
    extractActivities(text).forEach((a) => activities.add(a));
    if (activities.size) c.activities = [...activities].join(", ");
    // A short answer to the question we just asked counts, even if we can't parse it.
    if (lastAsked && !c[lastAsked] && raw.trim().length <= 48) c[lastAsked] = raw.trim().replace(/[.!]$/, "");
    if (i === messages.length - 1) newest = (Object.keys(c) as Key[]).filter((k) => c[k] && c[k] !== before[k]);
  });
  return { criteria: c, newest };
};

const ACK: Record<Key, (v: string) => string> = {
  destination: (v) => (v === "Anywhere" ? "Open to anywhere, I love that." : `${v}, great choice.`),
  dates: (v) => `${v}, noted.`,
  budget: (v) => `${v} works.`,
  activities: () => "Love that.",
  vibe: (v) => `${v} it is.`,
  party: (v) => (v === "Solo" ? "A solo trip, great call." : v === "Couple" ? "A trip for two, lovely." : "A group trip, fun."),
};

const daysFrom = (dates?: string) => {
  const m = dates?.match(/(\d+)\s*(day|week|night)/);
  if (!m) return 5;
  const n = Number(m[1]) * (m[2] === "week" ? 7 : 1);
  return Math.max(3, Math.min(7, n));
};

const interestKinds = (c: TripCriteria): ActivityKind[] => {
  const kinds = (c.activities ?? "")
    .split(/,\s*/)
    .map((a) => KIND_BY_LABEL.get(a))
    .filter((k): k is ActivityKind => !!k);
  if (!kinds.length) extractActivities((c.activities ?? "").toLowerCase()).forEach((l) => kinds.push(KIND_BY_LABEL.get(l)!));
  return kinds;
};

const vibeKey = (c: TripCriteria) => {
  const v = (c.vibe ?? "").toLowerCase();
  if (/adventur/.test(v)) return "adventure";
  if (/relax|romantic/.test(v)) return "relaxing";
  if (/party|night/.test(v)) return "party";
  return "cultural";
};

const VIBE_LABELS: Record<string, string[]> = {
  adventure: ["Fun Adventure", "Trail Seeker", "Wild Escape"],
  relaxing: ["Slow & Sunny", "Easy Escape", "Unplugged"],
  cultural: ["Cultural Journey", "Old Stories", "Local Flavour"],
  party: ["Late Nights", "Social Butterfly", "City Buzz"],
};

/** Rank candidate destinations for the conversation. */
const candidates = (c: TripCriteria): { pool: CatalogDestination[]; singleCity: boolean } => {
  const dest = c.destination ?? "";
  const known = dest && dest !== "Anywhere" ? destinationsForRegion(dest.toLowerCase()) : [];
  const exact = findCatalogDestination(dest);
  const singleCity = !!exact && exact.name.toLowerCase() === dest.toLowerCase();
  const kinds = interestKinds(c);
  const vk = vibeKey(c);
  const score = (d: CatalogDestination) =>
    (d.vibe.includes(vk as never) ? 3 : 0) +
    d.highlights.filter((h) => kinds.some((k) => h.endsWith(`|${k}`))).length +
    (/budget/i.test(c.budget ?? "") ? 3 - d.cost : 0);
  const pool = singleCity ? [exact!] : (known.length ? known : catalog).slice().sort((a, b) => score(b) - score(a));
  return { pool, singleCity };
};

const AUTHORS = ["Maya R.", "Tomás G.", "Priya S.", "Jonas W.", "Aiko T.", "Lena M.", "Sam O.", "Inés P.", "Kofi A."];
const REVIEWS = [
  "Followed this almost exactly and it was the best trip I've taken in years.",
  "Perfect pacing: busy mornings, lazy afternoons. Wouldn't change a thing.",
  "The food stops alone were worth it. Felt like travelling with a local friend.",
  "Did this solo and felt safe and looked after the whole way.",
  "Great mix of famous sights and places I'd never have found on my own.",
];

const seedOf = (c: TripCriteria) => [...JSON.stringify(c)].reduce((h, ch) => (h * 31 + ch.charCodeAt(0)) | 0, 7);

const buildSet = (c: TripCriteria, offset: number) => {
  const { pool, singleCity } = candidates(c);
  const days = daysFrom(c.dates);
  const kinds = interestKinds(c);
  const vk = vibeKey(c);
  const seed = Math.abs(seedOf(c)) + offset * 11;
  return [0, 1, 2].map((i) => {
    const dest = singleCity ? pool[0] : pool[(offset + i) % pool.length];
    const trip = tripFromCatalog(dest, {
      source: "ai",
      days,
      interests: i === 1 && singleCity ? [...kinds].reverse() : kinds,
      vibe: vk,
      budget: c.budget && c.budget !== "Budget" ? `About ${c.budget} per person` : dest.cost === 1 ? "Under $1,500 per person" : "Around $2,500 per person",
      seed: seed + i,
    });
    const ai = aiFromTrip(trip);
    ai.vibe = VIBE_LABELS[vk][(i + offset) % 3];
    ai.summary = `${days} days of ${c.activities?.toLowerCase() || "highlights"} in ${dest.name}, ${dest.country}. ${dest.blurb}`;
    return ai;
  });
};

export const createDemoPlanner = (): PlannerAI => {
  const asked = new Map<string, Key>();
  return {
    id: "demo",
    label: "Offline planner",
    reportsCriteria: true,
    async reply(messages): Promise<TurnResult> {
      await wait(650 + Math.random() * 500);
      const { criteria, newest } = readConversation(messages, asked);
      if (criteriaComplete(criteria)) return { text: "", criteria, ready: true };
      const missing = ORDER.find((k) => !criteria[k])!;
      const turn = messages.filter((m) => m.role === "user").length;
      const ack = newest[0] ? ACK[newest[0]](criteria[newest[0]]!) + " " : "";
      const text = ack + QUESTIONS[missing][turn % QUESTIONS[missing].length];
      asked.set(text, missing);
      return { text, criteria, ready: false };
    },
    async generateItineraries(_messages, criteria): Promise<AIItinerary[]> {
      await wait(1800);
      return buildSet(criteria, 0);
    },
    async generateTravelerItineraries(_messages, criteria): Promise<TravelerAIItinerary[]> {
      await wait(1500);
      const seed = Math.abs(seedOf(criteria));
      return buildSet(criteria, 3).map((it, i) => ({
        ...it,
        rating: Math.round((4.4 + ((seed + i * 7) % 6) / 10) * 10) / 10,
        reviewCount: 80 + ((seed + i * 97) % 380),
        authorName: AUTHORS[(seed + i) % AUTHORS.length],
        reviewSnippet: REVIEWS[(seed + i * 3) % REVIEWS.length],
      }));
    },
  };
};
