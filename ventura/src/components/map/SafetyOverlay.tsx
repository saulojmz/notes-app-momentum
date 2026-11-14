import { ShieldCheck, ShieldAlert, ShieldX } from "lucide-react";
import { SafetyLevel } from "@/types/map";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

interface SafetyOverlayProps {
  currentArea: string;
  riskLevel: SafetyLevel;
}

export const safetyConfig: Record<SafetyLevel, { label: string; icon: typeof ShieldCheck; tone: string; badge: "success" | "warning" | "destructive" }> = {
  safe: { label: "Safe", icon: ShieldCheck, tone: "bg-success/10 text-success", badge: "success" },
  moderate: { label: "Use caution", icon: ShieldAlert, tone: "bg-warning/10 text-warning", badge: "warning" },
  dangerous: { label: "Avoid", icon: ShieldX, tone: "bg-destructive/10 text-destructive", badge: "destructive" },
};

/** "You're in …" card shown under the filter chips while the safety layer is on. */
export const SafetyOverlay = ({ currentArea, riskLevel }: SafetyOverlayProps) => {
  const { icon: Icon, tone, label, badge } = safetyConfig[riskLevel];

  return (
    <div className="glass flex items-center gap-3 rounded-2xl p-3 pr-4 animate-fade-in">
      <div className={cn("flex h-11 w-11 items-center justify-center rounded-xl", tone)}>
        <Icon className="h-5 w-5" />
      </div>
      <div className="min-w-0 flex-1">
        <p className="eyebrow">You're in</p>
        <p className="text-title text-lg">{currentArea}</p>
      </div>
      <Badge variant={badge} className={cn(badge === "destructive" && "bg-destructive/10 text-destructive")}>
        {label}
      </Badge>
    </div>
  );
};
