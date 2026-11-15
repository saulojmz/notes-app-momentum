import { Guide, MeetupLocation, BookingPreferences } from "@/types/guide";
import { format } from "date-fns";
import { CalendarDays, Clock, MapPin, Users, type LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Rating, SmartImage, StickyFooter } from "@/components/kit";
import { StepIntro } from "./StepIntro";

interface BookingSummaryStepProps {
  guide: Guide;
  date: Date;
  time: string;
  duration: number;
  partySize: number;
  meetupLocation: MeetupLocation;
  preferences: BookingPreferences;
  onConfirm: () => void;
  onEdit: () => void;
}

const Row = ({ icon: Icon, label, value, sub }: { icon: LucideIcon; label: string; value: string; sub?: string }) => (
  <div className="flex items-start gap-3 px-4 py-3.5">
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-secondary text-muted-foreground">
      <Icon className="h-4 w-4" />
    </span>
    <div className="min-w-0">
      <p className="eyebrow">{label}</p>
      <p className="mt-0.5 text-[15px] font-medium">{value}</p>
      {sub && <p className="text-xs text-muted-foreground">{sub}</p>}
    </div>
  </div>
);

export const BookingSummaryStep = ({ guide, date, time, duration, partySize, meetupLocation, onConfirm, onEdit }: BookingSummaryStepProps) => {
  const totalCost = guide.hourlyRate * duration * partySize;
  const people = `${partySize} ${partySize === 1 ? "person" : "people"}`;

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-md flex-1 space-y-5 px-5 pb-8 pt-4">
        <StepIntro eyebrow="Almost there" title="Review your booking" />

        {/* Companion */}
        <div className="surface flex items-center gap-4 p-4">
          <SmartImage src={guide.avatar} alt={guide.name} className="h-14 w-14 rounded-2xl object-cover" />
          <div className="min-w-0 flex-1">
            <p className="text-title text-xl">{guide.name}</p>
            <div className="mt-1 flex items-center gap-2">
              <Rating value={guide.rating} count={guide.reviews} />
              <span className="meta">· £{guide.hourlyRate}/hr</span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="surface divide-y divide-border p-0">
          <Row icon={CalendarDays} label="Date" value={time === "ASAP" ? "Today" : format(date, "EEEE, MMMM d")} />
          <Row icon={Clock} label="Time" value={`${time === "ASAP" ? "Within ~30 min" : time} · ${duration} ${duration === 1 ? "hour" : "hours"}`} />
          <Row icon={MapPin} label="Meeting point" value={meetupLocation.name} sub={meetupLocation.address} />
          <Row icon={Users} label="Party" value={people} />
        </div>

        {/* Cost */}
        <div className="surface flex items-end justify-between p-5">
          <div>
            <p className="text-[13px] text-muted-foreground">Total</p>
            <p className="mt-1 tabular-nums text-xs text-muted-foreground">
              £{guide.hourlyRate} × {duration}h × {people}
            </p>
          </div>
          <p className="text-display text-[36px] tabular-nums">£{totalCost}</p>
        </div>
      </div>

      <StickyFooter className="space-y-1">
        <Button size="lg" className="mx-auto flex w-full max-w-md" onClick={onConfirm}>
          Confirm companion
        </Button>
        <Button variant="ghost" className="mx-auto flex w-full max-w-md text-muted-foreground" onClick={onEdit}>
          Edit details
        </Button>
      </StickyFooter>
    </div>
  );
};
