import { useState } from 'react';
import { CameraViewState, DetectedLandmark, SavedLandmark } from '@/types/camera';
import { useSavedLandmarks } from '@/hooks/useSavedLandmarks';
import { LiveCameraView } from '@/components/camera/LiveCameraView';
import { AnalyzingOverlay } from '@/components/camera/AnalyzingOverlay';
import { LandmarkOverlay } from '@/components/camera/LandmarkOverlay';
import { LandmarkDetailPanel } from '@/components/camera/LandmarkDetailPanel';
import { SavedLandmarksView } from '@/components/camera/SavedLandmarksView';
import { mockLandmarks } from '@/data/mockLandmarks';
import { toast } from 'sonner';
import { useNavigate } from 'react-router-dom';

const CameraPage = () => {
  const navigate = useNavigate();
  const [viewState, setViewState] = useState<CameraViewState>('live');
  const [capturedImage, setCapturedImage] = useState<string>('');
  const [detectedLandmarks, setDetectedLandmarks] = useState<DetectedLandmark[]>([]);
  const [selectedLandmark, setSelectedLandmark] = useState<DetectedLandmark | null>(null);
  const { savedLandmarks, saveLandmark, removeLandmark, isLandmarkSaved } = useSavedLandmarks();

  const handleCapture = (imageUrl: string) => {
    setCapturedImage(imageUrl);
    setViewState('analyzing');
  };

  const handleAnalysisComplete = () => {
    // Simulate landmark detection
    setDetectedLandmarks(mockLandmarks);
    setViewState('captured');

  };

  const handleBackToCamera = () => {
    setViewState('live');
    setCapturedImage('');
    setDetectedLandmarks([]);
    setSelectedLandmark(null);
  };

  const handleBackToCaptured = () => {
    setSelectedLandmark(null);
  };

  const handleViewSaved = () => {
    setViewState('saved');
  };

  const handleClose = () => {
    // Navigate to map as fallback if no history
    if (window.history.length > 1) {
      navigate(-1);
    } else {
      navigate('/map');
    }
  };

  const handleSaveLandmark = (landmark: DetectedLandmark) => {
    const savedLandmark: SavedLandmark = {
      ...landmark,
      savedAt: Date.now(),
      capturedImageUrl: capturedImage,
    };
    saveLandmark(savedLandmark);
    toast.success('Landmark saved', { description: `${landmark.name} is in your discoveries` });
  };

  return (
    <>
      {viewState === 'live' && (
        <LiveCameraView
          savedCount={savedLandmarks.length}
          savedPreview={savedLandmarks[0]?.capturedImageUrl}
          onCapture={handleCapture}
          onClose={handleClose}
          onViewSaved={handleViewSaved}
        />
      )}

      {viewState === 'analyzing' && (
        <AnalyzingOverlay
          imageUrl={capturedImage}
          onComplete={handleAnalysisComplete}
        />
      )}

      {viewState === 'captured' && (
        <>
          <LandmarkOverlay
            imageUrl={capturedImage}
            landmarks={detectedLandmarks}
            onBack={handleBackToCamera}
            onMarkerClick={setSelectedLandmark}
            onViewSaved={handleViewSaved}
          />
          {selectedLandmark && (
            <LandmarkDetailPanel
              landmark={selectedLandmark}
              heroImage={capturedImage}
              onClose={handleBackToCaptured}
              isSaved={isLandmarkSaved(selectedLandmark.id)}
              onSave={() => handleSaveLandmark(selectedLandmark)}
              onGoToSaved={handleViewSaved}
            />
          )}
        </>
      )}

      {viewState === 'saved' && (
        <SavedLandmarksView
          landmarks={savedLandmarks}
          onBack={handleBackToCamera}
          onRemove={removeLandmark}
        />
      )}
    </>
  );
};

export default CameraPage;
