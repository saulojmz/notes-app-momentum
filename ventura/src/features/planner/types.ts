import type { Itinerary } from "@/types/itinerary";

export type TripParty = "solo" | "couple" | "group";
export type TripVibe = "adventure" | "relaxing" | "cultural" | "party";
export type Climate = "warm" | "mild" | "cold" | "rainy";
export type Setting = "beach" | "mountains" | "city" | "countryside";
export type Continent = "Asia" | "Europe" | "North America" | "South America" | "Africa" | "Oceania";
export type RegionChoice = Continent | "Anywhere";
export type Transport = "public" | "rental" | "mix";
export type Housing = "hostel" | "hotel" | "airbnb";
export type HardNo = "extreme-weather" | "nightlife" | "crowds" | "altitude" | "remote";

/** Kinds of things to do; drives icons, categories and itinerary building. */
export type ActivityKind = "food" | "culture" | "history" | "nature" | "adventure" | "water" | "relax" | "nightlife" | "shopping";

/** Everything the guided planner asks, in order. */
export interface GuidedAnswers {
  party: TripParty;
  dates: { from?: string; to?: string };
  budget: number;
  vibe: TripVibe;
  climate: Climate;
  setting: Setting;
  region: RegionChoice;
  transport: Transport;
  housing: Housing;
  hardNos: HardNo[];
}

/** One itinerary as the AI returns it (the handoff's tool-call shape). */
export interface AIItinerary {
  destination: string;
  country?: string;
  summary: string;
  description: string;
  vibe?: string;
  days: { day: number; title: string; activities: string[] }[];
  budget: string;
  housing: string[];
  keyActivities: string[];
  imageUrl?: string;
}

/** A community-style itinerary: same shape plus a fictional traveler review. */
export interface TravelerAIItinerary extends AIItinerary {
  rating: number;
  reviewCount: number;
  authorName: string;
  reviewSnippet: string;
}

/** The six things the AI chat must know before it plans. */
export interface TripCriteria {
  destination?: string;
  vibe?: string;
  party?: string;
  dates?: string;
  budget?: string;
  activities?: string;
}

export const CRITERIA: { key: keyof TripCriteria; label: string }[] = [
  { key: "destination", label: "Where" },
  { key: "vibe", label: "Vibe" },
  { key: "party", label: "Who" },
  { key: "dates", label: "When" },
  { key: "budget", label: "Budget" },
  { key: "activities", label: "To do" },
];

export const criteriaComplete = (c: TripCriteria) => CRITERIA.every(({ key }) => !!c[key]?.trim());

/**
 * A trip produced by the planner. It extends the app's Itinerary so it opens
 * in the regular itinerary screens, and adds what the planner knows.
 */
export interface TripStay {
  id: string;
  name: string;
  area?: string;
  /** Day the stay starts (1-based) and how many nights. */
  fromDay: number;
  nights: number;
  pricePerNight: number;
}

export type TransportMode = "train" | "flight" | "bus" | "car" | "ferry";

export interface TripLeg {
  id: string;
  mode: TransportMode;
  from: string;
  to: string;
  day: number;
  time?: string;
  price: number;
}

export interface PlannedTrip extends Itinerary {
  planned: true;
  source: "ai" | "community" | "guided" | "custom";
  destinationName: string;
  country: string;
  summary: string;
  vibeLabel?: string;
  budget?: string;
  housing: string[];
  keyActivities: string[];
  /** Guided planner match score, 0–100. */
  match?: number;
  reason?: string;
  review?: { authorName: string; rating: number; reviewCount: number; snippet: string };
  /** Planner catalog id when the destination is one we know. */
  catalogId?: string;
  createdAt: number;
  /** Set on desktop. The trip shows up as Today on the phone while it runs. */
  startDate?: string;
  stays?: TripStay[];
  transport?: TripLeg[];
  currency?: string;
  published?: boolean;
}

export interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}
