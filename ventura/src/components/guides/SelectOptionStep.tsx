import { CalendarDays, Zap, ShieldCheck, Languages, ArrowRight } from "lucide-react";
import { mockGuides } from "@/data/mockGuides";
import { StepIntro } from "./StepIntro";

interface SelectOptionStepProps {
  onSelectSchedule: () => void;
  onSelectMeetNow: () => void;
  onCheckBookings: () => void;
}

export const SelectOptionStep = ({ onSelectSchedule, onSelectMeetNow, onCheckBookings }: SelectOptionStepProps) => {
  const available = mockGuides.filter((g) => g.available).length;

  return (
    <div className="mx-auto flex min-h-full max-w-md flex-col px-5 pb-8 pt-4">
      <StepIntro eyebrow="Edinburgh · today" title="When would you like to meet?" />

      <div className="stagger mt-8 space-y-3">
        <button type="button" onClick={onSelectMeetNow} className="press surface-ink group flex w-full items-center gap-4 p-5 text-left shadow-md">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-ink-foreground/10">
            <Zap className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-title block text-2xl">Meet now</span>
            <span className="mt-1 flex items-center gap-1.5 text-sm text-ink-muted">
              <span className="relative flex h-2 w-2">
                <span className="absolute inset-0 rounded-full bg-success animate-marker-pulse" />
                <span className="relative h-2 w-2 rounded-full bg-success" />
              </span>
              {available} locals free within ~30 min
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 transition-transform group-hover:translate-x-1" />
        </button>

        <button type="button" onClick={onSelectSchedule} className="press surface group flex w-full items-center gap-4 p-5 text-left">
          <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-primary/10 text-primary">
            <CalendarDays className="h-6 w-6" strokeWidth={1.75} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-title block text-2xl">Schedule</span>
            <span className="mt-1 block text-sm text-muted-foreground">Plan for later this week</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground transition-transform group-hover:translate-x-1" />
        </button>
      </div>

      <div className="mt-auto space-y-5 pt-10">
        <div className="flex items-center justify-center gap-5 text-xs text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <ShieldCheck className="h-4 w-4 text-success" />
            Verified locals
          </span>
          <span className="flex items-center gap-1.5">
            <Languages className="h-4 w-4 text-info" />
            English speakers
          </span>
        </div>
        <button
          type="button"
          onClick={onCheckBookings}
          className="mx-auto block text-sm font-medium text-muted-foreground underline-offset-4 hover:text-foreground hover:underline"
        >
          Check my bookings
        </button>
      </div>
    </div>
  );
};
