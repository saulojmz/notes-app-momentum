import { Button } from "@/components/ui/button";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  type CarouselApi,
} from "@/components/ui/carousel";
import { useEffect, useState } from "react";
import onboardingScreen1 from "@/assets/onboarding-screen-1.png";
import onboardingScreen2 from "@/assets/onboarding-screen-2.png";
import onboardingScreen3 from "@/assets/onboarding-screen-3.png";

interface GuidesOnboardingProps {
  onComplete: () => void;
}

const slides = [
  { id: 1, image: onboardingScreen1 },
  { id: 2, image: onboardingScreen2 },
  { id: 3, image: onboardingScreen3 },
];

export const GuidesOnboarding = ({ onComplete }: GuidesOnboardingProps) => {
  const [api, setApi] = useState<CarouselApi>();
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    if (!api) return;

    setCurrent(api.selectedScrollSnap());

    api.on("select", () => {
      setCurrent(api.selectedScrollSnap());
    });
  }, [api]);

  return (
    <div className="w-full h-screen overflow-hidden">
      <Carousel setApi={setApi} className="w-full h-full">
        <CarouselContent className="h-screen">
          {slides.map((slide, index) => (
            <CarouselItem key={slide.id} className="relative w-full h-screen p-0">
              <img
                src={slide.image}
                alt={`Onboarding ${slide.id}`}
                className="w-full h-full object-cover"
              />

              {/* Get Started button only on last slide */}
              {index === slides.length - 1 && (
                <div className="absolute bottom-20 left-0 right-0 px-8">
                  <Button
                    onClick={onComplete}
                    className="w-full py-6 text-lg rounded-full bg-on-image text-scrim hover:bg-on-image/90"
                  >
                    Get Started
                  </Button>
                </div>
              )}
            </CarouselItem>
          ))}
        </CarouselContent>
      </Carousel>
    </div>
  );
};
