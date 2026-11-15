import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowRight, Compass, Pencil } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { EmptyState, SectionHeader, SmartImage, TopBar } from "@/components/kit";
import { WorldDotMap } from "@/components/planner/WorldDotMap";
import { rankDestinations, tripLength, type Match } from "@/features/planner/match";
import { tripFromCatalog } from "@/features/planner/builder";
import { readGuidedAnswers, readGuidedDraft, rememberDrafts } from "@/features/planner/trips";
import type { GuidedAnswers } from "@/features/planner/types";
import { DEFAULT_ANSWERS } from "./GuidedPlanningPage";
import { cn } from "@/lib/utils";

const label = (a: GuidedAnswers) =>
  [
    { solo: "Solo", couple: "Couple", group: "Group" }[a.party],
    `$${a.budget.toLocaleString("en-US")}`,
    { warm: "Warm", mild: "Mild", cold: "Cold", rainy: "Rainy" }[a.climate],
    a.setting.charAt(0).toUpperCase() + a.setting.slice(1),
    a.region === "Anywhere" ? "Anywhere" : a.region,
  ].join(" · ");

const PlannerResultsPage = () => {
  const navigate = useNavigate();
  const [answers] = useState(() => readGuidedAnswers() ?? readGuidedDraft()?.answers ?? DEFAULT_ANSWERS);
  const matches = useMemo(() => rankDestinations(answers), [answers]);
  const [selected, setSelected] = useState<string | null>(matches[0]?.dest.id ?? null);

  const openTrip = (m: Match) => {
    const trip = tripFromCatalog(m.dest, {
      source: "guided",
      days: tripLength(answers),
      vibe: answers.vibe,
      budget: `About $${answers.budget.toLocaleString("en-US")} per person`,
      housingStyle: answers.housing,
      match: m.score,
      reason: m.reason,
    });
    rememberDrafts([trip]);
    navigate(`/itinerary/${trip.id}`);
  };

  if (!matches.length) {
    return (
      <div className="min-h-screen">
        <TopBar onBack={() => navigate("/plan-trip/guided")} title="Your matches" />
        <EmptyState
          icon={Compass}
          title="No matches yet"
          description="Nothing fits every answer. Try another region or fewer hard no's"
          action={
            <Button className="w-full" onClick={() => navigate("/plan-trip/guided")}>
              Edit answers
            </Button>
          }
        />
      </div>
    );
  }

  const top = matches.slice(0, 3);
  const rest = matches.slice(3, 8);
  const sel = matches.find((m) => m.dest.id === selected);

  return (
    <div className="min-h-screen pb-16">
      <TopBar onBack={() => navigate(-1)} title="Your matches" />

      <div className="mx-auto max-w-2xl space-y-8 px-5">
        <header className="space-y-3 pt-2">
          <p className="eyebrow">{matches.length} destinations scored</p>
          <h1 className="text-display text-[36px]">Your top matches</h1>
          <button
            type="button"
            onClick={() => navigate("/plan-trip/guided")}
            className="flex w-full items-center justify-between gap-3 rounded-2xl bg-secondary px-4 py-3 text-left"
          >
            <span className="truncate tabular-nums text-xs text-muted-foreground">{label(answers)}</span>
            <Pencil className="h-4 w-4 shrink-0 text-muted-foreground" />
          </button>
        </header>

        {/* Map */}
        <section className="surface overflow-hidden p-0">
          <div className="px-3 pt-4">
            <WorldDotMap
              points={matches.slice(0, 8).map((m, i) => ({
                id: m.dest.id,
                lat: m.dest.coords[0],
                lng: m.dest.coords[1],
                weight: m.score,
                label: m.dest.name,
                rank: i < 3 ? i + 1 : undefined,
              }))}
              selected={selected}
              onSelect={setSelected}
            />
          </div>
          {sel && (
            <div key={sel.dest.id} className="flex items-start gap-3 border-t border-border p-4 animate-fade-in">
              <span className="text-display text-[32px] tabular-nums text-primary">{sel.score}%</span>
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {sel.dest.name}, <span className="font-normal text-muted-foreground">{sel.dest.country}</span>
                </p>
                <p className="mt-0.5 text-[13px] leading-relaxed text-muted-foreground">{sel.reason}</p>
              </div>
              <Button size="icon-sm" variant="secondary" aria-label={`Open ${sel.dest.name} trip`} onClick={() => openTrip(sel)}>
                <ArrowRight />
              </Button>
            </div>
          )}
        </section>

        {/* Top 3 */}
        <section className="space-y-4">
          <SectionHeader title="Top three" />
          <div className="space-y-4">
            {top.map((m, i) => (
              <article key={m.dest.id} className="surface overflow-hidden p-0">
                <div className="relative aspect-[16/9] bg-secondary">
                  <SmartImage src={m.dest.image} alt={m.dest.name} className="h-full w-full object-cover" />
                  <div className="scrim-b absolute inset-0" />
                  <Badge className="absolute left-3 top-3 h-7 bg-card px-2.5 tabular-nums text-[13px] text-foreground">{i + 1} · {m.score}% match</Badge>
                  <div className="absolute inset-x-0 bottom-0 p-4 text-on-image">
                    <p className="text-[13px] text-on-image/75">{m.dest.country}</p>
                    <h3 className="text-display mt-1 text-[32px]">{m.dest.name}</h3>
                  </div>
                </div>
                <div className="space-y-3 p-4">
                  <p className="text-[15px] leading-relaxed text-foreground/85">{m.reason}</p>
                  <div className="flex flex-wrap gap-1.5">
                    {[...m.dest.setting.slice(0, 2), ...m.dest.climate.slice(0, 1), m.dest.cost === 1 ? "budget" : m.dest.cost === 3 ? "splurge" : "mid-range"].map((t) => (
                      <Badge key={t} variant="secondary" className="capitalize">
                        {t}
                      </Badge>
                    ))}
                  </div>
                  <div className="flex gap-2 pt-1">
                    {m.dest.venturaId && (
                      <Button variant="secondary" className="flex-1" onClick={() => navigate(`/destinations/${m.dest.venturaId}`)}>
                        Explore city
                      </Button>
                    )}
                    <Button className="flex-1" onClick={() => openTrip(m)}>
                      See itinerary
                      <ArrowRight />
                    </Button>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </section>

        {rest.length > 0 && (
          <section className="space-y-3">
            <SectionHeader title="Other good fits" />
            <div className="surface divide-y divide-border overflow-hidden p-0">
              {rest.map((m) => (
                <button
                  key={m.dest.id}
                  type="button"
                  onClick={() => openTrip(m)}
                  className={cn("flex w-full items-center gap-3 p-3 text-left transition-colors hover:bg-accent/40")}
                >
                  <SmartImage src={m.dest.image} alt="" className="h-12 w-12 shrink-0 rounded-xl object-cover" />
                  <span className="min-w-0 flex-1">
                    <span className="block font-medium">{m.dest.name}</span>
                    <span className="meta block truncate">{m.dest.country}</span>
                  </span>
                  <span className="tabular-nums text-sm text-muted-foreground">{m.score}%</span>
                </button>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  );
};

export default PlannerResultsPage;
