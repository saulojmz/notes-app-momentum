import { useState } from "react";
import { Minus, Plus } from "lucide-react";
import { Calendar } from "@/components/ui/calendar";
import { Button } from "@/components/ui/button";
import { Chip, Segmented, StickyFooter } from "@/components/kit";
import { Field, StepIntro } from "./StepIntro";

interface SchedulingStepProps {
  onNext: (data: { date: Date; time: string; duration: number; partySize: number }) => void;
}

const TIME_SLOTS = ["9:00 AM", "11:00 AM", "2:00 PM", "5:00 PM", "7:00 PM"];
const DURATIONS = ["1", "2", "3", "4"] as const;

export const SchedulingStep = ({ onNext }: SchedulingStepProps) => {
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>("");
  const [duration, setDuration] = useState<string>("2");
  const [partySize, setPartySize] = useState<number>(1);

  const canProceed = !!selectedDate && !!selectedTime;
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return (
    <div className="flex min-h-full flex-col">
      <div className="mx-auto w-full max-w-md flex-1 space-y-8 px-5 pb-8 pt-4">
        <StepIntro eyebrow="Schedule" title="Set your plans" />

        <Field label="Date">
          <div className="surface p-3">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              disabled={(date) => date < today}
              className="pointer-events-auto w-full p-0"
            />
          </div>
        </Field>

        <Field label="Start time">
          <div className="grid grid-cols-3 gap-2">
            {TIME_SLOTS.map((time) => (
              <Chip key={time} selected={selectedTime === time} onClick={() => setSelectedTime(time)} className="justify-center tabular-nums">
                {time}
              </Chip>
            ))}
          </div>
        </Field>

        <Field label="Duration">
          <Segmented
            label="Duration"
            value={duration}
            onChange={setDuration}
            options={DURATIONS.map((h) => ({ value: h, label: `${h} hr` }))}
          />
        </Field>

        <Field label="Party size">
          <div className="surface flex items-center justify-between p-2 pl-4">
            <span className="text-[15px]">
              {partySize} {partySize === 1 ? "person" : "people"}
            </span>
            <div className="flex items-center gap-1">
              <Button variant="secondary" size="icon-sm" onClick={() => setPartySize(Math.max(1, partySize - 1))} aria-label="Fewer people">
                <Minus />
              </Button>
              <Button variant="secondary" size="icon-sm" onClick={() => setPartySize(Math.min(6, partySize + 1))} aria-label="More people">
                <Plus />
              </Button>
            </div>
          </div>
        </Field>

        <p className="text-center text-xs text-muted-foreground">
          Companions are paid hourly. You won't be charged until confirmed.
        </p>
      </div>

      <StickyFooter>
        <Button
          size="lg"
          className="mx-auto flex w-full max-w-md"
          disabled={!canProceed}
          onClick={() =>
            canProceed && onNext({ date: selectedDate!, time: selectedTime, duration: Number(duration), partySize })
          }
        >
          Continue
        </Button>
      </StickyFooter>
    </div>
  );
};
