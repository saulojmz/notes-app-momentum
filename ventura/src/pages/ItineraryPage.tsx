import { useState, type ReactNode } from "react";
import { useNavigate } from "react-router-dom";
import { Search, Plus, Compass, ArrowUpRight, SearchX } from "lucide-react";
import { destinations, itineraries, regions } from "@/data/mockItineraries";
import { DestinationCard } from "@/components/itinerary/DestinationCard";
import { ItineraryPreviewCard } from "@/components/itinerary/ItineraryPreviewCard";
import { CreateItineraryModal } from "@/components/itinerary/CreateItineraryModal";
import { Chip, ChipRow, Rail, SectionHeader } from "@/components/kit";
import type { Itinerary } from "@/types/itinerary";

const byCategory = (match: (i: Itinerary) => boolean) => itineraries.filter(match);

const collections = [
  { title: "Top itineraries", items: [...itineraries].sort((a, b) => b.rating - a.rating).slice(0, 8) },
  { title: "Nightlife", items: byCategory((i) => i.category === "Nightlife" || i.tags.includes("Nightlife")) },
  { title: "Nature", items: byCategory((i) => i.category === "Nature" || i.tags.includes("Nature")) },
  { title: "Food & culinary", items: byCategory((i) => i.category === "Food" || i.tags.includes("Food")) },
  {
    title: "Culture & history",
    items: byCategory(
      (i) => i.category === "Culture" || i.category === "History" || i.tags.includes("Culture") || i.tags.includes("History"),
    ),
  },
];

const ActionTile = ({
  icon,
  title,
  subtitle,
  onClick,
  tone,
}: {
  icon: ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
  tone: "ink" | "surface";
}) => (
  <button
    type="button"
    onClick={onClick}
    className={
      tone === "ink"
        ? "press surface flex h-[132px] flex-col justify-between p-4 text-left"
        : "press surface flex h-[132px] flex-col justify-between p-4 text-left"
    }
  >
    <div className="flex w-full items-start justify-between">
      <span
        className={
          tone === "ink"
            ? "flex h-10 w-10 items-center justify-center rounded-full bg-secondary"
            : "flex h-10 w-10 items-center justify-center rounded-full bg-secondary text-muted-foreground"
        }
      >
        {icon}
      </span>
      <ArrowUpRight className="h-4 w-4 opacity-50" />
    </div>
    <div>
      <p className="text-[15px] font-medium leading-tight">{title}</p>
      <p className={tone === "ink" ? "mt-0.5 text-xs text-muted-foreground" : "mt-0.5 text-xs text-muted-foreground"}>
        {subtitle}
      </p>
    </div>
  </button>
);

const ItineraryPage = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedRegion, setSelectedRegion] = useState("All");
  const [createModalOpen, setCreateModalOpen] = useState(false);

  const query = searchQuery.trim().toLowerCase();
  const visibleDestinations = destinations
    .filter((d) => selectedRegion === "All" || d.region === selectedRegion)
    .filter((d) => d.name.toLowerCase().includes(query) || d.country.toLowerCase().includes(query));

  return (
    <div className="pt-safe mx-auto min-h-screen max-w-2xl px-5">
      {/* Header */}
      <header className="pb-5 pt-8">
        <p className="eyebrow">
          {destinations.length} cities · {itineraries.length} itineraries
        </p>
        <h1 className="text-display mt-2 text-[36px]">Itineraries</h1>
      </header>

      <div className="space-y-5">
        {/* Search */}
        <label className="flex h-12 items-center gap-3 rounded-xl border border-border bg-card px-4 transition-colors focus-within:border-primary/50 focus-within:ring-4 focus-within:ring-primary/10">
          <Search className="h-[18px] w-[18px] shrink-0 text-muted-foreground" />
          <input
            placeholder="Search destinations"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-full w-full bg-transparent text-[15px] outline-none placeholder:text-muted-foreground"
          />
        </label>

        {/* Actions */}
        <div className="grid grid-cols-2 gap-3">
          <ActionTile
            tone="ink"
            icon={<Plus className="h-5 w-5" />}
            title="Create itinerary"
            subtitle="Start from a template"
            onClick={() => setCreateModalOpen(true)}
          />
          <ActionTile
            tone="surface"
            icon={<Compass className="h-5 w-5" />}
            title="Plan your trip"
            subtitle="Guided or AI chat"
            onClick={() => navigate("/plan-trip")}
          />
        </div>

        {/* Regions */}
        <ChipRow>
          {regions.map((region) => (
            <Chip key={region} size="sm" selected={selectedRegion === region} onClick={() => setSelectedRegion(region)}>
              {region}
            </Chip>
          ))}
        </ChipRow>
      </div>

      <div className="mt-8 space-y-12">
        {/* Destinations */}
        <section className="space-y-4">
          <SectionHeader eyebrow={selectedRegion === "All" ? "Worldwide" : selectedRegion} title="Popular destinations" />
          {visibleDestinations.length > 0 ? (
            <Rail
              items={visibleDestinations.slice(0, 10)}
              getKey={(d) => d.id}
              itemClassName="basis-[68%] sm:basis-[44%]"
              render={(d) => <DestinationCard destination={d} />}
            />
          ) : (
            <div className="surface-sunken flex items-center gap-3 p-4 text-sm text-muted-foreground">
              <SearchX className="h-5 w-5 shrink-0" />
              No destinations match “{searchQuery}”{selectedRegion !== "All" && ` in ${selectedRegion}`}.
            </div>
          )}
        </section>

        {/* Collections */}
        {collections
          .filter((c) => c.items.length > 0)
          .map((collection) => (
            <section key={collection.title} className="space-y-4">
              <SectionHeader
                eyebrow={`${collection.items.length} itineraries`}
                title={collection.title}
              />
              <Rail
                items={collection.items}
                getKey={(i) => i.id}
                itemClassName="basis-[78%] sm:basis-[46%]"
                render={(i) => <ItineraryPreviewCard itinerary={i} />}
              />
            </section>
          ))}
      </div>

      <CreateItineraryModal open={createModalOpen} onOpenChange={setCreateModalOpen} />
    </div>
  );
};

export default ItineraryPage;
