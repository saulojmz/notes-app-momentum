import { forwardRef, type ButtonHTMLAttributes, type ReactNode } from "react";
import { cn } from "@/lib/utils";

interface ChipProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  selected?: boolean;
  icon?: ReactNode;
  /** `surface` sits on paper, `float` sits on maps / imagery. */
  tone?: "surface" | "float";
  size?: "sm" | "md";
}

/** Selectable pill used for filters, tags and options. */
export const Chip = forwardRef<HTMLButtonElement, ChipProps>(
  ({ selected, icon, tone = "surface", size = "md", className, children, ...props }, ref) => (
    <button
      ref={ref}
      type="button"
      aria-pressed={selected}
      className={cn(
        "press inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full border font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring [&_svg]:size-4 [&_svg]:shrink-0",
        size === "md" ? "h-10 px-4 text-sm" : "h-8 px-3 text-[13px]",
        selected
          ? "border-ink bg-ink text-ink-foreground"
          : tone === "float"
            ? "glass border-border/60 text-foreground hover:bg-card"
            : "border-border bg-card text-foreground hover:border-foreground/25",
        className,
      )}
      {...props}
    >
      {icon}
      {children}
    </button>
  ),
);
Chip.displayName = "Chip";

/** Horizontally scrolling row that bleeds to the screen edge. */
export const ChipRow = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div className={cn("-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 scrollbar-hide", className)}>{children}</div>
);
