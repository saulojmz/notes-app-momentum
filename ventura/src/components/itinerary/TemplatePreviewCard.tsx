import { Plus } from "lucide-react";

interface TemplatePreviewCardProps {
  templateId: string;
  onSelect: (templateId: string) => void;
}

/** Wireframe thumbnail of a layout template. */
export const TemplatePreviewCard = ({ templateId, onSelect }: TemplatePreviewCardProps) => (
  <button
    type="button"
    onClick={() => onSelect(templateId)}
    className="press flex h-full w-full items-center justify-center"
    aria-label={`Use ${templateId} template`}
  >
    {templateId === "custom" && <CustomTemplate />}
    {templateId === "banner-grid" && <BannerGridTemplate />}
    {templateId === "thumbnail-description" && <ThumbnailDescriptionTemplate />}
    {templateId === "banner-tabs-picture" && <BannerTabsPictureTemplate />}
  </button>
);

const Frame = ({ children, dashed }: { children: React.ReactNode; dashed?: boolean }) => (
  <div
    className={
      dashed
        ? "flex aspect-[3/4] w-full max-w-[260px] flex-col items-center justify-center gap-3 rounded-3xl border-2 border-dashed border-border bg-card"
        : "flex aspect-[3/4] w-full max-w-[260px] flex-col gap-2.5 rounded-3xl bg-card p-3.5 shadow-lg"
    }
  >
    {children}
  </div>
);

const Lines = ({ widths }: { widths: string[] }) => (
  <div className="flex flex-1 flex-col gap-1.5">
    {widths.map((w, i) => (
      <div key={i} className={`h-1.5 rounded-full ${i === 0 ? "bg-foreground/25" : "bg-foreground/10"}`} style={{ width: w }} />
    ))}
  </div>
);

const Block = ({ className = "" }: { className?: string }) => <div className={`rounded-lg bg-primary/15 ${className}`} />;

const CustomTemplate = () => (
  <Frame dashed>
    <div className="flex h-14 w-14 items-center justify-center rounded-full bg-secondary">
      <Plus className="h-6 w-6 text-muted-foreground" />
    </div>
    <span className="text-sm font-medium text-muted-foreground">Blank canvas</span>
  </Frame>
);

const BannerGridTemplate = () => (
  <Frame>
    <Block className="h-20 bg-primary/25" />
    <div className="flex flex-1 flex-col gap-2.5 rounded-2xl bg-secondary p-2.5">
      {[0, 1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-2.5">
          <Block className="h-9 w-9 shrink-0" />
          <Lines widths={["100%", "70%"]} />
        </div>
      ))}
    </div>
  </Frame>
);

const ThumbnailDescriptionTemplate = () => (
  <Frame>
    <Block className="h-28 bg-primary/25" />
    <div className="flex gap-2.5 rounded-2xl bg-secondary p-2.5">
      <Block className="h-11 w-11 shrink-0" />
      <Lines widths={["100%", "100%", "60%"]} />
    </div>
    <div className="flex gap-2.5 rounded-2xl border border-border p-2.5">
      <Block className="h-9 w-9 shrink-0" />
      <Lines widths={["100%", "45%"]} />
    </div>
  </Frame>
);

const BannerTabsPictureTemplate = () => (
  <Frame>
    <Block className="h-14 bg-primary/25" />
    <div className="flex justify-center gap-1.5">
      <div className="h-5 w-12 rounded-full bg-secondary" />
      <div className="h-5 w-12 rounded-full bg-secondary" />
      <div className="h-5 w-12 rounded-full bg-ink" />
    </div>
    <Block className="min-h-[72px] flex-1" />
    <div className="rounded-2xl bg-secondary p-2.5">
      <Lines widths={["100%", "100%", "75%"]} />
    </div>
  </Frame>
);
