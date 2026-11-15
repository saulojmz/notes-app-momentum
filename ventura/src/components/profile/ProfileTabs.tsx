import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { LayoutGrid, Bookmark } from "lucide-react";
import { Itinerary } from "@/types/itinerary";
import { ItineraryGridCard } from "./ItineraryGridCard";
import { EmptyState } from "@/components/kit";

interface ProfileTabsProps {
  postedItineraries: Itinerary[];
  savedItineraries: Itinerary[];
}

const Grid = ({ items }: { items: Itinerary[] }) => (
  <div className="grid grid-cols-2 gap-3">
    {items.map((itinerary) => (
      <ItineraryGridCard key={itinerary.id} itinerary={itinerary} />
    ))}
  </div>
);

export const ProfileTabs = ({ postedItineraries, savedItineraries }: ProfileTabsProps) => (
  <Tabs defaultValue="posted" className="w-full">
    <TabsList className="flex w-full">
      <TabsTrigger value="posted" className="flex-1">
        <LayoutGrid />
        Itineraries
        <span className="tabular-nums text-xs text-muted-foreground">{postedItineraries.length}</span>
      </TabsTrigger>
      <TabsTrigger value="saved" className="flex-1">
        <Bookmark />
        Saved
        <span className="tabular-nums text-xs text-muted-foreground">{savedItineraries.length}</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="posted" className="mt-5">
      {postedItineraries.length > 0 ? (
        <Grid items={postedItineraries} />
      ) : (
        <EmptyState icon={LayoutGrid} title="No itineraries yet" description="Trips you publish will show up here" />
      )}
    </TabsContent>

    <TabsContent value="saved" className="mt-5">
      {savedItineraries.length > 0 ? (
        <Grid items={savedItineraries} />
      ) : (
        <EmptyState icon={Bookmark} title="Nothing saved yet" description="Bookmark itineraries to plan your next trip" />
      )}
    </TabsContent>
  </Tabs>
);
