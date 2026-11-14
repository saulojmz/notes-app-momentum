import { useState } from "react";
import { format } from "date-fns";
import { Guide, BookingPreferences } from "@/types/guide";
import { mockGuides } from "@/data/mockGuides";
import { GuideCard } from "./GuideCard";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { Chip, ChipRow, Segmented } from "@/components/kit";

interface AvailableGuidesStepProps {
  date: Date;
  time: string;
  preferences: BookingPreferences;
  onSelectGuide: (guide: Guide) => void;
  onViewProfile: (guide: Guide) => void;
}

const ACTIVITY_FILTERS = [
  { value: "All", label: "All activities" },
  { value: "Food", label: "Food & drink" },
  { value: "History", label: "History" },
  { value: "Photography", label: "Photography" },
];

type Sort = "rating" | "price";

export const AvailableGuidesStep = ({ date, time, onSelectGuide, onViewProfile }: AvailableGuidesStepProps) => {
  const [activityFilter, setActivityFilter] = useState("All");
  const [sort, setSort] = useState<Sort>("rating");

  const filtered =
    activityFilter === "All"
      ? mockGuides
      : mockGuides.filter((g) => g.specialties.some((s) => s.toLowerCase().includes(activityFilter.toLowerCase())));
  const guides = [...(filtered.length > 0 ? filtered : mockGuides)].sort((a, b) =>
    sort === "rating" ? b.rating - a.rating : a.hourlyRate - b.hourlyRate,
  );

  return (
    <div className="flex min-h-full flex-col pb-10 pt-4">
      <div className="mx-auto w-full max-w-md space-y-4 px-5">
        <div>
          <p className="eyebrow">
            {time === "ASAP" ? "Now" : `${format(date, "EEE, MMM d")} · ${time}`}
          </p>
          <h2 className="text-display mt-2 text-[34px]">
            {guides.length} companions free
          </h2>
        </div>

        <ChipRow>
          {ACTIVITY_FILTERS.map((f) => (
            <Chip key={f.value} size="sm" selected={activityFilter === f.value} onClick={() => setActivityFilter(f.value)}>
              {f.label}
            </Chip>
          ))}
        </ChipRow>

        <Segmented<Sort>
          label="Sort"
          value={sort}
          onChange={setSort}
          options={[
            { value: "rating", label: "Top rated" },
            { value: "price", label: "Lowest price" },
          ]}
        />
      </div>

      {/* Centered companion carousel — whole card opens the profile */}
      <Carousel opts={{ align: "center", loop: false, dragFree: false, containScroll: false }} className="mt-6 cursor-grab active:cursor-grabbing">
        <CarouselContent className="ml-0">
          {guides.map((guide) => (
            <CarouselItem key={guide.id} className="basis-[76%] pl-0 sm:basis-[44%] md:basis-[32%]">
              <div className="px-2 py-2">
                <GuideCard guide={guide} onViewProfile={() => onViewProfile(guide)} onSelect={() => onSelectGuide(guide)} />
              </div>
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
