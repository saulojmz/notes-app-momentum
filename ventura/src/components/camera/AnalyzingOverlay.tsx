import { useEffect, useState } from 'react';
import { Loader2 } from 'lucide-react';

interface AnalyzingOverlayProps {
  imageUrl: string;
  onComplete: () => void;
}

export const AnalyzingOverlay = ({ imageUrl, onComplete }: AnalyzingOverlayProps) => {
  const [showScan, setShowScan] = useState(false);

  useEffect(() => {
    const scanTimer = setTimeout(() => setShowScan(true), 50);
    const completeTimer = setTimeout(onComplete, 900);
    return () => {
      clearTimeout(scanTimer);
      clearTimeout(completeTimer);
    };
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-50 bg-scrim">
      <img src={imageUrl} alt="Captured" className="h-full w-full object-cover" />
      <div className="absolute inset-0 bg-scrim/40 animate-fade-only" />
      {showScan && (
        <div className="absolute inset-0 overflow-hidden">
          <div className="scan-line" />
        </div>
      )}
      <div className="absolute inset-0 flex items-center justify-center">
        <span className="glass-dark flex h-11 items-center gap-2.5 rounded-full px-5 text-sm font-medium animate-scale-in">
          <Loader2 className="h-4 w-4 animate-spin" />
          Identifying landmarks…
        </span>
      </div>
    </div>
  );
};
