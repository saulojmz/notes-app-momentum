import { format } from "date-fns";
import { MapPin, MessageCircle, Share, PhoneCall, ChevronRight } from "lucide-react";
import type { GuideBooking } from "@/types/guide";
import { Button } from "@/components/ui/button";
import { SmartImage } from "@/components/kit";
import { toast } from "sonner";
import edinburghMap from "@/assets/edinburgh-map.jpg";

interface BookingTicketProps {
  booking: GuideBooking;
  showTotal?: boolean;
}

/** Boarding-pass style summary of a confirmed meetup. */
export const BookingTicket = ({ booking, showTotal }: BookingTicketProps) => {
  const rows = [
    { label: "Date", value: format(booking.date, "EEE, MMM d") },
    { label: "Time", value: booking.time },
    { label: "Duration", value: `${booking.duration} ${booking.duration === 1 ? "hour" : "hours"}` },
    { label: "Party", value: `${booking.partySize} ${booking.partySize === 1 ? "person" : "people"}` },
  ];

  return (
    <div className="surface overflow-hidden p-0">
      {/* Map with pin */}
      <div className="relative h-36 overflow-hidden bg-secondary">
        <img src={edinburghMap} alt="" className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.55)_sepia(0.06)]" />
        <span
          className="absolute -translate-x-1/2 -translate-y-1/2"
          style={{ left: booking.meetupLocation.position.x, top: booking.meetupLocation.position.y }}
        >
          <span className="absolute inset-0 rounded-full bg-primary animate-marker-pulse" />
          <span className="relative flex h-9 w-9 items-center justify-center rounded-full border-[2.5px] border-card bg-primary text-primary-foreground shadow-float">
            <MapPin className="h-4 w-4" />
          </span>
        </span>
      </div>
      <div className="border-b border-border px-4 py-3">
        <p className="eyebrow">Meeting point</p>
        <p className="mt-0.5 font-semibold">{booking.meetupLocation.name}</p>
        <p className="text-xs text-muted-foreground">{booking.meetupLocation.address}</p>
      </div>

      {/* Companion */}
      <div className="flex items-center gap-3 px-4 py-4">
        <SmartImage src={booking.guideAvatar} alt={booking.guideName} className="h-12 w-12 rounded-full object-cover" />
        <div className="min-w-0 flex-1">
          <p className="font-semibold">{booking.guideName}</p>
          <p className="text-xs text-muted-foreground">Your companion</p>
        </div>
        <Button variant="secondary" size="sm" onClick={() => toast("Messaging is coming soon")}>
          <MessageCircle />
          Contact
        </Button>
      </div>

      {/* Perforation */}
      <div className="relative h-0 border-t border-dashed border-border">
        <span className="absolute -left-2.5 -top-2.5 h-5 w-5 rounded-full bg-background" />
        <span className="absolute -right-2.5 -top-2.5 h-5 w-5 rounded-full bg-background" />
      </div>

      <dl className="grid grid-cols-2 gap-x-4 gap-y-4 px-4 py-5">
        {rows.map(({ label, value }) => (
          <div key={label}>
            <dt className="eyebrow">{label}</dt>
            <dd className="mt-1 text-[15px] font-medium tabular">{value}</dd>
          </div>
        ))}
        {showTotal && (
          <div className="col-span-2 flex items-baseline justify-between border-t border-border pt-4">
            <dt className="eyebrow">Total</dt>
            <dd className="text-title text-2xl tabular">£{booking.totalCost}</dd>
          </div>
        )}
      </dl>
    </div>
  );
};

/** Safety shortcuts shown with every booking. */
export const SafetyActions = () => (
  <div className="space-y-3">
    <p className="eyebrow">Safety</p>
    <div className="surface divide-y divide-border overflow-hidden p-0">
      {[
        { icon: Share, label: "Share booking with a friend", hint: "Send your plans and live location" },
        { icon: PhoneCall, label: "Emergency help line", hint: "24/7 · connects to local services" },
      ].map(({ icon: Icon, label, hint }) => (
        <button
          key={label}
          type="button"
          onClick={() => toast(label)}
          className="flex w-full items-center gap-3 px-4 py-3.5 text-left transition-colors hover:bg-accent/50"
        >
          <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-secondary">
            <Icon className="h-4 w-4" />
          </span>
          <span className="min-w-0 flex-1">
            <span className="block text-sm font-medium">{label}</span>
            <span className="block text-xs text-muted-foreground">{hint}</span>
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </button>
      ))}
    </div>
  </div>
);
