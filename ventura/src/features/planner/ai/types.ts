import type { AIItinerary, ChatMessage, TravelerAIItinerary, TripCriteria } from "../types";

export interface TurnResult {
  /** What to show in the chat. Empty when the assistant is ready to plan. */
  text: string;
  /** Criteria known so far (empty when the provider can't report them). */
  criteria: TripCriteria;
  /** All six criteria are known: start generating. */
  ready: boolean;
  /** Some providers (the edge function) return stage-1 itineraries with the turn. */
  itineraries?: AIItinerary[];
}

export interface PlannerAI {
  id: "claude" | "server" | "demo";
  /** Shown in the chat header. */
  label: string;
  /** Whether `criteria` in turn results is meaningful (drives the tracker). */
  reportsCriteria: boolean;
  /** One conversational turn. `messages` ends on the traveler's message. */
  reply(messages: ChatMessage[]): Promise<TurnResult>;
  /** Stage 1: three AI itineraries. */
  generateItineraries(messages: ChatMessage[], criteria: TripCriteria): Promise<AIItinerary[]>;
  /** Stage 2: three traveler-style itineraries matching the same context. */
  generateTravelerItineraries(
    messages: ChatMessage[],
    criteria: TripCriteria,
    stageOne: AIItinerary[],
  ): Promise<TravelerAIItinerary[]>;
}

/** A failure the chat should explain. `fallback` means: switch to the offline planner. */
export class PlannerAIError extends Error {
  constructor(
    message: string,
    public code: string,
    public fallback = false,
  ) {
    super(message);
  }
}
