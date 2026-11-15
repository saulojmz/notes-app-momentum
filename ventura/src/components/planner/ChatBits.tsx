import { Check, MapPin, Palette, Users, CalendarDays, Wallet, Mountain, type LucideIcon } from "lucide-react";
import { CRITERIA, type TripCriteria } from "@/features/planner/types";
import { cn } from "@/lib/utils";

const ICONS: Record<keyof TripCriteria, LucideIcon> = {
  destination: MapPin,
  vibe: Palette,
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
        <p className="meta tabular-nums">{known} of 6</p>
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
                "inline-flex h-8 max-w-[11rem] shrink-0 items-center gap-1.5 rounded-[var(--radius-chip)] border px-2.5 text-[13px] transition-colors duration-300",
                value ? "border-ink bg-ink text-ink-foreground" : "border-dashed border-border text-muted-foreground",
              )}
            >
              <Icon className="h-3.5 w-3.5 shrink-0" strokeWidth={value ? 2 : 1.5} />
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

/** Shown while itineraries are generated: a running track and the details being used. */
export const GeneratingCard = ({ stage, criteria }: { stage: 1 | 2; criteria: TripCriteria }) => (
  <div className="surface overflow-hidden p-0 animate-fade-in">
    <div className="space-y-3 p-4">
      <div className="flex items-baseline justify-between gap-3">
        <p className="text-[15px] font-medium">{stage === 1 ? "Drafting three itineraries" : "Finding traveler favourites"}</p>
        <p className="meta tabular-nums">Step {stage} of 2</p>
      </div>
      <div className="relative h-1 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label="Generating">
        <div className="progress-run rounded-full" />
      </div>
      <p className="text-[13px] text-muted-foreground">
        {[criteria.destination, criteria.party, criteria.dates, criteria.budget].filter(Boolean).join(" · ")}
      </p>
    </div>
  </div>
);
