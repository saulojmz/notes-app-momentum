import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { ArrowRight, ArrowUp, CalendarDays, Check, Columns3, MapPin, Mountain, Palette, RotateCcw, Users, Wallet, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RouteProgress, Segmented, SmartImage } from "@/components/kit";
import { GeneratingCard, TypingDots } from "@/components/planner/ChatBits";
import { DEFAULT_ANSWERS, GUIDED_STEPS, GUIDED_TOTAL, GuidedStepBody } from "@/components/planner/GuidedQuestions";
import { WorldDotMap } from "@/components/planner/WorldDotMap";
import { tripFromCatalog } from "@/features/planner/builder";
import { rankDestinations, tripLength, type Match } from "@/features/planner/match";
import { findTrip, readGuidedDraft, readPlannerSession, rememberDrafts, saveGuidedAnswers, saveGuidedDraft, type PlannerSession } from "@/features/planner/trips";
import type { GuidedAnswers, PlannedTrip, TripCriteria } from "@/features/planner/types";
import { CRITERIA } from "@/features/planner/types";
import { STARTERS, usePlannerChat } from "@/features/planner/usePlannerChat";
import { cn } from "@/lib/utils";
import { Page, PageHeader } from "../Shell";

type Mode = "chat" | "guided";

const CRITERIA_ICON: Record<keyof TripCriteria, LucideIcon> = {
  destination: MapPin,
  vibe: Palette,
  party: Users,
  dates: CalendarDays,
  budget: Wallet,
  activities: Mountain,
};

/** Compact card for a generated option. */
export const OptionRow = ({ trip, onOpen }: { trip: PlannedTrip; onOpen: () => void }) => (
  <button type="button" onClick={onOpen} className="flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-secondary/60">
    <SmartImage src={trip.imageUrl} alt="" className="h-14 w-14 shrink-0 rounded-xl object-cover" />
    <span className="min-w-0 flex-1">
      <span className="block truncate text-sm font-medium">{trip.title}</span>
      <span className="block truncate text-xs tabular-nums text-muted-foreground">
        {trip.days.length} days{trip.budget ? ` · ${trip.budget}` : ""}
        {trip.review ? ` · ${trip.review.rating.toFixed(1)} from ${trip.review.reviewCount} travelers` : ""}
      </span>
    </span>
    <ArrowRight className="h-4 w-4 shrink-0 text-muted-foreground" />
  </button>
);

const ChatPlanner = () => {
  const navigate = useNavigate();
  const [input, setInput] = useState("");
  const [session, setSession] = useState<PlannerSession | null>(null);
  const chat = usePlannerChat(setSession);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chat.messages.length > 1) setSession(readPlannerSession());
    // Only on first mount: show the last results for a conversation in progress.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [chat.messages, chat.status]);

  const send = async (text?: string) => {
    const content = (text ?? input).trim();
    if (!content) return;
    setInput("");
    const ok = await chat.send(content);
    if (!ok) setInput(content);
  };

  const known = CRITERIA.filter(({ key }) => chat.criteria[key]).length;
  const aiTrips = (session?.aiTripIds ?? []).map((id) => findTrip(id)).filter(Boolean) as PlannedTrip[];
  const community = (session?.communityTripIds ?? []).map((id) => findTrip(id)).filter(Boolean) as PlannedTrip[];
  const hasResults = aiTrips.length + community.length > 0 && chat.messages.length > 1;

  return (
    <div className="grid h-[calc(100dvh-196px)] min-h-[560px] grid-cols-[minmax(0,1fr)_380px] gap-8">
      <section className="surface flex min-h-0 flex-col overflow-hidden p-0" aria-label="Conversation">
        <div className="flex items-center justify-between border-b border-border px-5 py-3">
          <p className="flex items-center gap-2 text-sm">
            <span className={cn("h-1.5 w-1.5 rounded-full", chat.ai ? "bg-success" : "bg-muted-foreground/40")} />
            {chat.ai ? (chat.ai.id === "claude" ? "Planning with Claude" : chat.ai.label) : "Connecting"}
          </p>
          {chat.messages.length > 1 && (
            <Button
              variant="ghost"
              size="sm"
              disabled={chat.busy}
              onClick={() => {
                chat.reset();
                setSession(null);
              }}
            >
              <RotateCcw />
              New conversation
            </Button>
          )}
        </div>

        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-6 py-6">
          {chat.messages.map((m, i) =>
            m.role === "user" ? (
              <div key={i} className="flex justify-end animate-fade-in">
                <p className="max-w-[75%] whitespace-pre-wrap rounded-2xl rounded-br-md bg-ink px-4 py-3 text-[15px] leading-relaxed text-ink-foreground">{m.content}</p>
              </div>
            ) : (
              <div key={i} className="flex animate-fade-in">
                <p className="max-w-[80%] whitespace-pre-wrap rounded-2xl rounded-bl-md bg-secondary px-4 py-3 text-[15px] leading-relaxed">{m.content}</p>
              </div>
            ),
          )}
          {chat.messages.length === 1 && !chat.busy && (
            <div className="grid grid-cols-2 gap-2 pt-4">
              {STARTERS.map((s) => (
                <button key={s} type="button" onClick={() => send(s)} className="rounded-xl border border-border px-4 py-3 text-left text-sm transition-colors hover:border-foreground/20 hover:bg-secondary/50">
                  {s}
                </button>
              ))}
            </div>
          )}
          {chat.status === "thinking" && (
            <div className="flex">
              <span className="rounded-2xl rounded-bl-md bg-secondary px-4 py-3">
                <TypingDots />
              </span>
            </div>
          )}
          {chat.notice && <p className="rounded-xl bg-warning/10 px-4 py-3 text-[13px] text-foreground/80">{chat.notice}</p>}
          <div ref={endRef} />
        </div>

        <form
          className="flex items-end gap-2 border-t border-border p-4"
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
            rows={1}
            value={input}
            disabled={chat.busy}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                send();
              }
            }}
            placeholder={chat.busy ? "Working on it" : "Describe the trip: where, when, who with, budget"}
            className="max-h-40 min-h-[48px] flex-1 resize-none rounded-xl border border-input bg-card px-4 py-3 text-[15px] leading-snug outline-none transition-colors placeholder:text-muted-foreground focus:border-primary/50 focus:ring-4 focus:ring-primary/10 disabled:opacity-60"
          />
          <Button type="submit" size="icon" className="h-12 w-12 shrink-0" disabled={chat.busy || !input.trim()} aria-label="Send">
            <ArrowUp className="!size-5" />
          </Button>
        </form>
      </section>

      <aside className="min-h-0 space-y-4 overflow-y-auto">
        <section className="surface p-4">
          <div className="flex items-baseline justify-between">
            <h2 className="text-sm font-medium">Trip details</h2>
            <span className="meta tabular-nums">{known} of 6</span>
          </div>
          <RouteProgress className="mt-3" total={6} current={Math.max(1, known)} />
          <dl className="mt-4 space-y-2.5">
            {CRITERIA.map(({ key, label }) => {
              const Icon = CRITERIA_ICON[key];
              const value = chat.criteria[key];
              return (
                <div key={key} className="flex items-start gap-3 text-sm">
                  {value ? <Check className="mt-0.5 h-4 w-4 shrink-0" /> : <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />}
                  <dt className="w-16 shrink-0 text-muted-foreground">{label}</dt>
                  <dd className={cn("min-w-0 flex-1", !value && "text-muted-foreground/70")}>{value ?? "Not yet"}</dd>
                </div>
              );
            })}
          </dl>
        </section>

        {chat.status === "generating" && <GeneratingCard stage={chat.stage} criteria={chat.criteria} />}

        {hasResults && chat.status !== "generating" && (
          <>
            <section className="surface overflow-hidden p-0">
              <h2 className="px-4 pb-1 pt-4 text-sm font-medium">Planned for you</h2>
              <div className="divide-y divide-border">
                {aiTrips.map((t) => (
                  <OptionRow key={t.id} trip={t} onOpen={() => navigate(`/explore/itinerary/${t.id}`)} />
                ))}
              </div>
            </section>
            {community.length > 0 && (
              <section className="surface overflow-hidden p-0">
                <h2 className="px-4 pb-1 pt-4 text-sm font-medium">Loved by travelers</h2>
                <div className="divide-y divide-border">
                  {community.map((t) => (
                    <OptionRow key={t.id} trip={t} onOpen={() => navigate(`/explore/itinerary/${t.id}`)} />
                  ))}
                </div>
              </section>
            )}
            <Button className="w-full" onClick={() => navigate("/plan/options")}>
              <Columns3 />
              Compare side by side
            </Button>
          </>
        )}
      </aside>
    </div>
  );
};

const GuidedPlanner = () => {
  const navigate = useNavigate();
  const [draft] = useState(() => readGuidedDraft());
  const [step, setStep] = useState(draft && draft.step < GUIDED_TOTAL ? draft.step : 1);
  const [a, setA] = useState<GuidedAnswers>(draft?.answers ?? DEFAULT_ANSWERS);
  const [selected, setSelected] = useState<string | null>(null);

  useEffect(() => {
    saveGuidedDraft({ step, answers: a });
  }, [step, a]);

  const set = <K extends keyof GuidedAnswers>(key: K, value: GuidedAnswers[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const matches = useMemo(() => rankDestinations(a), [a]);
  const top = matches.slice(0, 6);
  const { eyebrow, title, hint } = GUIDED_STEPS[step - 1];

  const open = (m: Match) => {
    saveGuidedAnswers(a);
    const trip = tripFromCatalog(m.dest, {
      source: "guided",
      days: tripLength(a),
      vibe: a.vibe,
      budget: `About $${a.budget.toLocaleString("en-US")} per person`,
      housingStyle: a.housing,
      match: m.score,
      reason: m.reason,
    });
    rememberDrafts([trip]);
    navigate(`/explore/itinerary/${trip.id}`);
  };

  return (
    <div className="grid grid-cols-[minmax(0,1fr)_380px] gap-8">
      <section className="surface p-8">
        <div className="flex items-center justify-between">
          <p className="text-[13px] tabular-nums text-muted-foreground">
            Question {step} of {GUIDED_TOTAL}
          </p>
          <p className="eyebrow">{eyebrow}</p>
        </div>
        <RouteProgress className="mt-3" total={GUIDED_TOTAL} current={step} />
        <div key={step} className="animate-fade-in">
          <h2 className="text-display mt-8 text-[36px]">{title}</h2>
          {hint && <p className="mt-2 text-[15px] text-muted-foreground">{hint}</p>}
          <div className={cn("mt-7", (step === 1 || step >= 6) && "max-w-lg", step === 2 && "max-w-md")}>
            <GuidedStepBody step={step} a={a} set={set} wide />
          </div>
        </div>
        <div className="mt-10 flex items-center justify-between border-t border-border pt-6">
          <Button variant="ghost" disabled={step === 1} onClick={() => setStep(step - 1)}>
            Back
          </Button>
          {step < GUIDED_TOTAL ? (
            <Button onClick={() => setStep(step + 1)}>
              Continue
              <ArrowRight />
            </Button>
          ) : (
            <Button onClick={() => matches[0] && open(matches[0])}>
              Build a trip for {matches[0]?.dest.name ?? "my top match"}
              <ArrowRight />
            </Button>
          )}
        </div>
      </section>

      <aside className="space-y-4">
        <section className="surface overflow-hidden p-0">
          <div className="flex items-baseline justify-between px-4 pb-1 pt-4">
            <h2 className="text-sm font-medium">Live matches</h2>
            <span className="meta tabular-nums">{matches.length} fit so far</span>
          </div>
          <div className="px-2">
            <WorldDotMap
              points={matches.slice(0, 8).map((m, i) => ({ id: m.dest.id, lat: m.dest.coords[0], lng: m.dest.coords[1], weight: m.score, label: m.dest.name, rank: i < 3 ? i + 1 : undefined }))}
              selected={selected ?? top[0]?.dest.id ?? null}
              onSelect={setSelected}
            />
          </div>
          <ol className="divide-y divide-border border-t border-border">
            {top.map((m, i) => (
              <li key={m.dest.id}>
                <button
                  type="button"
                  onClick={() => open(m)}
                  onMouseEnter={() => setSelected(m.dest.id)}
                  className="flex w-full items-center gap-3 px-4 py-2.5 text-left transition-colors hover:bg-secondary/60"
                >
                  <span className="w-4 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                  <span className="min-w-0 flex-1">
                    <span className="block truncate text-sm font-medium">{m.dest.name}</span>
                    <span className="mt-1 block h-1 overflow-hidden rounded-full bg-secondary">
                      <span className={cn("block h-full rounded-full", i === 0 ? "bg-primary" : "bg-foreground/30")} style={{ width: `${m.score}%` }} />
                    </span>
                  </span>
                  <span className={cn("w-10 text-right text-sm tabular-nums", i === 0 ? "text-primary" : "text-muted-foreground")}>{m.score}%</span>
                </button>
              </li>
            ))}
            {!top.length && <li className="px-4 py-4 text-sm text-muted-foreground">Nothing fits every answer yet. Try another region or fewer hard no's.</li>}
          </ol>
        </section>
        <p className="px-1 text-[13px] text-muted-foreground">Matches re-rank as you answer. Open any of them to see a drafted itinerary.</p>
      </aside>
    </div>
  );
};

const PlanPage = () => {
  const [params, setParams] = useSearchParams();
  const mode: Mode = params.get("mode") === "guided" ? "guided" : "chat";
  return (
    <Page wide className="pb-10 pt-8">
      <PageHeader eyebrow="Plan a trip" title="Where to next?" className="pb-6">
        <Segmented<Mode>
          label="How to plan"
          value={mode}
          onChange={(m) => setParams(m === "guided" ? { mode: "guided" } : {})}
          className="w-[300px]"
          options={[
            { value: "chat", label: "Describe it" },
            { value: "guided", label: "Nine questions" },
          ]}
        />
      </PageHeader>
      {mode === "chat" ? <ChatPlanner /> : <GuidedPlanner />}
    </Page>
  );
};

export default PlanPage;
