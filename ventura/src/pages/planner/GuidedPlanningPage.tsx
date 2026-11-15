import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import type { DateRange } from "react-day-picker";
import {
  ArrowLeft, X, User, Users, UsersRound, Bus, Car, TrainFront, Backpack, Hotel, Home,
  CloudLightning, PartyPopper, Mountain, Users2, Snowflake, MapPinned, type LucideIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Slider } from "@/components/ui/slider";
import { RouteProgress, StickyFooter } from "@/components/kit";
import { OptionRow, PhotoTile } from "@/components/planner/OptionTiles";
import { catalog, tilePhotos } from "@/features/planner/catalog";
import { clearGuidedDraft, readGuidedDraft, saveGuidedAnswers, saveGuidedDraft } from "@/features/planner/trips";
import type { Climate, Continent, GuidedAnswers, HardNo, Housing, RegionChoice, Setting, Transport, TripParty, TripVibe } from "@/features/planner/types";
import { cn } from "@/lib/utils";

const TOTAL = 9;

export const DEFAULT_ANSWERS: GuidedAnswers = {
  party: "solo",
  dates: {},
  budget: 2000,
  vibe: "adventure",
  climate: "mild",
  setting: "mountains",
  region: "Asia",
  transport: "public",
  housing: "hostel",
  hardNos: [],
};

const PARTIES: { value: TripParty; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "solo", label: "Solo", hint: "Just you", icon: User },
  { value: "couple", label: "Couple", hint: "You and one other", icon: Users },
  { value: "group", label: "Group", hint: "Three or more", icon: UsersRound },
];
const VIBES: { value: TripVibe; label: string; hint: string }[] = [
  { value: "adventure", label: "Adventure", hint: "Trails, thrills, early starts" },
  { value: "relaxing", label: "Relaxing", hint: "Slow mornings, long lunches" },
  { value: "cultural", label: "Cultural", hint: "History, art, local life" },
  { value: "party", label: "Party", hint: "Late nights, big energy" },
];
const CLIMATES: { value: Climate; label: string; hint: string }[] = [
  { value: "warm", label: "Warm & sunny", hint: "25°C and up" },
  { value: "mild", label: "Mild", hint: "Light-jacket weather" },
  { value: "cold", label: "Cold & crisp", hint: "Snow is welcome" },
  { value: "rainy", label: "Rainy & cosy", hint: "Cafés and moody skies" },
];
const SETTINGS: { value: Setting; label: string }[] = [
  { value: "beach", label: "Beach" },
  { value: "mountains", label: "Mountains" },
  { value: "city", label: "City" },
  { value: "countryside", label: "Countryside" },
];
const REGIONS: RegionChoice[] = ["Asia", "Europe", "North America", "South America", "Africa", "Oceania", "Anywhere"];
const TRANSPORTS: { value: Transport; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "public", label: "Public transport", hint: "Trains, buses and walking", icon: Bus },
  { value: "rental", label: "Rental car", hint: "Freedom to roam", icon: Car },
  { value: "mix", label: "A mix of both", hint: "Whatever's easiest", icon: TrainFront },
];
const HOUSINGS: { value: Housing; label: string; hint: string; icon: LucideIcon }[] = [
  { value: "hostel", label: "Hostels & guesthouses", hint: "Social and budget-friendly", icon: Backpack },
  { value: "hotel", label: "Hotels", hint: "Comfort and a front desk", icon: Hotel },
  { value: "airbnb", label: "Rentals", hint: "Your own place, local feel", icon: Home },
];
const HARD_NOS: { value: HardNo; label: string; icon: LucideIcon }[] = [
  { value: "extreme-weather", label: "Extreme weather", icon: CloudLightning },
  { value: "nightlife", label: "Nightlife-focused cities", icon: PartyPopper },
  { value: "crowds", label: "Crowded tourist spots", icon: Users2 },
  { value: "altitude", label: "High altitude", icon: Mountain },
  { value: "remote", label: "Remote, hard-to-reach places", icon: Snowflake },
];

const STEPS: { eyebrow: string; title: string; hint?: string }[] = [
  { eyebrow: "Travel party", title: "Who's traveling?" },
  { eyebrow: "Dates & budget", title: "When, and how much?", hint: "Budget is per person, including stays and activities." },
  { eyebrow: "Trip vibe", title: "What kind of trip?" },
  { eyebrow: "Climate", title: "What weather do you want?" },
  { eyebrow: "Setting", title: "Where do you feel best?" },
  { eyebrow: "Region", title: "Any part of the world?" },
  { eyebrow: "Getting around", title: "How will you get around?" },
  { eyebrow: "Stays", title: "Where will you stay?" },
  { eyebrow: "Hard no's", title: "Anything to avoid?", hint: "Pick as many as you like, or none." },
];

const GuidedPlanningPage = () => {
  const navigate = useNavigate();
  // Resume an unfinished questionnaire; a finished one starts over.
  const [draft] = useState(() => {
    const d = readGuidedDraft();
    if (d?.step === TOTAL) {
      clearGuidedDraft();
      return { step: 1, answers: d.answers };
    }
    return d;
  });
  const [step, setStep] = useState(draft?.step ?? 1);
  const [a, setA] = useState<GuidedAnswers>(draft?.answers ?? DEFAULT_ANSWERS);

  // Progress is saved after every change.
  useEffect(() => {
    saveGuidedDraft({ step, answers: a });
  }, [step, a]);

  const set = <K extends keyof GuidedAnswers>(key: K, value: GuidedAnswers[K]) => setA((prev) => ({ ...prev, [key]: value }));
  const back = () => (step === 1 ? navigate("/plan-trip") : setStep(step - 1));
  const next = () => {
    if (step < TOTAL) return setStep(step + 1);
    saveGuidedAnswers(a);
    navigate("/plan-trip/results");
  };

  const range: DateRange | undefined = a.dates.from ? { from: new Date(a.dates.from), to: a.dates.to ? new Date(a.dates.to) : undefined } : undefined;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const regionCount = (r: RegionChoice) => (r === "Anywhere" ? catalog.length : catalog.filter((d) => d.continent === (r as Continent)).length);
  const { eyebrow, title, hint } = STEPS[step - 1];

  return (
    <div className="flex min-h-[100dvh] flex-col">
      {/* Header */}
      <header className="pt-safe sticky top-0 z-20 bg-background/90 backdrop-blur-xl">
        <div className="flex h-16 items-center justify-between px-3">
          <Button variant="ghost" size="icon" onClick={back} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
          <span className="tabular-nums text-[13px] text-muted-foreground">
            Step {step} of {TOTAL}
          </span>
          <Button variant="ghost" size="icon" onClick={() => navigate("/plan-trip")} aria-label="Exit planner">
            <X className="!size-5" />
          </Button>
        </div>
        <RouteProgress className="px-5 pb-4" total={TOTAL} current={step} />
      </header>

      <main key={step} className="mx-auto w-full max-w-md flex-1 px-5 pb-8 pt-4 animate-fade-in">
        <p className="eyebrow">{eyebrow}</p>
        <h1 className="text-display mt-2 text-[36px]">{title}</h1>
        {hint && <p className="mt-2 text-[15px] text-muted-foreground">{hint}</p>}

        <div className="mt-7">
          {step === 1 && (
            <div role="radiogroup" className="space-y-3">
              {PARTIES.map((p) => (
                <OptionRow key={p.value} icon={p.icon} label={p.label} hint={p.hint} selected={a.party === p.value} onClick={() => set("party", p.value)} />
              ))}
            </div>
          )}

          {step === 2 && (
            <div className="space-y-7">
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">Dates</p>
                  <p className="meta">
                    {range?.from ? `${format(range.from, "MMM d")}${range.to ? ` – ${format(range.to, "MMM d")}` : ""}` : "Flexible"}
                  </p>
                </div>
                <div className="surface p-3">
                  <Calendar
                    mode="range"
                    selected={range}
                    onSelect={(r) => set("dates", { from: r?.from?.toISOString(), to: r?.to?.toISOString() })}
                    disabled={(d) => d < today}
                    className="w-full p-0"
                    classNames={{ day_range_middle: "aria-selected:bg-primary/10 aria-selected:text-foreground rounded-none" }}
                  />
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-baseline justify-between">
                  <p className="text-sm font-medium">Budget</p>
                  <p className="text-display text-[32px] tabular-nums">${a.budget.toLocaleString("en-US")}</p>
                </div>
                <Slider value={[a.budget]} onValueChange={([v]) => set("budget", v)} min={500} max={10000} step={100} aria-label="Budget per person" />
                <div className="flex justify-between tabular-nums text-xs text-muted-foreground">
                  <span>$500</span>
                  <span>$10,000</span>
                </div>
              </div>
            </div>
          )}

          {step === 3 && (
            <div role="radiogroup" className="grid grid-cols-2 gap-3">
              {VIBES.map((v) => (
                <PhotoTile key={v.value} label={v.label} hint={v.hint} image={tilePhotos[v.value]} selected={a.vibe === v.value} onClick={() => set("vibe", v.value)} />
              ))}
            </div>
          )}

          {step === 4 && (
            <div role="radiogroup" className="grid grid-cols-2 gap-3">
              {CLIMATES.map((c) => (
                <PhotoTile key={c.value} label={c.label} hint={c.hint} image={tilePhotos[c.value]} selected={a.climate === c.value} onClick={() => set("climate", c.value)} />
              ))}
            </div>
          )}

          {step === 5 && (
            <div role="radiogroup" className="grid grid-cols-2 gap-3">
              {SETTINGS.map((s) => (
                <PhotoTile key={s.value} label={s.label} image={tilePhotos[s.value]} selected={a.setting === s.value} onClick={() => set("setting", s.value)} />
              ))}
            </div>
          )}

          {step === 6 && (
            <div role="radiogroup" className="space-y-2.5">
              {REGIONS.map((r) => (
                <OptionRow
                  key={r}
                  icon={r === "Anywhere" ? MapPinned : undefined}
                  label={r === "Anywhere" ? "No preference" : r}
                  hint={`${regionCount(r)} destinations`}
                  selected={a.region === r}
                  onClick={() => set("region", r)}
                />
              ))}
            </div>
          )}

          {step === 7 && (
            <div role="radiogroup" className="space-y-3">
              {TRANSPORTS.map((t) => (
                <OptionRow key={t.value} icon={t.icon} label={t.label} hint={t.hint} selected={a.transport === t.value} onClick={() => set("transport", t.value)} />
              ))}
            </div>
          )}

          {step === 8 && (
            <div role="radiogroup" className="space-y-3">
              {HOUSINGS.map((h) => (
                <OptionRow key={h.value} icon={h.icon} label={h.label} hint={h.hint} selected={a.housing === h.value} onClick={() => set("housing", h.value)} />
              ))}
            </div>
          )}

          {step === 9 && (
            <div className="space-y-2.5">
              {HARD_NOS.map((h) => {
                const on = a.hardNos.includes(h.value);
                return (
                  <OptionRow
                    key={h.value}
                    multi
                    icon={h.icon}
                    label={h.label}
                    selected={on}
                    onClick={() => set("hardNos", on ? a.hardNos.filter((x) => x !== h.value) : [...a.hardNos, h.value])}
                  />
                );
              })}
            </div>
          )}
        </div>
      </main>

      <StickyFooter>
        <Button size="lg" className="mx-auto flex w-full max-w-md" onClick={next}>
          {step === TOTAL ? "See my matches" : "Continue"}
        </Button>
      </StickyFooter>
    </div>
  );
};

export default GuidedPlanningPage;
