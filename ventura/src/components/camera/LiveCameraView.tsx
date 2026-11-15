import { ArrowLeft, ScanSearch, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SmartImage } from '@/components/kit';
import edinburghCastleImage from '@/assets/edinburgh-castle.jpg';

interface LiveCameraViewProps {
  onCapture: (imageUrl: string) => void;
  onClose: () => void;
  onViewSaved: () => void;
  savedCount?: number;
  savedPreview?: string;
}

const Corner = ({ className }: { className: string }) => (
  <div className={`absolute h-10 w-10 border-on-image/90 ${className}`} />
);

export const LiveCameraView = ({ onCapture, onClose, onViewSaved, savedCount = 0, savedPreview }: LiveCameraViewProps) => (
  <div className="fixed inset-0 bg-scrim">
    {/* Static stand-in for the live camera feed */}
    <img src={edinburghCastleImage} alt="Camera view of Edinburgh Castle" className="absolute inset-0 h-full w-full object-cover" />
    <div className="scrim-t absolute inset-x-0 top-0 h-40" />
    <div className="absolute inset-x-0 bottom-0 h-56 bg-gradient-to-t from-scrim/70 to-transparent" />

    {/* Viewfinder */}
    <div className="pointer-events-none absolute inset-x-8 bottom-[200px] top-28 animate-fade-in">
      <Corner className="left-0 top-0 rounded-tl-2xl border-l-2 border-t-2" />
      <Corner className="right-0 top-0 rounded-tr-2xl border-r-2 border-t-2" />
      <Corner className="bottom-0 left-0 rounded-bl-2xl border-b-2 border-l-2" />
      <Corner className="bottom-0 right-0 rounded-br-2xl border-b-2 border-r-2" />
    </div>

    {/* Top bar */}
    <div className="top-safe absolute inset-x-0 z-20 flex items-center justify-between px-4">
      <Button variant="glass-dark" size="icon" onClick={onClose} aria-label="Back">
        <ArrowLeft className="!size-5" />
      </Button>
      <span className="glass-dark flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium">
        <ScanSearch className="h-4 w-4" />
        Point at a landmark
      </span>
      <span className="w-11" />
    </div>

    {/* Controls */}
    <div className="absolute inset-x-0 bottom-0 z-20 flex items-center justify-between px-8 pb-[max(env(safe-area-inset-bottom),40px)]">
      <button
        type="button"
        onClick={onViewSaved}
        aria-label={`View saved landmarks (${savedCount})`}
        className="press relative h-14 w-14 overflow-hidden rounded-2xl border-2 border-on-image/80 bg-scrim/40"
      >
        {savedPreview ? (
          <SmartImage src={savedPreview} alt="" className="h-full w-full object-cover" />
        ) : (
          <Landmark className="m-auto h-6 w-6 text-on-image" />
        )}
        {savedCount > 0 && (
          <span className="absolute right-1 top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1 tabular-nums text-[10px] font-medium text-primary-foreground">
            {savedCount}
          </span>
        )}
      </button>

      <button
        type="button"
        onClick={() => onCapture(edinburghCastleImage)}
        aria-label="Capture photo"
        className="group flex h-[78px] w-[78px] items-center justify-center rounded-full border-[3px] border-on-image"
      >
        <span className="h-[62px] w-[62px] rounded-full bg-on-image transition-transform duration-150 group-active:scale-90" />
      </button>

      <span className="w-14" />
    </div>
  </div>
);
