import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface SectionHeaderProps {
  title: ReactNode;
  eyebrow?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const SectionHeader = ({ title, eyebrow, action, className }: SectionHeaderProps) => (
  <div className={cn("flex items-end justify-between gap-4", className)}>
    <div className="min-w-0 space-y-1">
      {eyebrow && <p className="eyebrow">{eyebrow}</p>}
      <h2 className="text-title text-xl">{title}</h2>
    </div>
    {action && <div className="shrink-0">{action}</div>}
  </div>
);
