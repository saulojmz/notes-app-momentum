import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

/** Bottom action area that stays pinned inside full-screen flows. */
export const StickyFooter = ({ children, className }: { children: ReactNode; className?: string }) => (
  <div
    className={cn(
      "pb-safe sticky bottom-0 z-10 mt-auto border-t border-border/60 bg-background/90 px-5 pt-3 backdrop-blur-xl",
      className,
    )}
  >
    {children}
  </div>
);
