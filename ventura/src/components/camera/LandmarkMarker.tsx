import { DetectedLandmark } from '@/types/camera';

interface LandmarkMarkerProps {
  landmark: DetectedLandmark;
  onClick: () => void;
}

export const LandmarkMarker = ({ landmark, onClick }: LandmarkMarkerProps) => {
  // Put the label on whichever side has more room.
  const labelLeft = landmark.position.x > 50;

  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={`Explore ${landmark.name}`}
      className="group pointer-events-auto absolute"
      style={{ left: `${landmark.position.x}%`, top: `${landmark.position.y}%`, transform: 'translate(-50%, -50%)' }}
    >
      <span className="relative flex h-11 w-11 items-center justify-center">
        <span className="absolute inset-0 rounded-full border-2 border-on-image bg-on-image/15 backdrop-blur-sm" />
        <span className="relative h-3 w-3 rounded-full bg-on-image shadow-sm" />
      </span>
      <span
        className={`glass-dark absolute top-1/2 -translate-y-1/2 whitespace-nowrap rounded-full px-3 py-1.5 text-[13px] font-medium ${
          labelLeft ? 'right-full mr-2' : 'left-full ml-2'
        }`}
      >
        {landmark.name}
      </span>
    </button>
  );
};
