import { useState, useEffect } from 'react';
import { SavedLandmark } from '@/types/camera';
import { europeanLandmarks } from '@/data/europeanLandmarks';

const STORAGE_KEY = 'ventura_saved_landmarks';
const LANDMARKS_VERSION = 'v3'; // Increment to force refresh with new landmark data

export const useSavedLandmarks = () => {
  const [savedLandmarks, setSavedLandmarks] = useState<SavedLandmark[]>([]);

  useEffect(() => {
    const storedVersion = localStorage.getItem(`${STORAGE_KEY}_version`);
    
    // If version changed or no version, reset to default landmarks
    if (storedVersion !== LANDMARKS_VERSION) {
      setSavedLandmarks(europeanLandmarks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(europeanLandmarks));
      localStorage.setItem(`${STORAGE_KEY}_version`, LANDMARKS_VERSION);
      return;
    }

    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        if (parsed.length > 0) {
          setSavedLandmarks(parsed);
        } else {
          setSavedLandmarks(europeanLandmarks);
          localStorage.setItem(STORAGE_KEY, JSON.stringify(europeanLandmarks));
        }
      } catch (e) {
        console.error('Failed to load saved landmarks:', e);
        setSavedLandmarks(europeanLandmarks);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(europeanLandmarks));
      }
    } else {
      setSavedLandmarks(europeanLandmarks);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(europeanLandmarks));
    }
  }, []);

  const saveLandmark = (landmark: SavedLandmark) => {
    setSavedLandmarks((prev) => {
      const exists = prev.find((l) => l.id === landmark.id);
      if (exists) return prev;
      
      const updated = [landmark, ...prev];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const removeLandmark = (id: string) => {
    setSavedLandmarks((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const isLandmarkSaved = (id: string) => {
    return savedLandmarks.some((l) => l.id === id);
  };

  const getLandmarksByRegion = (region: string) => {
    if (region === 'All') return savedLandmarks;
    return savedLandmarks.filter((l) => l.region === region);
  };

  return {
    savedLandmarks,
    saveLandmark,
    removeLandmark,
    isLandmarkSaved,
    getLandmarksByRegion,
  };
};
