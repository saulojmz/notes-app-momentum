import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ArrowLeft, Compass } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { destinations, itineraries, categoryFilters } from "@/data/mockItineraries";
import { ItineraryPreviewCard } from "@/components/itinerary/ItineraryPreviewCard";
import { Chip, ChipRow, EmptyState, SectionHeader, SmartImage } from "@/components/kit";

const DestinationDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedCategory, setSelectedCategory] = useState("All");

  const destination = destinations.find((d) => d.id === id);
  const destinationItineraries = itineraries.filter((i) => i.destinationId === id);
  const filteredItineraries =
    selectedCategory === "All" ? destinationItineraries : destinationItineraries.filter((i) => i.category === selectedCategory);

  if (!destination) {
    return (
      <EmptyState
        className="min-h-screen justify-center"
        icon={Compass}
        title="Destination not found"
        description="It may have moved, or the link is out of date"
        action={
          <Button className="w-full" onClick={() => navigate("/itinerary")}>
            Back to itineraries
          </Button>
        }
      />
    );
  }

  return (
    <div className="min-h-screen pb-16">
      {/* Hero */}
      <div className="relative h-[60vh] min-h-[440px] w-full overflow-hidden bg-secondary">
        <SmartImage src={destination.imageUrl} alt={destination.name} className="absolute inset-0 h-full w-full object-cover" />
        <div className="scrim-t absolute inset-x-0 top-0 h-32" />
        <div className="scrim-b absolute inset-0" />

        <div className="top-safe absolute inset-x-0 flex px-4">
          <Button variant="glass-dark" size="icon" onClick={() => navigate(-1)} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
        </div>

        <div className="absolute inset-x-0 bottom-0 mx-auto max-w-2xl p-5 pb-7 text-on-image">
          <Badge variant="glass">{destination.region}</Badge>
          <h1 className="text-display mt-3 text-[56px]">{destination.name}</h1>
          <p className="mt-1 text-[13px] text-on-image/75">{destination.country}</p>
          <p className="mt-3 max-w-[36ch] text-[15px] leading-relaxed text-on-image/85">{destination.description}</p>
        </div>
      </div>

      {/* Content */}
      <div className="mx-auto max-w-2xl space-y-6 px-5 pt-6">
        <ChipRow>
          {categoryFilters.map((category) => (
            <Chip
              key={category}
              size="sm"
              selected={selectedCategory === category}
              onClick={() => setSelectedCategory(category)}
            >
              {category}
            </Chip>
          ))}
        </ChipRow>

        <SectionHeader
          eyebrow={`${filteredItineraries.length} ${filteredItineraries.length === 1 ? "itinerary" : "itineraries"}`}
          title={selectedCategory === "All" ? "All itineraries" : `${selectedCategory} itineraries`}
        />

        {filteredItineraries.length === 0 ? (
          <EmptyState
            icon={Compass}
            title="Nothing here yet"
            description={`No ${selectedCategory.toLowerCase()} itineraries for ${destination.name} so far.`}
          />
        ) : (
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2">
            {filteredItineraries.map((itinerary) => (
              <ItineraryPreviewCard key={itinerary.id} itinerary={itinerary} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DestinationDetailPage;
