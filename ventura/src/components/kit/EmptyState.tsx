import type { LucideIcon } from "lucide-react";
import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  icon: LucideIcon;
  title: ReactNode;
  description?: ReactNode;
  action?: ReactNode;
  className?: string;
}

export const EmptyState = ({ icon: Icon, title, description, action, className }: EmptyStateProps) => (
  <div className={cn("flex flex-col items-center px-6 py-12 text-center", className)}>
    <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-xl bg-secondary">
      <Icon className="h-[18px] w-[18px] text-muted-foreground" strokeWidth={1.5} />
    </div>
    <h3 className="text-title text-lg">{title}</h3>
    {description && <p className="mt-2 max-w-[28ch] text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-6 w-full max-w-xs">{action}</div>}
  </div>
);
