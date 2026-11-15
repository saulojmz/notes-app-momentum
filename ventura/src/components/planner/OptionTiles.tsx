import type { LucideIcon } from "lucide-react";
import { Check } from "lucide-react";
import { SmartImage } from "@/components/kit";
import { cn } from "@/lib/utils";

/** Photo tile for visual choices (vibe, climate, setting). */
export const PhotoTile = ({
  label,
  image,
  selected,
  onClick,
  hint,
}: {
  label: string;
  image: string;
  selected: boolean;
  onClick: () => void;
  hint?: string;
}) => (
  <button
    type="button"
    role="radio"
    aria-checked={selected}
    onClick={onClick}
    className={cn(
      "press group relative aspect-[4/5] overflow-hidden rounded-2xl bg-secondary text-left outline-none ring-offset-2 ring-offset-background transition-shadow focus-visible:ring-2 focus-visible:ring-ring",
      selected && "ring-[3px] ring-ink",
    )}
  >
    <SmartImage src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
    <div className="scrim-b absolute inset-0" />
    <span
      className={cn(
        "absolute right-2.5 top-2.5 flex h-7 w-7 items-center justify-center rounded-full border-2 transition-colors",
        selected ? "border-on-image bg-ink text-ink-foreground" : "border-on-image/70 bg-scrim/20",
      )}
    >
      {selected && <Check className="h-4 w-4" strokeWidth={3} />}
    </span>
    <span className="absolute inset-x-0 bottom-0 p-3.5 text-on-image">
      <span className="text-title block text-xl">{label}</span>
      {hint && <span className="mt-0.5 block text-xs text-on-image/80">{hint}</span>}
    </span>
  </button>
);

/** Full-width choice row with an icon. */
export const OptionRow = ({
  icon: Icon,
  label,
  hint,
  selected,
  onClick,
  multi,
}: {
  icon?: LucideIcon;
  label: string;
  hint?: string;
  selected: boolean;
  onClick: () => void;
  multi?: boolean;
}) => (
  <button
    type="button"
    role={multi ? "checkbox" : "radio"}
    aria-checked={selected}
    onClick={onClick}
    className={cn(
      "press flex w-full items-center gap-4 rounded-2xl border p-4 text-left transition-colors",
      selected ? "border-ink bg-ink text-ink-foreground" : "border-border bg-card hover:border-foreground/25",
    )}
  >
    {Icon && (
      <span
        className={cn(
          "flex h-12 w-12 shrink-0 items-center justify-center rounded-xl",
          selected ? "bg-ink-foreground/10" : "bg-secondary text-muted-foreground",
        )}
      >
        <Icon className="h-6 w-6" strokeWidth={1.75} />
      </span>
    )}
    <span className="min-w-0 flex-1">
      <span className="block text-[16px] font-medium">{label}</span>
      {hint && <span className={cn("mt-0.5 block text-[13px]", selected ? "text-ink-muted" : "text-muted-foreground")}>{hint}</span>}
    </span>
    <span
      className={cn(
        "flex h-6 w-6 shrink-0 items-center justify-center border-2 transition-colors",
        multi ? "rounded-md" : "rounded-full",
        selected ? "border-ink-foreground bg-ink-foreground text-ink" : "border-input",
      )}
    >
      {selected && <Check className="h-3.5 w-3.5" strokeWidth={3} />}
    </span>
  </button>
);
