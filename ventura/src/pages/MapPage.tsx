import { useState } from "react";
import { Shield, CalendarDays, UtensilsCrossed, Coffee, Search, Plus, Minus, LocateFixed, SlidersHorizontal } from "lucide-react";
import { FilterType, SafetyLevel, TimeOfDay, EventTimeFilter, MapMarker } from "@/types/map";
import { eventsMarkers, foodMarkers, cafesMarkers } from "@/data/mockMapData";
import { MapMarkerIcon } from "@/components/map/MapMarkerIcon";
import { SafetyOverlay } from "@/components/map/SafetyOverlay";
import { HeatMapCanvas } from "@/components/map/HeatMapCanvas";
import { MarkerDetailSheet } from "@/components/map/MarkerDetailSheet";
import { Chip, Segmented } from "@/components/kit";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import edinburghMap from "@/assets/edinburgh-map.jpg";

const filters = [
  { id: "safety" as FilterType, label: "Safety", icon: Shield },
  { id: "events" as FilterType, label: "Events", icon: CalendarDays },
  { id: "food" as FilterType, label: "Food", icon: UtensilsCrossed },
  { id: "cafes" as FilterType, label: "Cafés", icon: Coffee },
];

const eventTimeFilters: { value: EventTimeFilter; label: string }[] = [
  { value: "today", label: "Today" },
  { value: "this-week", label: "This week" },
  { value: "weekend", label: "Weekend" },
];

const safetyLegend = [
  { label: "Safe", className: "bg-success" },
  { label: "Caution", className: "bg-warning" },
  { label: "Avoid", className: "bg-destructive" },
];

// Simulated current location in Edinburgh (Old Town)
const currentLocation = {
  area: "Old Town",
  riskDay: "safe" as SafetyLevel,
  riskNight: "safe" as SafetyLevel,
};

const MapPage = () => {
  const [activeFilter, setActiveFilter] = useState<FilterType | null>(null);
  const [timeOfDay, setTimeOfDay] = useState<TimeOfDay>("day");
  const [eventTimeFilter, setEventTimeFilter] = useState<EventTimeFilter>("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMarker, setSelectedMarker] = useState<MapMarker | null>(null);

  // Filters are exclusive: tapping the active one clears it.
  const toggleFilter = (id: FilterType) => setActiveFilter((prev) => (prev === id ? null : id));

  const markers: MapMarker[] = (() => {
    switch (activeFilter) {
      case "events":
        return eventsMarkers.filter((m) => {
          if (eventTimeFilter === "today") return m.date === "Today";
          if (eventTimeFilter === "weekend") return m.date === "This Weekend";
          return m.date === "This Week" || m.date === "Today";
        });
      case "food":
        return foodMarkers;
      case "cafes":
        return cafesMarkers;
      default:
        return [];
    }
  })();

  const riskLevel = timeOfDay === "day" ? currentLocation.riskDay : currentLocation.riskNight;
  // Lift the recenter button above whichever bottom panel is showing.
  const panelOffset = activeFilter === "safety" ? "7.75rem" : activeFilter === "events" ? "6.5rem" : null;

  return (
    <div className="relative h-[100dvh] overflow-hidden bg-secondary">
      {/* Base map */}
      <img
        src={edinburghMap}
        alt="Map of central Edinburgh"
        className="absolute inset-0 h-full w-full object-cover [filter:saturate(0.55)_sepia(0.06)]"
      />

      {activeFilter === "safety" && <HeatMapCanvas timeOfDay={timeOfDay} />}

      {/* You are here */}
      <div className="absolute left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2" aria-label="Your location">
        <span className="absolute inset-0 rounded-full bg-primary animate-marker-pulse" />
        <span className="relative block h-4 w-4 rounded-full border-[3px] border-card bg-primary shadow-float" />
      </div>

      {/* Markers */}
      {markers.map((marker, i) => (
        <button
          key={marker.id}
          type="button"
          aria-label={marker.name}
          className="absolute z-20 -translate-x-1/2 -translate-y-full animate-fade-scale-in transition-transform"
          style={{ left: marker.position.x, top: marker.position.y, animationDelay: `${i * 40}ms` }}
          onClick={() => setSelectedMarker(marker)}
        >
          <MapMarkerIcon type={marker.type} category={marker.category} selected={selectedMarker?.id === marker.id} />
        </button>
      ))}

      {/* Top: search + filters */}
      <div className="top-safe absolute inset-x-0 z-40 space-y-3 px-4">
        <div className="flex items-center gap-2">
          <label className="glass flex h-12 flex-1 items-center gap-3 rounded-xl px-4">
            <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
            <input
              placeholder="Search a place, area or address"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
            />
          </label>
          <Button variant="glass" size="icon" className="h-12 w-12" aria-label="Map settings">
            <SlidersHorizontal />
          </Button>
        </div>

        <div className="-mx-4 flex gap-2 overflow-x-auto px-4 pb-1 scrollbar-hide">
          {filters.map(({ id, label, icon: Icon }) => (
            <Chip
              key={id}
              tone="float"
              selected={activeFilter === id}
              onClick={() => toggleFilter(id)}
              icon={<Icon />}
            >
              {label}
            </Chip>
          ))}
        </div>

        {activeFilter === "safety" && <SafetyOverlay currentArea={currentLocation.area} riskLevel={riskLevel} />}
      </div>

      {/* Right rail controls */}
      <div className="absolute right-4 top-1/2 z-30 -translate-y-1/2">
        <div className="glass flex flex-col overflow-hidden rounded-full">
          <button type="button" aria-label="Zoom in" className="flex h-11 w-11 items-center justify-center hover:bg-accent">
            <Plus className="h-5 w-5" />
          </button>
          <span className="mx-2.5 h-px bg-border" />
          <button type="button" aria-label="Zoom out" className="flex h-11 w-11 items-center justify-center hover:bg-accent">
            <Minus className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div
        className="bottom-dock absolute right-4 z-30 transition-[bottom] duration-300"
        style={panelOffset ? { bottom: `calc(var(--dock-height) + var(--dock-offset) * 1.75 + env(safe-area-inset-bottom) + ${panelOffset})` } : undefined}
      >
        <Button variant="glass" size="icon" aria-label="Recenter on my location">
          <LocateFixed className="!size-5 text-primary" />
        </Button>
      </div>

      {/* Bottom panels */}
      {activeFilter === "safety" && (
        <div className="bottom-dock glass absolute inset-x-4 z-30 space-y-3 rounded-2xl p-3 animate-fade-in">
          <Segmented<TimeOfDay>
            label="Time of day"
            value={timeOfDay}
            onChange={setTimeOfDay}
            options={[
              { value: "day", label: "Day" },
              { value: "night", label: "Night" },
            ]}
          />
          <div className="flex items-center justify-center gap-5 pb-1">
            {safetyLegend.map(({ label, className }) => (
              <span key={label} className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className={cn("h-2.5 w-2.5 rounded-full", className)} />
                {label}
              </span>
            ))}
          </div>
        </div>
      )}

      {activeFilter === "events" && (
        <div className="bottom-dock glass absolute inset-x-4 z-30 rounded-2xl p-2 animate-fade-in">
          <Segmented<EventTimeFilter> label="When" value={eventTimeFilter} onChange={setEventTimeFilter} options={eventTimeFilters} />
          <p className="px-2 pb-1 pt-2.5 text-center text-xs text-muted-foreground">
            {markers.length} {markers.length === 1 ? "event" : "events"} nearby
          </p>
        </div>
      )}

      <MarkerDetailSheet marker={selectedMarker} onClose={() => setSelectedMarker(null)} />
    </div>
  );
};

export default MapPage;
