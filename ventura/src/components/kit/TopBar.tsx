import type { ReactNode } from "react";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface TopBarProps {
  onBack?: () => void;
  title?: ReactNode;
  right?: ReactNode;
  /** `glass-dark` for bars that float over photography. */
  tone?: "plain" | "glass" | "glass-dark";
  sticky?: boolean;
  className?: string;
}

/** Three-slot app bar: back · title · action. */
export const TopBar = ({ onBack, title, right, tone = "plain", sticky, className }: TopBarProps) => {
  const buttonVariant = tone === "glass-dark" ? "glass-dark" : tone === "glass" ? "glass" : "ghost";
  return (
    <header
      className={cn(
        "pt-safe z-30 flex h-16 items-center justify-between gap-3 px-3",
        sticky && "sticky top-0 bg-background/85 backdrop-blur-xl",
        className,
      )}
    >
      <div className="flex w-11 justify-start">
        {onBack && (
          <Button variant={buttonVariant} size="icon" onClick={onBack} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
        )}
      </div>
      {title && <div className="min-w-0 flex-1 truncate text-center text-[15px] font-semibold">{title}</div>}
      <div className="flex min-w-11 justify-end gap-2">{right}</div>
    </header>
  );
};
