import { GuideBooking } from "@/types/guide";
import { Check } from "lucide-react";
import { Button } from "@/components/ui/button";
import { StickyFooter } from "@/components/kit";
import { BookingTicket, SafetyActions } from "./BookingTicket";

interface BookingConfirmedStepProps {
  booking: GuideBooking;
  onViewBookings: () => void;
}

export const BookingConfirmedStep = ({ booking, onViewBookings }: BookingConfirmedStepProps) => (
  <div className="flex min-h-full flex-col">
    <div className="mx-auto w-full max-w-md flex-1 space-y-6 px-5 pb-8 pt-6">
      <div className="text-center animate-scale-in">
        <span className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-success text-success-foreground">
          <Check className="h-8 w-8" strokeWidth={2.5} />
        </span>
        <h2 className="text-display mt-5 text-[36px]">You're all set</h2>
        <p className="mt-2 text-[15px] text-muted-foreground">
          {booking.guideName.split(" ")[0]} will meet you at {booking.meetupLocation.name}.
        </p>
      </div>

      <BookingTicket booking={booking} />
      <SafetyActions />
    </div>

    <StickyFooter>
      <Button size="lg" className="mx-auto flex w-full max-w-md" onClick={onViewBookings}>
        View your bookings
      </Button>
    </StickyFooter>
  </div>
);
