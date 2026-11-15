import { ArrowLeft, Landmark } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { DetectedLandmark } from '@/types/camera';
import { LandmarkMarker } from './LandmarkMarker';

interface LandmarkOverlayProps {
  imageUrl: string;
  landmarks: DetectedLandmark[];
  onBack: () => void;
  onMarkerClick: (landmark: DetectedLandmark) => void;
  onViewSaved?: () => void;
}

export const LandmarkOverlay = ({ imageUrl, landmarks, onBack, onMarkerClick, onViewSaved }: LandmarkOverlayProps) => (
  <div className="fixed inset-0 bg-scrim">
    <img src={imageUrl} alt="Captured" className="absolute inset-0 h-full w-full object-cover" />
    <div className="scrim-t absolute inset-x-0 top-0 h-40" />

    {/* Top bar */}
    <div className="top-safe absolute inset-x-0 z-20 flex items-center justify-between px-4">
      <Button variant="glass-dark" size="icon" onClick={onBack} aria-label="Back to camera">
        <ArrowLeft className="!size-5" />
      </Button>
      <span className="glass-dark flex h-9 items-center gap-2 rounded-full px-3.5 text-[13px] font-medium">
        <span className="tabular-nums ">{landmarks.length}</span> found · tap to explore
      </span>
      {onViewSaved ? (
        <Button variant="glass-dark" size="icon" onClick={onViewSaved} aria-label="View saved landmarks">
          <Landmark className="!size-5" />
        </Button>
      ) : (
        <span className="w-11" />
      )}
    </div>

    {/* Markers */}
    <div className="pointer-events-none absolute inset-0 z-10">
      {landmarks.map((landmark, index) => (
        <div key={landmark.id} className="pointer-events-none absolute inset-0 animate-fade-scale-in" style={{ animationDelay: `${index * 80}ms` }}>
          <LandmarkMarker landmark={landmark} onClick={() => onMarkerClick(landmark)} />
        </div>
      ))}
    </div>

  </div>
);
