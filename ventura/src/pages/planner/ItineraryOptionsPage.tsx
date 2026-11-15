import { useNavigate } from "react-router-dom";
import { MessagesSquare, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, TopBar } from "@/components/kit";
import { PlannerItineraryCard } from "@/components/planner/PlannerItineraryCard";
import { findTrip, readPlannerSession } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";

const ItineraryOptionsPage = () => {
  const navigate = useNavigate();
  const session = readPlannerSession();
  const ai = (session?.aiTripIds ?? []).map(findTrip).filter((t): t is PlannedTrip => !!t);
  const community = (session?.communityTripIds ?? []).map(findTrip).filter((t): t is PlannedTrip => !!t);

  if (!session || (!ai.length && !community.length)) {
    return (
      <div className="min-h-screen">
        <TopBar onBack={() => navigate("/plan-trip")} title="Your options" />
        <EmptyState
          icon={MessagesSquare}
          title="No itineraries yet"
          description="Chat with the planner and your options will appear here"
          action={
            <Button className="w-full" onClick={() => navigate("/plan-trip/chat")}>
              Start planning
            </Button>
          }
        />
      </div>
    );
  }

  const c = session.criteria;
  const summary = [c.destination, c.party, c.dates, c.budget].filter(Boolean).join(" · ");

  return (
    <div className="min-h-screen pb-16">
      <TopBar onBack={() => navigate("/plan-trip/chat")} title="Your options" />

      <div className="mx-auto max-w-2xl space-y-10 px-5">
        <header className="space-y-2 pt-2">
          <p className="eyebrow truncate">{summary || "Your trip"}</p>
          <h1 className="text-display text-[36px]">Your itinerary options</h1>
          <p className="text-[15px] text-muted-foreground">
            Three planned for you{session.provider ? ` by ${session.provider === "Claude" ? "Claude" : session.provider.toLowerCase()}` : ""}, three loved by
            fellow travelers. Save any of them to your profile.
          </p>
        </header>

        {ai.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="eyebrow">From the trip planner</p>
                <h2 className="text-title text-[22px]">Planned for you</h2>
              </div>
              <span className="meta">{ai.length} options</span>
            </div>
            <div className="space-y-5">
              {ai.map((t) => (
                <PlannerItineraryCard key={t.id} trip={t} />
              ))}
            </div>
          </section>
        )}

        {community.length > 0 && (
          <section className="space-y-4">
            <div className="flex items-center gap-3" aria-hidden>
              <span className="h-px flex-1 bg-border" />
              <Users className="h-4 w-4 text-muted-foreground" />
              <span className="h-px flex-1 bg-border" />
            </div>
            <div className="flex items-end justify-between">
              <div className="space-y-1">
                <p className="eyebrow">Community favourites</p>
                <h2 className="text-title text-[22px]">Loved by travelers</h2>
              </div>
              <span className="meta">{community.length} popular</span>
            </div>
            <div className="space-y-5">
              {community.map((t) => (
                <PlannerItineraryCard key={t.id} trip={t} />
              ))}
            </div>
          </section>
        )}

        <div className="space-y-2">
          <Button variant="outline" size="lg" className="w-full" onClick={() => navigate("/itinerary")}>
            View more itineraries
          </Button>
          <Button variant="ghost" className="w-full text-muted-foreground" onClick={() => navigate("/plan-trip/chat")}>
            Keep chatting
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ItineraryOptionsPage;
