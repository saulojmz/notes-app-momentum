import { useState } from "react";
import { format } from "date-fns";
import { Camera, MapPin, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { EmptyState, SmartImage } from "@/components/kit";
import { findTrip, updateTrip } from "@/features/planner/trips";
import { newId } from "@/features/trips";
import { useSavedLandmarks } from "@/hooks/useSavedLandmarks";
import type { SavedLandmark } from "@/types/camera";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { AddToTrip } from "../components/AddToTrip";
import { Page, PageHeader } from "../Shell";

/** Landmarks captured with the phone's camera, to read and add to trips. */
const LibraryPage = () => {
  const { savedLandmarks } = useSavedLandmarks();
  const [region, setRegion] = useState("All");
  const [open, setOpen] = useState<SavedLandmark | null>(null);
  const regions = ["All", ...new Set(savedLandmarks.map((l) => l.region))];
  const list = savedLandmarks.filter((l) => region === "All" || l.region === region);

  const add = (l: SavedLandmark, tripId: string, dayIndex: number) => {
    const trip = findTrip(tripId);
    if (!trip) return;
    const d = trip.days[dayIndex];
    const last = d.stops[d.stops.length - 1];
    updateTrip({
      ...trip,
      days: trip.days.map((x, i) =>
        i === dayIndex
          ? {
              ...x,
              stops: [
                ...x.stops,
                {
                  id: newId("stop"),
                  name: l.name,
                  time: last ? `${String(Math.min(22, parseInt(last.time, 10) + 2)).padStart(2, "0")}:00` : "10:00",
                  duration: "1 hour",
                  description: l.summary,
                  category: "History",
                  coordinates: last?.coordinates ?? { lat: 0, lng: 0 },
                  mapQuery: `${l.name}, ${l.location}`,
                },
              ],
            }
          : x,
      ),
    });
    toast.success(`Added to day ${dayIndex + 1}`, { description: trip.title });
  };

  return (
    <Page wide>
      <PageHeader eyebrow="Captured with your phone" title="Discoveries">
        <div className="flex gap-1 rounded-[var(--radius-control)] bg-secondary p-1">
          {regions.map((r) => (
            <button
              key={r}
              type="button"
              aria-pressed={region === r}
              onClick={() => setRegion(r)}
              className={cn("h-8 rounded-[6px] px-3 text-[13px] font-medium transition-colors", region === r ? "bg-card text-foreground shadow-sm" : "text-muted-foreground hover:text-foreground")}
            >
              {r === "All" ? "All regions" : r}
            </button>
          ))}
        </div>
      </PageHeader>

      {!list.length ? (
        <EmptyState icon={Camera} title="No discoveries yet" description="Point the camera at a landmark on your phone to save it here" className="py-16" />
      ) : (
        <div className="grid grid-cols-[minmax(0,1fr)_auto] gap-10">
          <div className={cn("grid gap-x-6 gap-y-8", open ? "grid-cols-3" : "grid-cols-4")}>
            {list.map((l) => (
              <button key={l.id} type="button" onClick={() => setOpen(l)} className="group text-left">
                <SmartImage src={l.capturedImageUrl} alt="" className={cn("aspect-[4/5] w-full rounded-2xl object-cover", open?.id === l.id && "ring-[3px] ring-ink ring-offset-2 ring-offset-background")} />
                <p className="meta mt-3 tabular-nums">
                  {l.location} · {format(l.savedAt, "d MMM")}
                </p>
                <h3 className="mt-0.5 text-[17px] font-medium">{l.name}</h3>
              </button>
            ))}
          </div>

          {open && (
            <aside className="w-[380px] self-start">
              <section className="surface sticky top-6 overflow-hidden p-0" aria-label={open.name}>
                <div className="relative">
                  <SmartImage src={open.capturedImageUrl} alt="" className="aspect-[16/10] w-full object-cover" />
                  <Button variant="glass-dark" size="icon-sm" className="absolute right-3 top-3" aria-label="Close" onClick={() => setOpen(null)}>
                    <X />
                  </Button>
                </div>
                <div className="space-y-4 p-5">
                  <div>
                    <p className="eyebrow">{open.category}</p>
                    <h2 className="text-display mt-1 text-[32px] leading-tight">{open.name}</h2>
                    <p className="meta mt-1 flex items-center gap-1.5">
                      <MapPin className="h-3.5 w-3.5" strokeWidth={1.5} />
                      {open.location}
                    </p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground/85">{open.fullDescription || open.summary}</p>
                  {open.facts.length > 0 && (
                    <ul className="space-y-2 border-t border-border pt-4">
                      {open.facts.slice(0, 3).map((f) => (
                        <li key={f.id} className="text-sm">
                          <span className="font-medium">{f.title}. </span>
                          <span className="text-muted-foreground">{f.description}</span>
                        </li>
                      ))}
                    </ul>
                  )}
                  <div className="border-t border-border pt-4">
                    <p className="meta mb-2">Add to a trip</p>
                    <AddToTrip city={open.location.split(",")[0]} onAdd={(t, d) => add(open, t, d)} />
                  </div>
                </div>
              </section>
            </aside>
          )}
        </div>
      )}
    </Page>
  );
};

export default LibraryPage;
