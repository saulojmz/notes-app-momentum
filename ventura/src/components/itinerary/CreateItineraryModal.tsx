import { useState } from "react";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { TemplateCarousel } from "./TemplateCarousel";
import { BannerGridEditor } from "./BannerGridEditor";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Chip } from "@/components/kit";
import { ArrowLeft, Minus, Plus } from "lucide-react";
import { toast } from "sonner";

interface CreateItineraryModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type Step = "template" | "details" | "editor" | "generating";

const FOCUS = ["Food", "Culture", "Nature", "History", "Shopping", "Nightlife"];
const emptyForm = { destination: "", duration: 3, title: "", tags: [] as string[], category: "" };

export const CreateItineraryModal = ({ open, onOpenChange }: CreateItineraryModalProps) => {
  const [step, setStep] = useState<Step>("template");
  const [selectedTemplate, setSelectedTemplate] = useState<string>("");
  const [formData, setFormData] = useState(emptyForm);

  const reset = () => {
    setStep("template");
    setSelectedTemplate("");
    setFormData(emptyForm);
  };

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    setStep(templateId === "banner-grid" ? "editor" : "details");
  };

  const handleGenerateItinerary = async () => {
    if (!formData.destination || !formData.duration) {
      toast.error("Add a destination to continue");
      return;
    }
    setStep("generating");
    try {
      // Simulated AI generation
      await new Promise((resolve) => setTimeout(resolve, 2000));
      toast.success("Itinerary generated");
      onOpenChange(false);
      reset();
    } catch {
      toast.error("Failed to generate itinerary");
      setStep("details");
    }
  };

  const handleBack = () => {
    if (step === "details" || step === "editor") setStep("template");
  };

  const handleClose = () => {
    onOpenChange(false);
    reset();
  };

  if (open && step === "template") {
    return <TemplateCarousel onSelectTemplate={handleTemplateSelect} onClose={handleClose} />;
  }

  if (open && step === "editor" && selectedTemplate === "banner-grid") {
    return <BannerGridEditor onBack={handleBack} onSave={handleClose} />;
  }

  const setDuration = (d: number) => setFormData({ ...formData, duration: Math.min(30, Math.max(1, d)) });

  return (
    <Dialog open={open && step !== "template"} onOpenChange={(o) => (o ? onOpenChange(o) : handleClose())}>
      <DialogContent className="max-h-[88vh] overflow-y-auto">
        {step === "details" && (
          <>
            <DialogHeader className="space-y-2 text-left">
              <button
                type="button"
                onClick={handleBack}
                className="-ml-1 mb-1 flex h-8 w-8 items-center justify-center rounded-full hover:bg-accent"
                aria-label="Back to templates"
              >
                <ArrowLeft className="h-4 w-4" />
              </button>
              <p className="eyebrow">Step 2 of 2</p>
              <DialogTitle>Tell us about the trip</DialogTitle>
              <DialogDescription>We'll draft a day-by-day plan you can edit.</DialogDescription>
            </DialogHeader>

            <div className="space-y-5 pt-2">
              <div className="space-y-2">
                <Label htmlFor="destination">Destination</Label>
                <Input
                  id="destination"
                  placeholder="Where are you going?"
                  value={formData.destination}
                  onChange={(e) => setFormData({ ...formData, destination: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration</Label>
                <div className="flex items-center justify-between rounded-xl border border-input bg-card p-1.5 pl-4">
                  <span id="duration" className="text-[15px] tabular-nums">
                    {formData.duration} {formData.duration === 1 ? "day" : "days"}
                  </span>
                  <div className="flex gap-1">
                    <Button variant="secondary" size="icon-sm" onClick={() => setDuration(formData.duration - 1)} aria-label="Fewer days">
                      <Minus />
                    </Button>
                    <Button variant="secondary" size="icon-sm" onClick={() => setDuration(formData.duration + 1)} aria-label="More days">
                      <Plus />
                    </Button>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="title">
                  Title <span className="font-normal text-muted-foreground">· optional</span>
                </Label>
                <Input
                  id="title"
                  placeholder="Give your trip a name"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div className="space-y-2">
                <Label>
                  Focus <span className="font-normal text-muted-foreground">· optional</span>
                </Label>
                <div className="flex flex-wrap gap-2">
                  {FOCUS.map((cat) => (
                    <Chip
                      key={cat}
                      size="sm"
                      selected={formData.category === cat}
                      onClick={() => setFormData({ ...formData, category: formData.category === cat ? "" : cat })}
                    >
                      {cat}
                    </Chip>
                  ))}
                </div>
              </div>

              <Button className="w-full" size="lg" onClick={handleGenerateItinerary}>
                Generate itinerary
              </Button>
            </div>
          </>
        )}

        {step === "generating" && (
          <div className="space-y-5 py-10 text-center">
            <DialogTitle className="sr-only">Creating your itinerary</DialogTitle>
            <div className="space-y-1.5">
              <h3 className="text-title text-xl">Building your itinerary</h3>
              <p className="text-sm text-muted-foreground">Ordering stops by area and opening hours</p>
            </div>
            <div className="relative mx-auto h-1 w-48 overflow-hidden rounded-full bg-secondary" role="progressbar" aria-label="Generating">
              <div className="progress-run rounded-full" />
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};
