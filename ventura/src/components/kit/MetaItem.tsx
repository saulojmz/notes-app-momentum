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
  <span className={cn("inline-flex items-center gap-1.5 font-mono text-xs tabular text-muted-foreground", className)}>
    {Icon && <Icon className={cn("h-3.5 w-3.5 shrink-0", iconClassName)} strokeWidth={1.75} />}
    {children}
  </span>
);

/** Dot separator for inline meta rows. */
export const MetaDot = () => <span aria-hidden className="h-[3px] w-[3px] rounded-full bg-muted-foreground/40" />;
