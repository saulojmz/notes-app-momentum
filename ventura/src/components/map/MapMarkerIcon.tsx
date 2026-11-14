import { FilterType } from "@/types/map";
import { cn } from "@/lib/utils";
import { markerIcon, markerTone } from "./markerStyle";

interface MapMarkerIconProps {
  type: FilterType;
  category?: string;
  selected?: boolean;
  className?: string;
}

/** Category-coloured pin with a pointer tail. */
export const MapMarkerIcon = ({ type, category, selected, className }: MapMarkerIconProps) => {
  const Icon = markerIcon(type, category);

  return (
    <div className={cn("relative flex flex-col items-center", className)}>
      {selected && (
        <span className={cn("absolute top-0 h-10 w-10 rounded-full animate-marker-pulse", markerTone[type])} />
      )}
      <div
        className={cn(
          "relative flex h-10 w-10 items-center justify-center rounded-full border-[2.5px] border-card text-on-image shadow-float transition-transform",
          markerTone[type],
          selected && "scale-110",
        )}
      >
        <Icon className="h-[18px] w-[18px]" strokeWidth={2} />
      </div>
      <span className={cn("-mt-1 h-2.5 w-2.5 rotate-45 border-b-[2.5px] border-r-[2.5px] border-card", markerTone[type])} />
    </div>
  );
};
