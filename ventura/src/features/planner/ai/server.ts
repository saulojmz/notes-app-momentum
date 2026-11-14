import type { AIItinerary, ChatMessage, TravelerAIItinerary } from "../types";
import { PlannerAIError, type PlannerAI, type TurnResult } from "./types";

/**
 * The handoff's `travel-chat` edge function (supabase/functions/travel-chat).
 * It streams OpenAI-style SSE and returns itineraries as tool calls:
 * stage 1 converses and calls `generate_itineraries` once it has all six
 * criteria; stage 2 is forced to call `generate_traveler_itineraries`.
 */

const URL_BASE = import.meta.env.VITE_SUPABASE_URL as string | undefined;
const KEY = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY as string | undefined;

export const serverConfigured = () => !!URL_BASE && !!KEY;

interface StreamResult {
  text: string;
  tools: Record<string, unknown>;
}

const stream = async (messages: ChatMessage[], stage: 1 | 2): Promise<StreamResult> => {
  const resp = await fetch(`${URL_BASE}/functions/v1/travel-chat`, {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${KEY}` },
    body: JSON.stringify({ messages, stage }),
  });
  if (resp.status === 429) throw new PlannerAIError("Too many requests. Try again in a moment.", "rate_limited");
  if (resp.status === 402) throw new PlannerAIError("The AI service needs more credit.", "payment_required", true);
  if (!resp.ok || !resp.body) throw new PlannerAIError("Couldn't reach the planner service.", "upstream_error", true);

  const reader = resp.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  const tools: Record<string, unknown> = {};

  for (;;) {
    const { done, value } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    let nl: number;
    while ((nl = buffer.indexOf("\n")) !== -1) {
      let line = buffer.slice(0, nl);
      buffer = buffer.slice(nl + 1);
      if (line.endsWith("\r")) line = line.slice(0, -1);
      if (!line.startsWith("data: ")) continue;
      const json = line.slice(6).trim();
      if (json === "[DONE]") continue;
      try {
        const parsed = JSON.parse(json);
        const delta = parsed.choices?.[0]?.delta;
        if (delta?.content) text += delta.content;
        for (const call of delta?.tool_calls ?? []) {
          const name = call.function?.name;
          const args = call.function?.arguments;
          if (!name || !args) continue;
          try {
            tools[name] = JSON.parse(args);
          } catch {
            /* partial arguments; the complete call arrives with finish_reason */
          }
        }
      } catch {
        /* keep reading */
      }
    }
  }
  return { text, tools };
};

export const createServerPlanner = (): PlannerAI => ({
  id: "server",
  label: "Ventura AI",
  reportsCriteria: false,
  async reply(messages): Promise<TurnResult> {
    const { text, tools } = await stream(messages, 1);
    const itineraries = (tools.generate_itineraries as { itineraries?: AIItinerary[] })?.itineraries;
    return { text: itineraries ? "" : text, criteria: {}, ready: !!itineraries?.length, itineraries };
  },
  async generateItineraries(messages): Promise<AIItinerary[]> {
    const { tools } = await stream(messages, 1);
    const list = (tools.generate_itineraries as { itineraries?: AIItinerary[] })?.itineraries;
    if (!list?.length) throw new PlannerAIError("The planner didn't return itineraries.", "invalid_json");
    return list;
  },
  async generateTravelerItineraries(messages): Promise<TravelerAIItinerary[]> {
    const { tools } = await stream(messages, 2);
    const list = (tools.generate_traveler_itineraries as { travelerItineraries?: TravelerAIItinerary[] })?.travelerItineraries;
    if (!list?.length) throw new PlannerAIError("The planner didn't return traveler itineraries.", "invalid_json");
    return list;
  },
});
