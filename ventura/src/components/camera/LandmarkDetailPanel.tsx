import { useState } from 'react';
import { ArrowLeft, Bookmark, ArrowRight, Landmark, Check, MapPin } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Skeleton } from '@/components/ui/skeleton';
import { DetectedLandmark } from '@/types/camera';
import { useLandmarkImages } from '@/hooks/useLandmarkImages';
import { SmartImage, StickyFooter } from '@/components/kit';
import { cn } from '@/lib/utils';

interface LandmarkDetailPanelProps {
  landmark: DetectedLandmark;
  onClose: () => void;
  isSaved?: boolean;
  onSave?: () => void;
  onGoToSaved?: () => void;
  /** The user's own photo; leads the gallery. */
  heroImage?: string;
}

/** Fact illustration that quietly disappears if the remote image is gone. */
const FactImage = ({ src, alt }: { src?: string; alt: string }) => {
  const [hidden, setHidden] = useState(!src);
  if (hidden) return null;
  return <img src={src} alt={alt} loading="lazy" onError={() => setHidden(true)} className="aspect-[16/9] w-full rounded-2xl object-cover" />;
};

/**
 * Full-screen landmark story. Rendered with the `.dark` token set so it feels
 * immersive after the camera, without any one-off colours.
 */
export const LandmarkDetailPanel = ({ landmark, onClose, isSaved = false, onSave, onGoToSaved, heroImage }: LandmarkDetailPanelProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);
  const [justSaved, setJustSaved] = useState(false);

  const { carouselImages, factImages, isLoading } = useLandmarkImages(landmark.name, landmark.location, landmark.facts);
  const [failed, setFailed] = useState<Set<string>>(new Set());
  const remote = carouselImages.length > 0 ? carouselImages : landmark.images.map((img) => img.url);
  const displayImages = [...new Set([heroImage, ...remote])].filter((src): src is string => !!src && !failed.has(src));
  const activeIndex = Math.min(currentImageIndex, Math.max(0, displayImages.length - 1));
  const markFailed = (src: string) => setFailed((prev) => new Set(prev).add(src));
  const showSavedState = isSaved || justSaved;

  const handleSave = () => {
    if (!onSave) return;
    onSave();
    setJustSaved(true);
  };

  return (
    <div className="dark fixed inset-0 z-50 flex flex-col bg-background text-foreground animate-slide-in-right">
      {/* Top bar */}
      <header className="pt-safe shrink-0">
        <div className="flex h-16 items-center justify-between px-3">
          <Button variant="ghost" size="icon" onClick={onClose} aria-label="Back">
            <ArrowLeft className="!size-5" />
          </Button>
          <span className="meta">Captured just now</span>
          {onGoToSaved ? (
            <Button variant="ghost" size="icon" onClick={onGoToSaved} aria-label="View saved landmarks">
              <Landmark className="!size-5" />
            </Button>
          ) : (
            <span className="w-11" />
          )}
        </div>
      </header>

      <div className="flex min-h-0 flex-1 flex-col overflow-y-auto">
        <div className="mx-auto w-full max-w-xl flex-1">
          {/* Gallery */}
          <div className="relative px-4">
            {isLoading ? (
              <Skeleton className="h-72 w-full rounded-2xl" />
            ) : (
              <SmartImage
                key={displayImages[activeIndex]}
                src={displayImages[activeIndex]}
                alt={landmark.name}
                onError={() => markFailed(displayImages[activeIndex])}
                className="h-72 w-full rounded-2xl object-cover"
              />
            )}
            {displayImages.length > 1 && !isLoading && (
              <div className="glass-dark absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5 rounded-full px-2.5 py-2">
                {displayImages.map((_, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setCurrentImageIndex(idx)}
                    aria-label={`View image ${idx + 1}`}
                    className={cn('h-1.5 rounded-full transition-colors', idx === activeIndex ? 'w-5 bg-on-image' : 'w-1.5 bg-on-image/45')}
                  />
                ))}
              </div>
            )}
          </div>

          {/* Story */}
          <div className="space-y-5 px-5 pb-10 pt-6">
            <div className="space-y-3">
              <Badge variant="secondary">{landmark.category}</Badge>
              <h2 className="text-display text-[36px]">{landmark.name}</h2>
              <p className="flex items-center gap-1.5 text-[13px] text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" />
                {landmark.location} · {landmark.distance}
              </p>
            </div>

            <div>
              <p className="text-[16px] leading-relaxed text-foreground/85">
                {isExpanded ? landmark.fullDescription : landmark.summary}
              </p>
              {!isExpanded && (
                <button type="button" onClick={() => setIsExpanded(true)} className="mt-2 text-sm font-medium text-primary hover:underline">
                  Read more
                </button>
              )}
            </div>

            {landmark.facts.length > 0 && (
              <section className="space-y-6 pt-4">
                <p className="eyebrow">Worth knowing</p>
                {landmark.facts.map((fact, i) => (
                  <article key={fact.id} className="space-y-3">
                    {isLoading ? (
                      <Skeleton className="aspect-[16/9] w-full rounded-2xl" />
                    ) : (
                      <FactImage src={factImages[fact.id] || fact.thumbnailUrl} alt={fact.title} />
                    )}
                    <div className="flex gap-3">
                      <span className="text-display text-2xl tabular-nums text-muted-foreground">{String(i + 1).padStart(2, '0')}</span>
                      <div>
                        <h4 className="font-medium">{fact.title}</h4>
                        <p className="mt-1 text-sm leading-relaxed text-muted-foreground">{fact.description}</p>
                      </div>
                    </div>
                  </article>
                ))}
              </section>
            )}
          </div>
        </div>

        {(onSave || onGoToSaved) && (
          <StickyFooter>
            <div className="mx-auto max-w-xl">
              {showSavedState ? (
                <div className="flex items-center gap-2">
                  <span className="flex h-[52px] flex-1 items-center justify-center gap-2 rounded-full bg-success/15 text-sm font-medium text-success">
                    <Check className="h-4 w-4" />
                    Saved to discoveries
                  </span>
                  {onGoToSaved && (
                    <Button variant="secondary" size="lg" onClick={onGoToSaved}>
                      View all
                      <ArrowRight />
                    </Button>
                  )}
                </div>
              ) : (
                <Button size="lg" onClick={handleSave} className="w-full">
                  <Bookmark />
                  Save landmark
                </Button>
              )}
            </div>
          </StickyFooter>
        )}
      </div>
    </div>
  );
};
