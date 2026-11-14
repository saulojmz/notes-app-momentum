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
    <div className="relative mb-5">
      <div className="absolute inset-0 -m-3 rounded-full bg-primary/5" />
      <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-card shadow-md">
        <Icon className="h-7 w-7 text-primary" strokeWidth={1.5} />
      </div>
    </div>
    <h3 className="text-title text-xl">{title}</h3>
    {description && <p className="mt-2 max-w-[28ch] text-sm text-muted-foreground">{description}</p>}
    {action && <div className="mt-6 w-full max-w-xs">{action}</div>}
  </div>
);
