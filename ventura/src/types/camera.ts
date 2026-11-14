export interface LandmarkFact {
  id: string;
  title: string;
  description: string;
  thumbnailUrl: string;
}

export interface LandmarkImage {
  id: string;
  url: string;
  caption: string;
  type: 'angle' | 'historic' | 'artistic';
}

export interface DetectedLandmark {
  id: string;
  name: string;
  category: string;
  position: {
    x: number; // percentage 0-100
    y: number; // percentage 0-100
  };
  summary: string;
  fullDescription: string;
  facts: LandmarkFact[];
  images: LandmarkImage[];
  region: 'Europe' | 'Africa' | 'Asia' | 'Americas' | 'Oceania';
  location: string;
  distance: string;
}

export interface SavedLandmark extends DetectedLandmark {
  savedAt: number;
  capturedImageUrl: string;
}

export type CameraViewState = 'live' | 'analyzing' | 'captured' | 'saved';
