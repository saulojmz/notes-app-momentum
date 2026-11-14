import { useState, useCallback, useEffect } from "react";
import { X } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import { TemplatePreviewCard } from "./TemplatePreviewCard";
import { itineraryTemplates } from "@/data/mockItineraries";
import { Button } from "@/components/ui/button";
import { TopBar } from "@/components/kit";
import { cn } from "@/lib/utils";

interface TemplateCarouselProps {
  onSelectTemplate: (templateId: string) => void;
  onClose: () => void;
}

export const TemplateCarousel = ({ onSelectTemplate, onClose }: TemplateCarouselProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: false, align: "center", containScroll: false });

  const onSelect = useCallback(() => {
    if (!emblaApi) return;
    setSelectedIndex(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    onSelect();
    return () => {
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  const current = itineraryTemplates[selectedIndex];

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background animate-slide-up">
      <TopBar
        title="New itinerary"
        right={
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Close">
            <X className="!size-5" />
          </Button>
        }
      />

      <div className="px-5 pb-2 pt-2 text-center">
        <p className="eyebrow">Step 1 of 2</p>
        <h2 className="text-display mt-2 text-[32px]">Choose a layout</h2>
      </div>

      {/* Carousel */}
      <div className="min-h-0 flex-1 overflow-hidden" ref={emblaRef}>
        <div className="flex h-full">
          {itineraryTemplates.map((template) => (
            <div key={template.id} className="h-full min-w-0 flex-[0_0_78%] px-3 py-6">
              <TemplatePreviewCard templateId={template.id} onSelect={onSelectTemplate} />
            </div>
          ))}
        </div>
      </div>

      {/* Caption + action — padded to clear the floating dock */}
      <div className="pb-dock space-y-4 px-5 text-center">
        <div>
          <p className="text-title text-xl">{current?.name}</p>
          <p className="mt-1 text-sm text-muted-foreground">{current?.description}</p>
        </div>
        <div className="flex justify-center gap-2">
          {itineraryTemplates.map((t, index) => (
            <button
              key={t.id}
              type="button"
              onClick={() => emblaApi?.scrollTo(index)}
              aria-label={`Show ${t.name}`}
              className={cn(
                "h-1.5 rounded-full transition-all",
                index === selectedIndex ? "w-6 bg-foreground" : "w-1.5 bg-foreground/20",
              )}
            />
          ))}
        </div>
        <Button size="lg" className="w-full" onClick={() => current && onSelectTemplate(current.id)}>
          Use this layout
        </Button>
      </div>
    </div>
  );
};
