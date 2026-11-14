import type { AIItinerary, ChatMessage, TravelerAIItinerary, TripCriteria } from "../types";
import { PlannerAIError, type PlannerAI, type TurnResult } from "./types";

/**
 * Claude, reached through a host bridge. When the app runs inside the
 * Ventura design-review artifact, the page that embeds it exposes
 * `window.__venturaHost` (backed by the artifact `sample` capability, on the
 * viewer's own Claude account). When the app itself is served as an artifact,
 * we build the same bridge from `window.claude`.
 */
export interface VenturaHost {
  version: 1;
  /** Resolves false when Claude can't be used in this view. */
  available(): Promise<boolean>;
  /** Ask for JSON. Rejects with `{code, message}`. */
  json(input: string | ChatMessage[], options?: { modelTier?: "quick" | "default" }): Promise<unknown>;
}

type SampleFn = ((input: unknown, options?: unknown) => Promise<{ text: string }>) & {
  json: (input: unknown, options?: unknown) => Promise<unknown>;
};

const parentWindow = (): Window | null => {
  try {
    return window.parent && window.parent !== window ? window.parent : null;
  } catch {
    return null;
  }
};

export const findHost = (): VenturaHost | null => {
  for (const w of [window, parentWindow()]) {
    try {
      const host = (w as unknown as { __venturaHost?: VenturaHost } | null)?.__venturaHost;
      if (host && typeof host.json === "function") return host;
    } catch {
      /* cross-origin parent */
    }
  }
  const claude = (window as unknown as { claude?: { use?: (n: string) => Promise<SampleFn | null> } }).claude;
  if (claude?.use) {
    const sample = claude.use("sample");
    return {
      version: 1,
      available: () => sample.then((s) => !!s).catch(() => false),
      json: async (input, options) => {
        const s = await sample;
        if (!s) throw { code: "not_granted", message: "Claude is not available here" };
        return s.json(input, { cache: false, ...options });
      },
    };
  }
  return null;
};

const UNAVAILABLE = new Set(["not_granted", "sampling_disabled", "not_declared", "capability_disabled", "capability_removed", "session_expired"]);

const toError = (e: unknown): PlannerAIError => {
  const code = (e as { code?: string })?.code ?? "upstream_error";
  if (UNAVAILABLE.has(code)) return new PlannerAIError("Claude isn't available in this view.", code, true);
  if (code === "rate_limited") return new PlannerAIError("Claude is busy right now. Try again in a moment.", code);
  if (code === "invalid_json") return new PlannerAIError("Claude's answer came back garbled. Try sending that again.", code);
  return new PlannerAIError("Something went wrong reaching Claude. Try again.", code);
};

const RULES = `You are Ventura's trip-planning assistant inside a travel app. Have a short, warm conversation to learn six things before planning:
1. destination: a country, region or city (or "anywhere")
2. vibe: adventurous, relaxing, cultural, romantic, party…
3. party: solo, couple or group (and how many)
4. dates: month, season or dates, and roughly how long
5. budget: per person
6. activities: what they want to do

Rules:
- Ask about ONE missing thing at a time (two only if they fit naturally together). 1–2 short sentences, friendly, at most one emoji.
- Briefly acknowledge what they just told you.
- If an answer is vague (e.g. "beach vibes" with no place), ask a clarifying question.
- Never say you are generating, planning or "putting together" anything. When all six are known, set "ready" to true and "reply" to "".
- criteria values are short labels in the traveler's own terms (e.g. "Southeast Asia", "Solo", "June · 10 days", "$2,000", "Hiking, street food"), or null when unknown.

Reply with ONLY this JSON object and nothing else:
{"reply": string, "criteria": {"destination": string|null, "vibe": string|null, "party": string|null, "dates": string|null, "budget": string|null, "activities": string|null}, "ready": boolean}`;

const ITINERARY_SHAPE = `{"destination": "City", "country": "Country", "summary": "1–2 sentences", "description": "2–3 sentences", "vibe": "short label like Fun Adventure, Budget Escape, Cultural Journey", "days": [{"day": 1, "title": "short day title", "activities": ["Activity — short detail", "…3 or 4 per day, each under 14 words"]}], "budget": "estimate per person", "housing": ["2–3 places to stay"], "keyActivities": ["3–5 must-dos"]}`;

const transcript = (messages: ChatMessage[]) =>
  messages.map((m) => `${m.role === "user" ? "Traveler" : "Assistant"}: ${m.content}`).join("\n");

const locationRule = `Location rules: if they named a country or region rather than one city, use 3 DIFFERENT cities within it. If they named a single city, keep that city for all 3 and vary the activities and style. One "days" entry per day of the trip, at most 7.`;

const asArray = <T,>(value: unknown, key: string): T[] => {
  const v = value as Record<string, unknown> | unknown[];
  const list = Array.isArray(v) ? v : (v?.[key] as unknown[]);
  if (!Array.isArray(list) || !list.length) throw new PlannerAIError("Claude didn't return any itineraries.", "invalid_json");
  return list.slice(0, 3).map((it) => {
    const x = it as Record<string, unknown>;
    return {
      ...x,
      days: Array.isArray(x.days) ? x.days : [],
      housing: Array.isArray(x.housing) ? x.housing : [],
      keyActivities: Array.isArray(x.keyActivities) ? x.keyActivities : [],
    } as T;
  });
};

export const createClaudePlanner = (host: VenturaHost): PlannerAI => ({
  id: "claude",
  label: "Claude",
  reportsCriteria: true,
  async reply(messages): Promise<TurnResult> {
    try {
      const turns: ChatMessage[] = [{ role: "user", content: RULES }, ...messages.slice(-24)];
      const out = (await host.json(turns, { modelTier: "quick" })) as {
        reply?: string;
        criteria?: Record<string, string | null>;
        ready?: boolean;
      };
      const criteria: TripCriteria = {};
      for (const [k, v] of Object.entries(out?.criteria ?? {})) if (typeof v === "string" && v.trim()) criteria[k as keyof TripCriteria] = v.trim();
      return { text: (out?.reply ?? "").trim(), criteria, ready: !!out?.ready };
    } catch (e) {
      throw e instanceof PlannerAIError ? e : toError(e);
    }
  },
  async generateItineraries(messages, criteria): Promise<AIItinerary[]> {
    try {
      const prompt = `Plan 3 trip itineraries for a traveler using Ventura, a travel app.
Their criteria: ${JSON.stringify(criteria)}
Conversation:
${transcript(messages)}

${locationRule}
Each itinerary has this shape: ${ITINERARY_SHAPE}
Reply with ONLY JSON: {"itineraries": [three itineraries]}`;
      return asArray<AIItinerary>(await host.json(prompt, { modelTier: "quick" }), "itineraries");
    } catch (e) {
      throw e instanceof PlannerAIError ? e : toError(e);
    }
  },
  async generateTravelerItineraries(messages, criteria, stageOne): Promise<TravelerAIItinerary[]> {
    try {
      const used = stageOne.map((i) => i.destination).join(", ");
      const prompt = `Write 3 traveler-style itineraries, as if shared by fellow travelers on Ventura, for the same trip.
Their criteria: ${JSON.stringify(criteria)}
Conversation:
${transcript(messages)}

${locationRule} Where the region allows, use different cities from these: ${used}.
Each itinerary has this shape: ${ITINERARY_SHAPE.slice(0, -1)}, "rating": number between 4.0 and 5.0, "reviewCount": number between 50 and 500, "authorName": "a fictional first name and last initial", "reviewSnippet": "1–2 sentence review in the traveler's voice"}
Reply with ONLY JSON: {"travelerItineraries": [three itineraries]}`;
      return asArray<TravelerAIItinerary>(await host.json(prompt, { modelTier: "quick" }), "travelerItineraries");
    } catch (e) {
      throw e instanceof PlannerAIError ? e : toError(e);
    }
  },
});
