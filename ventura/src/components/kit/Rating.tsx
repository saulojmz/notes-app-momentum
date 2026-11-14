import { Star } from "lucide-react";
import { cn } from "@/lib/utils";

interface RatingProps {
  value: number;
  count?: number;
  className?: string;
  tone?: "default" | "on-image";
}

export const Rating = ({ value, count, className, tone = "default" }: RatingProps) => (
  <span
    className={cn(
      "inline-flex items-center gap-1 font-mono text-xs tabular",
      tone === "on-image" ? "text-on-image" : "text-foreground",
      className,
    )}
  >
    <Star className="h-3.5 w-3.5 fill-highlight text-highlight" strokeWidth={0} />
    {value.toFixed(1)}
    {count !== undefined && (
      <span className={tone === "on-image" ? "text-on-image/70" : "text-muted-foreground"}>({count})</span>
    )}
  </span>
);
