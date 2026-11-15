import { format } from "date-fns";
import { Smartphone, Ticket } from "lucide-react";
import { EmptyState, SmartImage } from "@/components/kit";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { cn } from "@/lib/utils";
import { Page, PageHeader } from "../Shell";

/** Read-only: guides are booked and managed on the phone, where the safety features live. */
const BookingsPage = () => {
  const { bookings } = useGuideBookings();
  const start = new Date();
  start.setHours(0, 0, 0, 0);
  const sorted = [...bookings].sort((a, b) => +new Date(a.date) - +new Date(b.date));

  return (
    <Page>
      <PageHeader eyebrow="Local companions" title="Guide bookings" />
      <div className="mb-8 flex items-start gap-3 rounded-xl bg-secondary px-4 py-3.5 text-sm">
        <Smartphone className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" strokeWidth={1.5} />
        <p>
          Book, change and contact guides in the Ventura app on your phone.{" "}
          <span className="text-muted-foreground">That's where you share your live plans with them and reach the emergency line. Bookings show here so you can plan around them.</span>
        </p>
      </div>

      {!sorted.length ? (
        <EmptyState icon={Ticket} title="No bookings yet" description="Meet a verified local from the Guides tab on your phone" className="py-16" />
      ) : (
        <div className="surface overflow-hidden p-0">
          <table className="w-full text-left text-sm">
            <thead>
              <tr className="border-b border-border text-xs text-muted-foreground">
                <th className="px-5 py-3 font-normal">Guide</th>
                <th className="px-5 py-3 font-normal">When</th>
                <th className="px-5 py-3 font-normal">Meeting point</th>
                <th className="px-5 py-3 font-normal">Plan</th>
                <th className="px-5 py-3 text-right font-normal">Total</th>
                <th className="px-5 py-3 font-normal">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {sorted.map((b) => {
                const past = new Date(b.date) < start;
                return (
                  <tr key={b.id} className={cn(past && "text-muted-foreground")}>
                    <td className="px-5 py-3.5">
                      <span className="flex items-center gap-3">
                        <SmartImage src={b.guideAvatar} alt="" className="h-9 w-9 rounded-full object-cover" />
                        <span className="font-medium text-foreground">{b.guideName}</span>
                      </span>
                    </td>
                    <td className="px-5 py-3.5 tabular-nums">
                      {format(new Date(b.date), "EEE d MMM")} · {b.time} · {b.duration} h
                    </td>
                    <td className="px-5 py-3.5">{b.meetupLocation.name}</td>
                    <td className="px-5 py-3.5">{b.preferences.activity}</td>
                    <td className="px-5 py-3.5 text-right tabular-nums">£{b.totalCost}</td>
                    <td className="px-5 py-3.5">
                      <span className="inline-flex items-center gap-1.5">
                        <span className={cn("h-1.5 w-1.5 rounded-full", past ? "bg-muted-foreground/50" : "bg-success")} />
                        {past ? "Done" : "Confirmed"}
                      </span>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </Page>
  );
};

export default BookingsPage;
