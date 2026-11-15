import { useEffect, useState } from "react";
import { fallBackToDemo, getPlannerAI, PlannerAIError, type PlannerAI } from "@/features/planner/ai";
import { tripFromAI } from "@/features/planner/builder";
import { rememberDrafts, savePlannerSession, type PlannerSession } from "@/features/planner/trips";
import type { AIItinerary, ChatMessage, TripCriteria } from "@/features/planner/types";
import { storage } from "@/lib/storage";

const CHAT_KEY = "ventura_planner_chat";

export const OPENING: ChatMessage = {
  role: "assistant",
  content: "Tell me about the trip you have in mind: where, when, who with, your budget and the pace you like.",
};

export const STARTERS = [
  "I'm traveling solo and want an adventure",
  "I have $2,000 and a week off in March",
  "Looking for a peaceful beach getaway",
  "Cultural experience in Southeast Asia",
];

interface SavedChat {
  messages: ChatMessage[];
  criteria: TripCriteria;
}

/**
 * The AI trip-planning conversation: messages, the six criteria it tracks,
 * and the two-stage generation (three planned trips, three traveler
 * favourites). Falls back to the offline planner when Claude isn't available.
 */
export const usePlannerChat = (onDone: (session: PlannerSession) => void) => {
  const initial = storage.get<SavedChat | null>(CHAT_KEY, null);
  const [messages, setMessages] = useState<ChatMessage[]>(initial?.messages?.length ? initial.messages : [OPENING]);
  const [criteria, setCriteria] = useState<TripCriteria>(initial?.criteria ?? {});
  const [status, setStatus] = useState<"idle" | "thinking" | "generating">("idle");
  const [stage, setStage] = useState<1 | 2>(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [ai, setAI] = useState<PlannerAI | null>(null);

  useEffect(() => {
    getPlannerAI().then(setAI);
  }, []);
  useEffect(() => {
    storage.set(CHAT_KEY, { messages, criteria });
  }, [messages, criteria]);

  /** Run a step on the current provider; on a permanent failure switch to the offline planner once. */
  const run = async <T,>(step: (p: PlannerAI) => Promise<T>): Promise<T> => {
    const current = ai ?? (await getPlannerAI());
    try {
      return await step(current);
    } catch (e) {
      if (e instanceof PlannerAIError && e.fallback && current.id !== "demo") {
        const demo = fallBackToDemo();
        setAI(demo);
        setNotice(`${e.message} Switched to Ventura's offline planner.`);
        return step(demo);
      }
      throw e;
    }
  };

  const generate = async (conversation: ChatMessage[], known: TripCriteria, stageOne?: AIItinerary[]) => {
    setStatus("generating");
    setStage(1);
    try {
      const aiItins = stageOne?.length ? stageOne : await run((p) => p.generateItineraries(conversation, known));
      setStage(2);
      const traveler = await run((p) => p.generateTravelerItineraries(conversation, known, aiItins));
      const aiTrips = aiItins.slice(0, 3).map((it) => tripFromAI(it, "ai"));
      const communityTrips = traveler.slice(0, 3).map((it) => tripFromAI(it, "community"));
      rememberDrafts([...aiTrips, ...communityTrips]);
      const provider = (ai ?? (await getPlannerAI())).label;
      const session = { aiTripIds: aiTrips.map((t) => t.id), communityTripIds: communityTrips.map((t) => t.id), criteria: known, provider };
      savePlannerSession(session);
      setStatus("idle");
      onDone(session);
    } catch (e) {
      setNotice(e instanceof PlannerAIError ? e.message : "Couldn't build your itineraries. Try again.");
      setStatus("idle");
    }
  };

  /** Send a message. Resolves to false when it couldn't be sent (so the caller can restore the input). */
  const send = async (text: string): Promise<boolean> => {
    const content = text.trim();
    if (!content || status !== "idle") return false;
    const conversation: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(conversation);
    setNotice(null);
    setStatus("thinking");
    try {
      const turn = await run((p) => p.reply(conversation));
      const known = Object.keys(turn.criteria).length ? { ...criteria, ...turn.criteria } : criteria;
      setCriteria(known);
      if (turn.ready) {
        await generate(conversation, known, turn.itineraries);
        return true;
      }
      setMessages((m) => [...m, { role: "assistant", content: turn.text || "Tell me a little more" }]);
      setStatus("idle");
      return true;
    } catch (e) {
      setMessages(messages);
      setNotice(e instanceof PlannerAIError ? e.message : "Something went wrong. Try sending that again.");
      setStatus("idle");
      return false;
    }
  };

  const reset = () => {
    setMessages([OPENING]);
    setCriteria({});
    setNotice(null);
    setStatus("idle");
  };

  return { messages, criteria, status, stage, notice, ai, send, reset, busy: status !== "idle" };
};
