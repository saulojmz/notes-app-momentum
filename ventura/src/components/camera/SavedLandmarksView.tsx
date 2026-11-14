import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SavedLandmark } from '@/types/camera';
import { SavedLandmarkCard } from './SavedLandmarkCard';
import { EmptyStateView } from './EmptyStateView';
import { LandmarkDetailPanel } from './LandmarkDetailPanel';
import { Chip, ChipRow, TopBar } from '@/components/kit';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface SavedLandmarksViewProps {
  landmarks: SavedLandmark[];
  onBack: () => void;
  onRemove: (id: string) => void;
}

const regions = ['All', 'Europe', 'Africa', 'Asia', 'Americas', 'Oceania'];

export const SavedLandmarksView = ({ landmarks, onRemove }: SavedLandmarksViewProps) => {
  const navigate = useNavigate();
  const [selectedRegion, setSelectedRegion] = useState('All');
  const [selectedLandmark, setSelectedLandmark] = useState<SavedLandmark | null>(null);
  const [landmarkToRemove, setLandmarkToRemove] = useState<string | null>(null);

  const filtered = selectedRegion === 'All' ? landmarks : landmarks.filter((l) => l.region === selectedRegion);
  const countries = new Set(landmarks.map((l) => l.location.split(',').pop()?.trim())).size;

  const handleRemoveConfirm = () => {
    if (!landmarkToRemove) return;
    onRemove(landmarkToRemove);
    setLandmarkToRemove(null);
    setSelectedLandmark(null);
  };

  return (
    <div className="fixed inset-0 overflow-y-auto bg-background">
      <TopBar onBack={() => navigate('/map')} sticky />

      <div className="mx-auto max-w-2xl px-5 pb-12">
        <header className="pb-5">
          <p className="eyebrow">
            {landmarks.length} saved · {countries} {countries === 1 ? 'place' : 'places'}
          </p>
          <h1 className="text-display mt-2 text-[44px]">Discoveries</h1>
        </header>

        <ChipRow className="mb-6">
          {regions.map((region) => (
            <Chip key={region} size="sm" selected={selectedRegion === region} onClick={() => setSelectedRegion(region)}>
              {region}
            </Chip>
          ))}
        </ChipRow>

        {filtered.length === 0 ? (
          <EmptyStateView />
        ) : (
          <div className="stagger grid grid-cols-2 gap-x-3 gap-y-6 sm:grid-cols-3">
            {filtered.map((landmark) => (
              <SavedLandmarkCard
                key={landmark.id}
                landmark={landmark}
                onClick={() => setSelectedLandmark(landmark)}
                onRemove={() => setLandmarkToRemove(landmark.id)}
              />
            ))}
          </div>
        )}
      </div>

      {selectedLandmark && <LandmarkDetailPanel landmark={selectedLandmark} heroImage={selectedLandmark.capturedImageUrl} onClose={() => setSelectedLandmark(null)} />}

      <AlertDialog open={!!landmarkToRemove} onOpenChange={(open) => !open && setLandmarkToRemove(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove landmark?</AlertDialogTitle>
            <AlertDialogDescription>It will be removed from your discoveries. This can't be undone.</AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRemoveConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
