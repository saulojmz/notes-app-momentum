import type { ReactNode } from "react";
import { Carousel, CarouselContent, CarouselItem } from "@/components/ui/carousel";
import { cn } from "@/lib/utils";

interface RailProps<T> {
  items: T[];
  render: (item: T) => ReactNode;
  getKey: (item: T) => string;
  /** Tailwind basis classes for each slide. */
  itemClassName?: string;
}

/**
 * Draggable horizontal list that bleeds to the screen edge but aligns its
 * first card with the page gutter.
 */
export function Rail<T>({ items, render, getKey, itemClassName }: RailProps<T>) {
  return (
    <Carousel
      opts={{ align: "start", loop: false, dragFree: true, containScroll: "trimSnaps" }}
      className="-mx-5 cursor-grab active:cursor-grabbing"
    >
      <CarouselContent className="ml-0">
        {items.map((item) => (
          <CarouselItem key={getKey(item)} className={cn("mr-3 pl-0 first:ml-5 last:mr-5", itemClassName)}>
            {render(item)}
          </CarouselItem>
        ))}
      </CarouselContent>
    </Carousel>
  );
}
