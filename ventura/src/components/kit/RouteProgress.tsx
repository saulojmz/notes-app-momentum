import { cn } from "@/lib/utils";

interface RouteProgressProps {
  /** Number of stops on the route. */
  total: number;
  /** 1-based index of the current stop. */
  current: number;
  className?: string;
}

/**
 * Ventura's signature: progress drawn as a route. Stops are joined by a dashed
 * line that turns solid once travelled; the current stop carries the accent.
 */
export const RouteProgress = ({ total, current, className }: RouteProgressProps) => (
  <div
    className={cn("flex items-center", className)}
    role="progressbar"
    aria-valuemin={1}
    aria-valuemax={total}
    aria-valuenow={current}
    aria-label={`Step ${current} of ${total}`}
  >
    {Array.from({ length: total }, (_, i) => {
      const stop = i + 1;
      const done = stop < current;
      const here = stop === current;
      return (
        <div key={i} className={cn("flex items-center", i > 0 && "flex-1")}>
          {i > 0 && (
            <span
              className={cn("h-0.5 flex-1 transition-colors duration-300", stop <= current ? "bg-ink" : "route-line")}
              aria-hidden
            />
          )}
          <span
            aria-hidden
            className={cn(
              "shrink-0 rounded-full transition-colors duration-300",
              here ? "h-2.5 w-2.5 bg-primary ring-4 ring-primary/15" : done ? "h-1.5 w-1.5 bg-ink" : "h-1.5 w-1.5 bg-input",
            )}
          />
        </div>
      );
    })}
  </div>
);
