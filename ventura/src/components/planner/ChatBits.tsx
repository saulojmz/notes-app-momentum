import { Check, MapPin, Sparkles, Users, CalendarDays, Wallet, Compass, Mountain, type LucideIcon } from "lucide-react";
import { CRITERIA, type TripCriteria } from "@/features/planner/types";
import { cn } from "@/lib/utils";

const ICONS: Record<keyof TripCriteria, LucideIcon> = {
  destination: MapPin,
  vibe: Sparkles,
  party: Users,
  dates: CalendarDays,
  budget: Wallet,
  activities: Mountain,
};

/** Six chips that fill as the assistant learns about the trip. */
export const CriteriaTracker = ({ criteria }: { criteria: TripCriteria }) => {
  const known = CRITERIA.filter(({ key }) => criteria[key]).length;
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between px-0.5">
        <p className="eyebrow">Trip details</p>
        <p className="meta tabular">{known} / 6</p>
      </div>
      <div className="-mx-5 flex gap-1.5 overflow-x-auto px-5 scrollbar-hide">
        {CRITERIA.map(({ key, label }) => {
          const value = criteria[key];
          const Icon = value ? Check : ICONS[key];
          return (
            <span
              key={key}
              title={value ?? label}
              className={cn(
                "inline-flex h-8 max-w-[11rem] shrink-0 items-center gap-1.5 rounded-full border px-3 text-[12px] font-medium transition-colors duration-300",
                value ? "border-ink bg-ink text-ink-foreground" : "border-dashed border-border text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={value ? 2.5 : 1.75} />
              <span className="truncate">{value ?? label}</span>
            </span>
          );
        })}
      </div>
    </div>
  );
};

export const TypingDots = () => (
  <span className="inline-flex items-center gap-1 py-1" aria-label="Typing">
    {[0, 1, 2].map((i) => (
      <span key={i} className="h-2 w-2 animate-bounce rounded-full bg-muted-foreground/60" style={{ animationDelay: `${i * 0.15 - 0.3}s` }} />
    ))}
  </span>
);

/** Gradient shimmer shown while itineraries are generated. */
export const GeneratingCard = ({ stage, criteria }: { stage: 1 | 2; criteria: TripCriteria }) => (
  <div className="surface overflow-hidden p-0 animate-fade-in">
    <div className="space-y-3 p-4">
      <div className="flex items-center gap-2.5">
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-primary-foreground">
          <Compass className="h-4 w-4 animate-spin [animation-duration:3s]" />
        </span>
        <div>
          <p className="text-sm font-semibold">{stage === 1 ? "Generating itineraries…" : "Finding traveler favourites…"}</p>
          <p className="meta">Step {stage} of 2</p>
        </div>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-secondary">
        <div className="shimmer-bar absolute inset-0" />
      </div>
      <p className="text-[13px] text-muted-foreground">
        {[criteria.destination, criteria.party, criteria.dates, criteria.budget].filter(Boolean).join(" · ")}
      </p>
    </div>
  </div>
);
