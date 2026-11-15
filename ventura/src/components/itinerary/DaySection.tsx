import { useState } from "react";
import { ChevronDown } from "lucide-react";
import { ItineraryDay } from "@/types/itinerary";
import { StopCard } from "./StopCard";
import { cn } from "@/lib/utils";

interface DaySectionProps {
  day: ItineraryDay;
  isExpanded?: boolean;
}

export const DaySection = ({ day, isExpanded = false }: DaySectionProps) => {
  const [expanded, setExpanded] = useState(isExpanded);
  const first = day.stops[0]?.time;

  return (
    <section className="border-b border-border last:border-b-0">
      <button
        type="button"
        onClick={() => setExpanded(!expanded)}
        aria-expanded={expanded}
        className="flex w-full items-center gap-4 py-5 text-left"
      >
        <span className="text-display w-12 shrink-0 text-[32px] tabular-nums text-foreground">
          {String(day.dayNumber).padStart(2, "0")}
        </span>
        <span className="min-w-0 flex-1">
          <span className="eyebrow block">Day {day.dayNumber}</span>
          <span className="text-title mt-1 block text-xl">{day.title}</span>
          <span className="meta mt-1 block">
            {day.stops.length} stops{first && ` · from ${first}`}
          </span>
        </span>
        <span
          className={cn(
            "flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-secondary transition-transform duration-300",
            expanded && "rotate-180",
          )}
        >
          <ChevronDown className="h-4 w-4" />
        </span>
      </button>

      {expanded && (
        <ol className="pb-8 animate-fade-in">
          {day.stops.map((stop, index) => (
            <StopCard key={stop.id} stop={stop} isLast={index === day.stops.length - 1} />
          ))}
        </ol>
      )}
    </section>
  );
};
