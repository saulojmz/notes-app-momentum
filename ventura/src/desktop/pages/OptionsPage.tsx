import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { MessagesSquare, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, Segmented, SmartImage } from "@/components/kit";
import { findTrip, readPlannerSession, saveTrip } from "@/features/planner/trips";
import type { PlannedTrip } from "@/features/planner/types";
import { currencyFor } from "@/features/trips";
import { toast } from "sonner";
import { Page, PageHeader } from "../Shell";

type Group = "ai" | "community";

const Row = ({ label, children }: { label: string; children: React.ReactNode }) => (
  <div className="border-t border-border px-5 py-3.5">
    <dt className="meta">{label}</dt>
    <dd className="mt-1 text-sm leading-relaxed">{children}</dd>
  </div>
);

/** Save a generated trip into the traveler's own trips and open the editor. */
export const keepTrip = (t: PlannedTrip, navigate: (to: string) => void) => {
  saveTrip({ ...t, currency: currencyFor(t), stays: t.stays ?? [], transport: t.transport ?? [] });
  toast.success("Saved to your trips", { description: "Add dates, stays and transport" });
  navigate(`/trips/${t.id}`);
};

const OptionsPage = () => {
  const navigate = useNavigate();
  const session = readPlannerSession();
  const [group, setGroup] = useState<Group>("ai");

  if (!session) {
    return (
      <EmptyState
        className="h-full justify-center"
        icon={MessagesSquare}
        title="No options yet"
        description="Describe a trip to the planner and your options show up here"
        action={<Button onClick={() => navigate("/plan")}>Start planning</Button>}
      />
    );
  }

  const ids = group === "ai" ? session.aiTripIds : session.communityTripIds;
  const trips = ids.map((id) => findTrip(id)).filter(Boolean) as PlannedTrip[];
  const c = session.criteria;
  const summary = [c.destination, c.party, c.dates, c.budget].filter(Boolean).join(" · ");

  return (
    <Page wide>
      <PageHeader eyebrow={summary || "Your trip"} title="Compare your options">
        <Button variant="outline" onClick={() => navigate("/plan")}>
          <MessagesSquare />
          Back to the conversation
        </Button>
      </PageHeader>
      <Segmented<Group>
        label="Which options"
        value={group}
        onChange={setGroup}
        className="mb-6 w-[360px]"
        options={[
          { value: "ai", label: "Planned for you" },
          { value: "community", label: "Loved by travelers" },
        ]}
      />

      <div className="grid grid-cols-3 gap-6">
        {trips.map((t) => (
          <article key={t.id} className="surface flex flex-col overflow-hidden p-0">
            <SmartImage src={t.imageUrl} alt="" className="aspect-[16/9] w-full object-cover" />
            <div className="space-y-1 px-5 py-4">
              <p className="meta">
                {t.destinationName}
                {t.country ? `, ${t.country}` : ""}
              </p>
              <h2 className="text-title text-xl leading-snug">{t.title}</h2>
            </div>
            <dl className="flex-1">
              <Row label="Length and budget">
                <span className="tabular-nums">
                  {t.days.length} days · {t.budget || "Budget not set"}
                </span>
              </Row>
              {t.review && (
                <Row label="Travelers say">
                  <span className="flex items-center gap-1.5 tabular-nums">
                    <Star className="h-3.5 w-3.5 fill-highlight text-highlight" strokeWidth={0} />
                    {t.review.rating.toFixed(1)} from {t.review.reviewCount} reviews
                  </span>
                  <span className="mt-1 block text-muted-foreground">“{t.review.snippet}”</span>
                </Row>
              )}
              <Row label="Must-dos">{t.keyActivities.slice(0, 4).join(", ") || "None listed"}</Row>
              <Row label="Where to stay">{t.housing.slice(0, 2).join(", ") || "Not suggested"}</Row>
              <Row label="Day by day">
                <ol className="space-y-1">
                  {t.days.slice(0, 7).map((d) => (
                    <li key={d.dayNumber} className="flex gap-2">
                      <span className="w-10 shrink-0 tabular-nums text-muted-foreground">Day {d.dayNumber}</span>
                      <span className="truncate">{d.title}</span>
                    </li>
                  ))}
                  {t.days.length > 7 && <li className="text-muted-foreground">and {t.days.length - 7} more</li>}
                </ol>
              </Row>
            </dl>
            <div className="flex gap-2 border-t border-border p-4">
              <Button variant="secondary" className="flex-1" onClick={() => navigate(`/explore/itinerary/${t.id}`)}>
                Open
              </Button>
              <Button className="flex-1" onClick={() => keepTrip(t, navigate)}>
                Save and edit
              </Button>
            </div>
          </article>
        ))}
      </div>
    </Page>
  );
};

export default OptionsPage;
