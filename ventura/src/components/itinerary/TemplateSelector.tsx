import { GlassCard } from "@/components/GlassCard";
import { Compass, Palette, Zap } from "lucide-react";
import { itineraryTemplates } from "@/data/mockItineraries";

interface TemplateSelectorProps {
  onSelectTemplate: (templateId: string) => void;
}

const templateIcons = {
  compass: Compass,
  palette: Palette,
  zap: Zap,
};

export const TemplateSelector = ({ onSelectTemplate }: TemplateSelectorProps) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {itineraryTemplates.map((template) => {
        const Icon = templateIcons[template.icon as keyof typeof templateIcons] || Compass;
        
        return (
          <GlassCard
            key={template.id}
            hover
            onClick={() => onSelectTemplate(template.id)}
            className="p-6 space-y-4 cursor-pointer group"
          >
            <div className="h-14 w-14 rounded-full bg-primary/20 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Icon className="h-7 w-7 text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-muted-foreground leading-relaxed">
                {template.description}
              </p>
            </div>
          </GlassCard>
        );
      })}
    </div>
  );
};
