import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, ArrowUp, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { CriteriaTracker, GeneratingCard, TypingDots } from "@/components/planner/ChatBits";
import { fallBackToDemo, getPlannerAI, PlannerAIError, type PlannerAI } from "@/features/planner/ai";
import { tripFromAI } from "@/features/planner/builder";
import { rememberDrafts, savePlannerSession } from "@/features/planner/trips";
import type { AIItinerary, ChatMessage, TripCriteria } from "@/features/planner/types";
import { storage } from "@/lib/storage";
import { cn } from "@/lib/utils";

const CHAT_KEY = "ventura_planner_chat";
const OPENING: ChatMessage = {
  role: "assistant",
  content: "Tell me about the trip you have in mind: where, when, who with, your budget and the pace you like.",
};
const STARTERS = [
  "I'm traveling solo and want an adventure",
  "I have $2,000 and a week off in March",
  "Looking for a peaceful beach getaway",
  "Cultural experience in Southeast Asia",
];

interface SavedChat {
  messages: ChatMessage[];
  criteria: TripCriteria;
}

const PlannerChatPage = () => {
  const navigate = useNavigate();
  const initial = storage.get<SavedChat | null>(CHAT_KEY, null);
  const [messages, setMessages] = useState<ChatMessage[]>(initial?.messages?.length ? initial.messages : [OPENING]);
  const [criteria, setCriteria] = useState<TripCriteria>(initial?.criteria ?? {});
  const [input, setInput] = useState("");
  const [status, setStatus] = useState<"idle" | "thinking" | "generating">("idle");
  const [stage, setStage] = useState<1 | 2>(1);
  const [notice, setNotice] = useState<string | null>(null);
  const [ai, setAI] = useState<PlannerAI | null>(null);
  const endRef = useRef<HTMLDivElement>(null);
  const boxRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    getPlannerAI().then(setAI);
  }, []);

  useEffect(() => {
    storage.set(CHAT_KEY, { messages, criteria });
  }, [messages, criteria]);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, status]);

  const resize = () => {
    const el = boxRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 160)}px`;
  };

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
      savePlannerSession({ aiTripIds: aiTrips.map((t) => t.id), communityTripIds: communityTrips.map((t) => t.id), criteria: known, provider });
      navigate("/plan-trip/options");
    } catch (e) {
      setNotice(e instanceof PlannerAIError ? e.message : "Couldn't build your itineraries. Try again.");
      setStatus("idle");
    }
  };

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content || status !== "idle") return;
    const conversation: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(conversation);
    setInput("");
    setNotice(null);
    requestAnimationFrame(resize);
    setStatus("thinking");
    try {
      const turn = await run((p) => p.reply(conversation));
      const known = Object.keys(turn.criteria).length ? { ...criteria, ...turn.criteria } : criteria;
      setCriteria(known);
      if (turn.ready) {
        await generate(conversation, known, turn.itineraries);
        return;
      }
      setMessages((m) => [...m, { role: "assistant", content: turn.text || "Tell me a little more" }]);
      setStatus("idle");
    } catch (e) {
      // Put the message back so it can be resent.
      setMessages(messages);
      setInput(content);
      setNotice(e instanceof PlannerAIError ? e.message : "Something went wrong. Try sending that again.");
      setStatus("idle");
    }
  };

  const reset = () => {
    setMessages([OPENING]);
    setCriteria({});
    setNotice(null);
    setStatus("idle");
  };

  const busy = status !== "idle";
  const showStarters = messages.length === 1 && !busy;

  return (
    <div className="flex min-h-[100dvh] flex-col">
      <header className="pt-safe sticky top-0 z-20 border-b border-border bg-background">
        <div className="flex h-16 items-center gap-2 px-3">
          <Button variant="ghost" size="icon" onClick={() => navigate("/plan-trip")} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
          <div className="min-w-0 flex-1">
            <p className="text-[15px] font-medium leading-tight">Trip planner</p>
            <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className={cn("h-1.5 w-1.5 rounded-full", ai ? "bg-success" : "bg-muted-foreground/40")} />
              {ai ? (ai.id === "claude" ? "with Claude" : ai.label) : "Connecting…"}
            </p>
          </div>
          {messages.length > 1 && (
            <Button variant="ghost" size="icon" onClick={reset} disabled={busy} aria-label="Start a new chat">
              <RotateCcw className="!size-[18px]" />
            </Button>
          )}
        </div>
        {(ai?.reportsCriteria ?? true) && (
          <div className="mx-auto max-w-2xl px-5 pb-3">
            <CriteriaTracker criteria={criteria} />
          </div>
        )}
      </header>

      <main className="mx-auto w-full max-w-2xl flex-1 space-y-3 px-5 pb-6 pt-5">
        {messages.map((m, i) =>
          m.role === "user" ? (
            <div key={i} className="flex justify-end animate-fade-in">
              <p className="max-w-[85%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-relaxed text-ink-foreground">
                {m.content}
              </p>
            </div>
          ) : (
            <div key={i} className="flex animate-fade-in">
              <p className="max-w-[88%] whitespace-pre-wrap rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3 text-[15px] leading-relaxed">
                {m.content}
              </p>
            </div>
          ),
        )}

        {showStarters && (
          <div className="space-y-2 pt-3 animate-fade-in">
            <p className="eyebrow px-1">Try one of these</p>
            {STARTERS.map((s) => (
              <button
                key={s}
                type="button"
                onClick={() => send(s)}
                className="press flex w-full items-center justify-between gap-3 rounded-xl border border-border bg-card px-4 py-3 text-left text-[15px] transition-colors hover:border-foreground/20"
              >
                {s}
                <ArrowUp className="h-4 w-4 shrink-0 rotate-45 text-muted-foreground" />
              </button>
            ))}
          </div>
        )}

        {status === "thinking" && (
          <div className="flex animate-fade-in">
            <span className="rounded-2xl rounded-bl-md border border-border bg-card px-4 py-3">
              <TypingDots />
            </span>
          </div>
        )}
        {status === "generating" && <GeneratingCard stage={stage} criteria={criteria} />}

        {notice && <p className="rounded-xl bg-warning/10 px-4 py-3 text-[13px] text-foreground/80">{notice}</p>}
        <div ref={endRef} className="scroll-mb-28" />
      </main>

      <footer className="pb-safe sticky bottom-0 z-10 border-t border-border bg-background px-4 pt-3">
        <form
          className="mx-auto flex max-w-2xl items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            send();
          }}
        >
          <label htmlFor="planner-input" className="sr-only">
            Message
          </label>
          <textarea
            id="planner-input"
            ref={boxRef}
            rows={1}
            value={input}
            disabled={busy}
            onChange={(e) => {
              setInput(e.target.value);
              resize();
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={busy ? "Working on it" : "Message"}
            className="max-h-40 min-h-[48px] flex-1 resize-none rounded-xl border border-input bg-card px-4 py-3 text-[15px] leading-snug outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={busy || !input.trim()} aria-label="Send">
            <ArrowUp className="!size-5" />
          </Button>
        </form>
      </footer>
    </div>
  );
};

export default PlannerChatPage;
