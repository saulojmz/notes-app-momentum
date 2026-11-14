import { useState, useEffect } from 'react';
import { SavedLandmark } from '@/types/camera';
import { europeanLandmarks } from '@/data/europeanLandmarks';
import { storage } from '@/lib/storage';

const STORAGE_KEY = 'ventura_saved_landmarks';
const LANDMARKS_VERSION = 'v4'; // Increment to force refresh with new landmark data

export const useSavedLandmarks = () => {
  const [savedLandmarks, setSavedLandmarks] = useState<SavedLandmark[]>([]);

  useEffect(() => {
    // Seed with the sample discoveries when the stored data is from an older version or missing.
    const storedVersion = storage.getRaw(`${STORAGE_KEY}_version`);
    const stored = storage.get<SavedLandmark[]>(STORAGE_KEY, []);
    if (storedVersion !== LANDMARKS_VERSION || stored.length === 0) {
      setSavedLandmarks(europeanLandmarks);
      storage.set(STORAGE_KEY, europeanLandmarks);
      storage.setRaw(`${STORAGE_KEY}_version`, LANDMARKS_VERSION);
      return;
    }
    setSavedLandmarks(stored);
  }, []);

  const saveLandmark = (landmark: SavedLandmark) => {
    setSavedLandmarks((prev) => {
      const exists = prev.find((l) => l.id === landmark.id);
      if (exists) return prev;
      
      const updated = [landmark, ...prev];
      storage.set(STORAGE_KEY, updated);
      return updated;
    });
  };

  const removeLandmark = (id: string) => {
    setSavedLandmarks((prev) => {
      const updated = prev.filter((l) => l.id !== id);
      storage.set(STORAGE_KEY, updated);
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
