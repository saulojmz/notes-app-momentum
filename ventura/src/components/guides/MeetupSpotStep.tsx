import { useState } from "react";
import { MeetupLocation } from "@/types/guide";
import { meetupLocations } from "@/data/mockGuides";
import { Check, MapPin } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyFooter } from "@/components/kit";
import { cn } from "@/lib/utils";
import { StepIntro } from "./StepIntro";
import edinburghMap from "@/assets/edinburgh-map.jpg";

interface MeetupSpotStepProps {
  onNext: (location: MeetupLocation) => void;
}

export const MeetupSpotStep = ({ onNext }: MeetupSpotStepProps) => {
  const [selected, setSelected] = useState<MeetupLocation | null>(null);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-8 pt-4">
        <StepIntro eyebrow="Meeting point" title="Where should you meet?" description="All spots are busy, public places" />

        {/* Map */}
        <div className="relative h-64 overflow-hidden rounded-2xl bg-secondary shadow-sm">
          <img src={edinburghMap} alt="Map of meeting points" className="h-full w-full object-cover [filter:saturate(0.55)_sepia(0.06)]" />
          {meetupLocations.map((location) => {
            const isSelected = selected?.id === location.id;
            return (
              <button
                key={location.id}
                type="button"
                onClick={() => setSelected(location)}
                aria-label={location.name}
                className="absolute -translate-x-1/2 -translate-y-1/2"
                style={{ left: location.position.x, top: location.position.y }}
              >
                <span
                  className={cn(
                    "flex items-center justify-center rounded-full border-[2.5px] border-card shadow-float transition-colors",
                    isSelected ? "h-10 w-10 bg-primary text-primary-foreground" : "h-7 w-7 bg-ink text-ink-foreground",
                  )}
                >
                  <MapPin className={isSelected ? "h-4 w-4" : "h-3 w-3"} />
                </span>
                {isSelected && (
                  <span className="absolute left-1/2 top-full mt-1.5 -translate-x-1/2 whitespace-nowrap rounded-full bg-ink px-2.5 py-1 text-[11px] font-medium text-ink-foreground shadow-float">
                    {location.name}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* List */}
        <div role="radiogroup" aria-label="Meeting points" className="surface divide-y divide-border overflow-hidden p-0">
          {meetupLocations.map((location) => {
            const isSelected = selected?.id === location.id;
            return (
              <button
                key={location.id}
                type="button"
                role="radio"
                aria-checked={isSelected}
                onClick={() => setSelected(location)}
                className={cn("flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors", isSelected ? "bg-primary/5" : "hover:bg-accent/40")}
              >
                <span className="min-w-0 flex-1">
                  <span className="block text-sm font-medium">{location.name}</span>
                  <span className="block truncate text-xs text-muted-foreground">{location.address}</span>
                </span>
                <span
                  className={cn(
                    "flex h-6 w-6 shrink-0 items-center justify-center rounded-full border transition-colors",
                    isSelected ? "border-primary bg-primary text-primary-foreground" : "border-input",
                  )}
                >
                  {isSelected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <StickyFooter>
        <Button size="lg" className="mx-auto flex w-full max-w-md" disabled={!selected} onClick={() => selected && onNext(selected)}>
          Confirm meeting spot
        </Button>
      </StickyFooter>
    </div>
  );
};
