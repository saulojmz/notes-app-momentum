import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface MetaItemProps {
  icon?: LucideIcon;
  children: ReactNode;
  className?: string;
  iconClassName?: string;
}

/** Small icon + mono label, for durations, counts, times. */
export const MetaItem = ({ icon: Icon, children, className, iconClassName }: MetaItemProps) => (
  <span className={cn("inline-flex items-center gap-1.5 text-[13px] tabular-nums text-muted-foreground", className)}>
    {Icon && <Icon className={cn("h-4 w-4 shrink-0", iconClassName)} strokeWidth={1.5} />}
    {children}
  </span>
);

/** Dot separator for inline meta rows. */
export const MetaDot = () => <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-muted-foreground/40" />;
