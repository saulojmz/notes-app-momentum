import { Guide } from "@/types/guide";
import { MapPin } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Rating, SmartImage } from "@/components/kit";

interface GuideCardProps {
  guide: Guide;
  onViewProfile: () => void;
  onSelect: () => void;
}

/** Portrait companion card. Tapping anywhere opens the profile. */
export const GuideCard = ({ guide, onViewProfile }: GuideCardProps) => (
  <div
    role="button"
    tabIndex={0}
    onClick={onViewProfile}
    onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onViewProfile()}
    className="press overflow-hidden rounded-2xl border border-border bg-card text-left shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
  >
    <div className="relative aspect-[4/5] bg-secondary">
      <SmartImage src={guide.avatar} alt={guide.name} className="h-full w-full object-cover" />
      <div className="scrim-b absolute inset-0" />
      <span className="glass-dark absolute left-3 top-3 rounded-full px-2.5 py-1">
        <Rating value={guide.rating} count={guide.reviews} tone="on-image" />
      </span>
      <div className="absolute inset-x-0 bottom-0 p-4 text-on-image">
        <p className="flex items-center gap-1 text-[13px] text-on-image/75">
          <MapPin className="h-3 w-3" />
          {guide.location}
        </p>
        <h3 className="text-display mt-1 text-[30px]">{guide.name}</h3>
      </div>
    </div>

    <div className="space-y-3 p-4">
      <div className="flex items-baseline justify-between gap-2">
        <p className="text-title text-xl tabular-nums">
          £{guide.hourlyRate}
          <span className="font-sans text-sm text-muted-foreground"> / hr</span>
        </p>
        <p className="meta truncate">{guide.languages.join(" · ")}</p>
      </div>
      <div className="flex flex-wrap gap-1.5">
        {guide.specialties.slice(0, 3).map((s) => (
          <Badge key={s} variant="secondary">
            {s}
          </Badge>
        ))}
      </div>
      <Button variant="secondary" className="w-full" tabIndex={-1}>
        View profile
      </Button>
    </div>
  </div>
);
