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

      <div className="mt-8 space-y-3">
        <button type="button" onClick={onSelectMeetNow} className="press surface group flex w-full items-center gap-4 p-5 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary">
            <Zap className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-title block text-xl">Meet now</span>
            <span className="mt-1 flex items-center gap-1.5 text-sm text-muted-foreground">
              <span className="h-2 w-2 rounded-full bg-success" />
              {available} locals free now
            </span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
        </button>

        <button type="button" onClick={onSelectSchedule} className="press surface group flex w-full items-center gap-4 p-5 text-left">
          <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
            <CalendarDays className="h-5 w-5" strokeWidth={1.5} />
          </span>
          <span className="min-w-0 flex-1">
            <span className="text-title block text-xl">Schedule</span>
            <span className="mt-1 block text-sm text-muted-foreground">Plan for later this week</span>
          </span>
          <ArrowRight className="h-5 w-5 shrink-0 text-muted-foreground" />
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
