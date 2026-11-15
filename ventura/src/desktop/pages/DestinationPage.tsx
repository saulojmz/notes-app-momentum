import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { ChevronRight, Compass, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EmptyState, Segmented, SmartImage } from "@/components/kit";
import { itineraries } from "@/data/mockItineraries";
import { catalog, parseHighlight } from "@/features/planner/catalog";
import { tripFromCatalog } from "@/features/planner/builder";
import { saveTrip } from "@/features/planner/trips";
import { isoDay } from "@/features/trips";
import { toast } from "sonner";
import { Page } from "../Shell";

const COST = { 1: "Budget", 2: "Mid-range", 3: "Splurge" } as const;
const TRANSIT = { great: "Walk and public transport", good: "Public transport mostly", car: "Best with a car" } as const;
const cap = (s: string) => s[0].toUpperCase() + s.slice(1);

const DestinationPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dest = catalog.find((d) => d.id === id);
  const [days, setDays] = useState("4");
  const [start, setStart] = useState(isoDay(new Date(Date.now() + 1000 * 60 * 60 * 24 * 45)));

  if (!dest) {
    return (
      <EmptyState
        className="h-full justify-center"
        icon={Compass}
        title="Place not found"
        description="It may have moved, or the link is out of date"
        action={<Button onClick={() => navigate("/explore?tab=destinations")}>Back to places</Button>}
      />
    );
  }

  const its = itineraries.filter((i) => i.destinationId === dest.venturaId);
  const create = () => {
    const trip = tripFromCatalog(dest, { source: "custom", days: Number(days) });
    const mine = { ...trip, title: `${dest.name} trip`, author: { name: "Alex Turner", avatar: "" }, startDate: start || undefined, currency: "£", stays: [], transport: [] };
    saveTrip(mine);
    toast.success("Trip created", { description: "We drafted the days from the highlights" });
    navigate(`/trips/${mine.id}`);
  };

  return (
    <Page wide className="pt-8">
      <nav className="mb-4 flex items-center gap-1.5 text-[13px] text-muted-foreground" aria-label="Breadcrumb">
        <Link to="/explore?tab=destinations" className="hover:text-foreground">
          Explore
        </Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-foreground">{dest.name}</span>
      </nav>

      <div className="relative h-[300px] overflow-hidden rounded-2xl bg-secondary">
        <SmartImage src={dest.image} alt="" className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-b absolute inset-0" />
        <div className="absolute inset-x-0 bottom-0 p-8 text-on-image">
          <p className="text-sm text-on-image/80">
            {dest.country} · {dest.continent}
          </p>
          <h1 className="text-display mt-1 text-[56px] leading-none">{dest.name}</h1>
        </div>
      </div>

      <div className="mt-10 grid grid-cols-[minmax(0,1fr)_360px] gap-12">
        <div className="space-y-10">
          <p className="max-w-[60ch] text-[19px] leading-relaxed">{dest.blurb}</p>
          <dl className="grid grid-cols-4 gap-6 border-y border-border py-5">
            {[
              { k: "Budget", v: COST[dest.cost] },
              { k: "Weather", v: dest.climate.map(cap).join(", ") },
              { k: "Setting", v: dest.setting.map(cap).join(", ") },
              { k: "Getting around", v: TRANSIT[dest.transit] },
            ].map(({ k, v }) => (
              <div key={k}>
                <dt className="meta">{k}</dt>
                <dd className="mt-1 text-sm">{v}</dd>
              </div>
            ))}
          </dl>

          <section className="space-y-4">
            <h2 className="text-title text-2xl">Highlights</h2>
            <ol className="grid grid-cols-2 gap-x-8">
              {dest.highlights.map((h, i) => {
                const { title, kind } = parseHighlight(h);
                return (
                  <li key={h} className="flex items-baseline gap-3 border-b border-border py-3">
                    <span className="w-5 text-right text-xs tabular-nums text-muted-foreground">{i + 1}</span>
                    <span className="min-w-0 flex-1 text-[15px]">{title}</span>
                    <span className="text-xs text-muted-foreground">{cap(kind)}</span>
                  </li>
                );
              })}
            </ol>
          </section>

          {its.length > 0 && (
            <section className="space-y-4">
              <h2 className="text-title text-2xl">Itineraries for {dest.name}</h2>
              <div className="grid grid-cols-2 gap-6">
                {its.map((it) => (
                  <button key={it.id} type="button" onClick={() => navigate(`/explore/itinerary/${it.id}`)} className="surface flex gap-4 p-3 text-left transition-colors hover:border-foreground/20">
                    <SmartImage src={it.imageUrl} alt="" className="h-20 w-24 shrink-0 rounded-xl object-cover" />
                    <span className="min-w-0">
                      <span className="block font-medium leading-snug">{it.title}</span>
                      <span className="mt-1 flex items-center gap-1.5 text-[13px] tabular-nums text-muted-foreground">
                        <Star className="h-3.5 w-3.5 fill-highlight text-highlight" strokeWidth={0} />
                        {it.rating.toFixed(1)} · {it.duration} days · {it.author.name}
                      </span>
                    </span>
                  </button>
                ))}
              </div>
            </section>
          )}
        </div>

        <aside className="self-start">
          <section className="surface sticky top-6 space-y-5 p-5">
            <h2 className="text-title text-xl">Plan a trip here</h2>
            <div className="space-y-2">
              <Label>How long</Label>
              <Segmented<string>
                label="Trip length"
                value={days}
                onChange={setDays}
                options={["3", "4", "5", "7"].map((d) => ({ value: d, label: `${d} days` }))}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="dest-start">Start date</Label>
              <Input id="dest-start" type="date" value={start} onChange={(e) => setStart(e.target.value)} />
            </div>
            <Button className="w-full" onClick={create}>
              Create trip
            </Button>
            <p className="text-[13px] text-muted-foreground">
              Or{" "}
              <Link to="/plan" className="text-foreground underline decoration-foreground/30 underline-offset-4">
                describe the trip to the planner
              </Link>{" "}
              and compare a few versions first.
            </p>
          </section>
        </aside>
      </div>
    </Page>
  );
};

export default DestinationPage;
