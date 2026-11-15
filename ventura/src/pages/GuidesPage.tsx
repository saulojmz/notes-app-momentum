import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ChevronRight, MapPin, Plus, ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { GuideBookingModal } from "@/components/guides/GuideBookingModal";
import { useGuideBookings } from "@/hooks/useGuideBookings";
import { mockGuides } from "@/data/mockGuides";
import { SectionHeader, SmartImage } from "@/components/kit";

const steps = [
  { title: "Choose when", body: "Meet within ~30 minutes, or schedule for later in the week." },
  { title: "Pick a public spot", body: "Every meeting point is a busy, well-known place." },
  { title: "Explore together", body: "Verified locals, paid hourly. Share your plans with a friend." },
];

const GuidesPage = () => {
  const navigate = useNavigate();
  const [bookingModalOpen, setBookingModalOpen] = useState(false);
  const { getUpcomingBookings } = useGuideBookings();
  const upcomingBookings = getUpcomingBookings();
  const featured = mockGuides.slice(0, 4);

  return (
    <div className="pt-safe mx-auto min-h-screen max-w-2xl px-5">
      <header className="pb-6 pt-8">
        <p className="eyebrow">Local companions</p>
        <h1 className="text-display mt-2 text-[36px]">Your bookings</h1>
      </header>

      {upcomingBookings.length > 0 ? (
        <div className="space-y-3">
          <p className="eyebrow">Upcoming · {upcomingBookings.length}</p>
          <div className="space-y-3">
            {upcomingBookings.map((booking) => (
              <button
                key={booking.id}
                type="button"
                onClick={() => navigate(`/bookings/${booking.id}`)}
                className="press surface flex w-full items-center gap-4 p-3 pr-4 text-left transition-colors hover:border-foreground/20"
              >
                <SmartImage src={booking.guideAvatar} alt={booking.guideName} className="h-16 w-16 shrink-0 rounded-xl object-cover" />
                <div className="min-w-0 flex-1">
                  <p className="text-[13px] text-primary">
                    {format(booking.date, "EEE d MMM")} · {booking.time === "ASAP" ? "Now" : booking.time}
                  </p>
                  <p className="text-title mt-1 text-lg">{booking.guideName}</p>
                  <p className="mt-0.5 flex items-center gap-1 truncate text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3 shrink-0" />
                    {booking.meetupLocation.name}
                  </p>
                </div>
                <ChevronRight className="h-5 w-5 shrink-0 text-muted-foreground" />
              </button>
            ))}
          </div>
          <Button size="lg" variant="outline" onClick={() => setBookingModalOpen(true)} className="!mt-5 w-full">
            <Plus />
            Book another guide
          </Button>
        </div>
      ) : (
        <div className="surface relative overflow-hidden p-6">
          <div className="flex -space-x-3">
            {featured.map((g) => (
              <SmartImage key={g.id} src={g.avatar} alt={g.name} className="h-12 w-12 rounded-full border-2 border-card object-cover" />
            ))}
            <span className="flex h-12 w-12 items-center justify-center rounded-full border-2 border-card bg-secondary tabular-nums text-xs">
              +{mockGuides.length - featured.length}
            </span>
          </div>
          <h2 className="text-title mt-6 text-[28px]">No upcoming meetups</h2>
          <p className="mt-2 max-w-[32ch] text-[15px] text-muted-foreground">
            {mockGuides.length} verified locals are around Edinburgh today. Meet one now or book for later in the week.
          </p>
          <Button
            size="lg"
            className="mt-6 w-full"
            onClick={() => setBookingModalOpen(true)}
          >
            Book a guide
          </Button>
        </div>
      )}

      <section className="mt-12 space-y-5">
        <SectionHeader eyebrow="How it works" title="Meet a local, safely" />
        <ol className="space-y-5">
          {steps.map((s, i) => (
            <li key={s.title} className="flex gap-4">
              <span className="text-display w-8 shrink-0 text-[28px] tabular-nums text-muted-foreground">{i + 1}</span>
              <div className="border-b border-border pb-5">
                <p className="font-medium">{s.title}</p>
                <p className="mt-1 text-sm text-muted-foreground">{s.body}</p>
              </div>
            </li>
          ))}
        </ol>
        <p className="flex items-center gap-2 text-xs text-muted-foreground">
          <ShieldCheck className="h-4 w-4 text-success" />
          Every companion is ID-verified and reviewed by travelers.
        </p>
      </section>

      <GuideBookingModal open={bookingModalOpen} onOpenChange={setBookingModalOpen} />
    </div>
  );
};

export default GuidesPage;
