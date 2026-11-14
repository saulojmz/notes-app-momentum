import { useState } from "react";
import { VibeType, BookingPreferences } from "@/types/guide";
import { activityTypes } from "@/data/mockGuides";
import { Slider } from "@/components/ui/slider";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Chip, StickyFooter } from "@/components/kit";
import { cn } from "@/lib/utils";
import { Field, StepIntro } from "./StepIntro";

interface PreferencesStepProps {
  onNext: (preferences: BookingPreferences) => void;
}

const VIBES: { id: VibeType; emoji: string; label: string }[] = [
  { id: "relaxed", emoji: "🧘", label: "Relaxed" },
  { id: "curious", emoji: "🧐", label: "Curious" },
  { id: "adventurous", emoji: "🧗", label: "Adventurous" },
];

const EnergySlider = ({ label, value, onChange, low, high }: { label: string; value: number; onChange: (v: number) => void; low: string; high: string }) => (
  <Field label={label} hint={`${value} / 5`}>
    <Slider value={[value]} onValueChange={([v]) => onChange(v)} max={5} min={1} step={1} aria-label={label} />
    <div className="flex justify-between text-xs text-muted-foreground">
      <span>{low}</span>
      <span>{high}</span>
    </div>
  </Field>
);

export const PreferencesStep = ({ onNext }: PreferencesStepProps) => {
  const [vibe, setVibe] = useState<VibeType>("curious");
  const [activity, setActivity] = useState<string>("");
  const [userEnergy, setUserEnergy] = useState<number>(3);
  const [companionEnergy, setCompanionEnergy] = useState<number>(3);
  const [notes, setNotes] = useState<string>("");

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-md flex-1 space-y-8 px-5 pb-8 pt-4">
        <StepIntro eyebrow="Preferences" title="What's the plan today?" />

        <Field label="Activity">
          <div className="flex flex-wrap gap-2">
            {activityTypes.map((type) => (
              <Chip key={type} size="sm" selected={activity === type} onClick={() => setActivity(type)}>
                {type}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Your mood">
          <div className="grid grid-cols-3 gap-2">
            {VIBES.map((v) => (
              <button
                key={v.id}
                type="button"
                aria-pressed={vibe === v.id}
                onClick={() => setVibe(v.id)}
                className={cn(
                  "press flex flex-col items-center gap-2 rounded-2xl border py-4 transition-colors",
                  vibe === v.id ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card hover:border-foreground/25",
                )}
              >
                <span className="text-3xl leading-none">{v.emoji}</span>
                <span className="text-xs font-medium">{v.label}</span>
              </button>
            ))}
          </div>
        </Field>

        <EnergySlider label="Your energy today" value={userEnergy} onChange={setUserEnergy} low="Chill" high="Outgoing" />
        <EnergySlider label="Companion's energy" value={companionEnergy} onChange={setCompanionEnergy} low="Chill" high="Outgoing" />

        <Field label="Notes" hint="optional">
          <Textarea value={notes} onChange={(e) => setNotes(e.target.value)} placeholder="Any special requests?" className="resize-none" />
        </Field>
      </div>

      <StickyFooter>
        <Button
          size="lg"
          className="mx-auto flex w-full max-w-md"
          disabled={!activity}
          onClick={() => activity && onNext({ vibe, activity, userEnergy, companionEnergy, notes })}
        >
          {activity ? "See available companions" : "Pick an activity to continue"}
        </Button>
      </StickyFooter>
    </div>
  );
};
