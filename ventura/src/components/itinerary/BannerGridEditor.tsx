import { useState, useRef } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { TopBar } from "@/components/kit";
import { toast } from "sonner";

interface Section {
  id: string;
  imageUrl: string | null;
  description: string;
}

interface BannerGridEditorProps {
  onBack: () => void;
  onSave: () => void;
}

const generateId = () => Math.random().toString(36).substring(2, 9);

export const BannerGridEditor = ({ onBack, onSave }: BannerGridEditorProps) => {
  const [bannerImage, setBannerImage] = useState<string | null>(null);
  const [sections, setSections] = useState<Section[]>([{ id: generateId(), imageUrl: null, description: "" }]);

  const bannerInputRef = useRef<HTMLInputElement>(null);
  const sectionInputRefs = useRef<Map<string, HTMLInputElement>>(new Map());

  const pickFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    return file ? URL.createObjectURL(file) : null;
  };

  const update = (id: string, patch: Partial<Section>) =>
    setSections((prev) => prev.map((s) => (s.id === id ? { ...s, ...patch } : s)));

  const addSection = () => setSections((prev) => [...prev, { id: generateId(), imageUrl: null, description: "" }]);

  const removeSection = (id: string) => {
    if (sections.length > 1) setSections((prev) => prev.filter((s) => s.id !== id));
  };

  const handleSave = () => {
    toast.success("Itinerary saved");
    onSave();
  };

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-background">
      <TopBar onBack={onBack} title="Banner + grid" sticky />

      <div className="flex-1 overflow-y-auto pb-[calc(var(--dock-height)+var(--dock-offset)*1.75+96px)]">
        <div className="mx-auto max-w-2xl space-y-6 px-5 pt-2">
          {/* Banner */}
          <input ref={bannerInputRef} type="file" accept="image/*" className="hidden" onChange={(e) => setBannerImage(pickFile(e))} />
          <button
            type="button"
            onClick={() => bannerInputRef.current?.click()}
            className="press flex aspect-[16/9] w-full flex-col items-center justify-center gap-2 overflow-hidden rounded-2xl border-2 border-dashed border-border bg-card text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
          >
            {bannerImage ? (
              <img src={bannerImage} alt="Banner" className="h-full w-full object-cover" />
            ) : (
              <>
                <ImagePlus className="h-7 w-7" strokeWidth={1.5} />
                <span className="text-sm font-medium">Add a cover photo</span>
              </>
            )}
          </button>

          {/* Sections */}
          <div className="space-y-3">
            <p className="eyebrow">Sections · {sections.length}</p>
            {sections.map((section, index) => (
              <div key={section.id} className="surface relative flex items-start gap-3 p-3">
                <input
                  ref={(el) => {
                    if (el) sectionInputRefs.current.set(section.id, el);
                  }}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => update(section.id, { imageUrl: pickFile(e) })}
                />
                <button
                  type="button"
                  onClick={() => sectionInputRefs.current.get(section.id)?.click()}
                  className="flex h-24 w-24 shrink-0 flex-col items-center justify-center gap-1 overflow-hidden rounded-xl bg-secondary text-muted-foreground transition-colors hover:bg-primary/15"
                >
                  {section.imageUrl ? (
                    <img src={section.imageUrl} alt={`Section ${index + 1}`} className="h-full w-full object-cover" />
                  ) : (
                    <>
                      <ImagePlus className="h-5 w-5" strokeWidth={1.5} />
                      <span className="text-[11px] font-medium">Add photo</span>
                    </>
                  )}
                </button>

                <Textarea
                  placeholder="What happens here?"
                  value={section.description}
                  onChange={(e) => update(section.id, { description: e.target.value })}
                  className="min-h-[96px] flex-1 resize-none border-0 bg-secondary/60 focus-visible:ring-2"
                />

                {sections.length > 1 && (
                  <button
                    type="button"
                    onClick={() => removeSection(section.id)}
                    aria-label="Remove section"
                    className="absolute -right-2 -top-2 flex h-7 w-7 items-center justify-center rounded-full border border-border bg-card text-muted-foreground shadow-sm hover:text-destructive"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>
            ))}

            <button
              type="button"
              onClick={addSection}
              className="press flex h-14 w-full items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border text-sm font-medium text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
            >
              <Plus className="h-4 w-4" />
              Add section
            </button>
          </div>
        </div>
      </div>

      {/* Save — sits above the floating dock */}
      <div className="bottom-dock fixed inset-x-0 px-5">
        <div className="mx-auto max-w-2xl">
          <Button size="lg" onClick={handleSave} className="w-full shadow-float">
            Save itinerary
          </Button>
        </div>
      </div>
    </div>
  );
};
