import { useEffect, useState } from "react";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSavedTrips } from "@/features/planner/trips";
import { cn } from "@/lib/utils";

/** Pick a trip and a day, then add. Trips in the same city come first. */
export const AddToTrip = ({ city, onAdd, className, label = "Add" }: { city?: string; onAdd: (tripId: string, dayIndex: number) => void; className?: string; label?: string }) => {
  const { saved } = useSavedTrips();
  const trips = [...saved].sort((a, b) => Number(b.destinationName === city) - Number(a.destinationName === city));
  const [tripId, setTripId] = useState(trips[0]?.id ?? "");
  const [day, setDay] = useState("0");
  const trip = trips.find((t) => t.id === tripId);
  useEffect(() => {
    if (!trip && trips[0]) setTripId(trips[0].id);
  }, [trip, trips]);
  if (!trips.length) return <p className="text-[13px] text-muted-foreground">Create a trip first</p>;
  return (
    <div className={cn("flex items-center gap-2", className)}>
      <Select
        value={tripId}
        onValueChange={(v) => {
          setTripId(v);
          setDay("0");
        }}
      >
        <SelectTrigger className="h-9 min-w-0 flex-1 text-[13px]" aria-label="Trip">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {trips.map((t) => (
            <SelectItem key={t.id} value={t.id}>
              {t.title}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={day} onValueChange={setDay}>
        <SelectTrigger className="h-9 w-[92px] text-[13px]" aria-label="Day">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {(trip?.days ?? []).map((_, i) => (
            <SelectItem key={i} value={String(i)}>
              Day {i + 1}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Button size="sm" variant="secondary" className="h-9" onClick={() => trip && onAdd(trip.id, Number(day))}>
        <Plus />
        {label}
      </Button>
    </div>
  );
};
