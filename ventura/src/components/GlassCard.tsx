import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface GlassCardProps {
  children: ReactNode;
  className?: string;
  hover?: boolean;
  style?: React.CSSProperties;
  onClick?: () => void;
}

/**
 * Legacy name kept for compatibility — renders the standard `surface` card.
 * Prefer the `surface` class directly in new code.
 */
export const GlassCard = ({ children, className, hover = false, style, onClick }: GlassCardProps) => (
  <div
    style={style}
    onClick={onClick}
    className={cn("surface", hover && "transition-shadow hover:shadow-md", onClick && "cursor-pointer", className)}
  >
    {children}
  </div>
);
